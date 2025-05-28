# Built-in libraries
import os
import io
import json
import re
from requests.auth import HTTPBasicAuth
import pickle
import math
import time
from datetime import datetime
from collections import defaultdict, Counter
from functools import partial

# External libraries
import mhcnames
import requests
import pywebio
from pywebio import start_server, config
from pywebio.input import *
from pywebio.output import *
from pywebio.pin import *
from pywebio.session import set_env
import spacy
from spacy import displacy
from spacy.tokens import Span
from spacy.util import filter_spans
import pandas as pd
from rapidfuzz import process, fuzz, utils

# Custom modules
# from utils.helpers import *
from template.template import get_entity_template

# Set environment variable
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

nlp = spacy.blank("en")

colors =     {"Disease": "#7aecec",
"Drug": "#bfeeb7",
"Species": "#feca74",
"HLA": "#ff9561",
"Gene": "#aa9cfc",
"CellLine": "#c887fb"}

server_URL = "http://ariadne.is.inf.uni-due.de:7777/medline/_msearch" #"http://172.22.50.111:10200/medline/_msearch"

options = {"colors": colors, "template": get_entity_template()}


# Global variables initialization
global sortstate, highlighting, ranking, article_types, from_date, to_date
sortstate = "desc"
highlighting = []
ranking = "Frequency"
article_types = []
from_date = ""
to_date = ""




def load_lut():
    def process_lut(file_name, prefix=""):
        lut = defaultdict(str)
        with open(file_name, errors='ignore') as f:
            for line in f:
                key, val = map(str.strip, line.split("||"))
                lut[prefix + key] = val.capitalize()
        return lut
    
    generic_lut = process_lut('/Users/hlahusain/MSearchEngine/WisPerMed_SearchEngine/Server/src/drug_lut.txt')
    generic_lut.update(process_lut("/Users/hlahusain/MSearchEngine/WisPerMed_SearchEngine/Server/src/mesh_lut.txt", "MESH:"))
    generic_lut.update(process_lut("/Users/hlahusain/MSearchEngine/WisPerMed_SearchEngine/Server/src/gene_lut.txt"))
    
    return generic_lut

def get_article_types_query(article_types):
    art_query = " publication_types:("
    query_string = ""
    types = []
    #encapsulate brackets
    for type in article_types:
        types.append("(" + type + ")")
    for type in types:
        query_string = query_string + type + " OR "
        
    return art_query + query_string.rstrip(" OR ") + ")"
    
def elastic_query(query, search_limit, concept_query=False):
    global sortstate, article_types, to_date, from_date, doc_amount

    # clear documents and reset search window
    # for item in ['documents', 'pagination', 'filter', 'retrieved_result']:
    #     clear(item)

    # cur_time = time.time()

    # Construct the query based on parameters



    if not concept_query:
        print('concept_query',concept_query)
        if article_types:
            query += get_article_types_query(article_types)
        if to_date and from_date:
            query += f" timestamp:[{from_date} TO {to_date}]"

    


    fields = "[\"concepts\"]" if concept_query else "[\"title\",\"abstract\"]"
    payload = f"{{\"preference\":\"result\"}}\r\n{{\"query\":{{\"{'simple_query_string' if concept_query else 'query_string'}\":{{\"query\":\"{query}\",\"fields\":{fields},\"default_operator\":\"and\"}}}},\"size\":{search_limit},\"from\":0, \"sort\": [{{\"timestamp\": {{\"order\": \"{sortstate}\"}}}}]}}\n"

    # print('query ===' , query , 'concept_query' , concept_query , 'fields' , fields , 'sortstate' , sortstate,'search_limit', search_limit)


    # get abstracts
    # with put_loading(shape='grow', color='info').style('margin-left:45%;'):
    headers = {'content-type': "application/json", 'charset': 'UTF-8'}
    if "uni-due" in server_URL:
        global_data = requests.request("POST", server_URL, data=payload, headers=headers, auth = HTTPBasicAuth('elastic', 'ppiiPPhh22iieell55aaaatt')).json()
    else:
        global_data = requests.request("POST", server_URL, data=payload, headers=headers).json()
    
    # Assuming global_data is a list containing dictionaries
    # print('global_data responses == ',global_data['responses'][0])


    doc_amount = len(global_data['responses'][0]['hits']['hits'])
    # print('doc_amount' , doc_amount)
    return global_data['responses'][0]
     

def obtain_frequencies(documents):
    global chemicals, diseases, species, genes, hlas, p_mutations, snp_mutations, dna_mutations, mesh_to_mention, transactions

    chemicals, diseases, p_mutations, snp_mutations, dna_mutations, species, genes, hlas, transactions = [], [], [], [], [], [], [], [], []
    mesh_to_mention = defaultdict(str)

    # Mapping entity types to corresponding global variables
    entity_mapping = {
        "Chemical": chemicals,
        "Disease": diseases,
        "Species": species,
        "HLA": hlas,
        "Gene": genes,
        "ProteinMutation": p_mutations,
        "SNP": snp_mutations,
        "DNAMutation": dna_mutations,
    }

    # Iterate over the documents
    for document in documents:
        global_pmid = document['_source']['pmid']

        # Save concepts
        if document['_source']['concepts']:
            concept_dictionary[global_pmid] = json.loads(document['_source']['concepts'])

        bucket = []
        if concept_dictionary is not None :
            if global_pmid in concept_dictionary:
                for entity in concept_dictionary[global_pmid]:
                    if entity['id'] != "CUI-less":
                        mesh_to_mention[entity['id']] = generic_lut.get(entity['id'], entity['entity'])
                        bucket.append(entity['id'])

                    entity_type = entity['type'].strip()
                    entity_id = entity['id'].strip()

                    if entity_id != "" and entity_id != "-" and entity_type in entity_mapping:
                        entity_mapping[entity_type].append(entity_id)

            transactions.append(tuple(bucket))

        return transactions,concept_dictionary
def rerank(concepts):
    global doc_amount, ranking, frequency_dict
    
    if ranking == 'Kullback-Leibler-Divergenz':
        return compute_kld_ranking(concepts)
    elif ranking == 'Frequency':
        return compute_frequency_ranking(concepts)

def compute_kld_ranking(concepts):
    query_size = doc_amount
    corpus_size = 35329127
    aggregated_concepts = Counter(concepts)
    
    def get_kld_score(key, freq):
        pr_t = freq / query_size
        pr_c = frequency_dict[key] / corpus_size
        return round(pr_t * math.log(pr_t / pr_c), 5) if pr_c != 0 else 0
    
    ranked_concepts = {key: get_kld_score(key, freq) for key, freq in aggregated_concepts.items()}
    kld_ranked = dict(sorted(ranked_concepts.items(), key=lambda item: item[1], reverse=True))
    
    return list(kld_ranked.keys()), list(kld_ranked.values())

def compute_frequency_ranking(concepts):
    freq_counter = Counter(concepts)
    if not freq_counter:
        return [],[]
    
    top, counts = zip(*freq_counter.most_common())
    return top, counts

def filter_item(row_id, type, items):
    global concept_filter, search_window
    search_window = 0
    item = items[row_id]
    in_filter = item in concept_filter

    if in_filter:
        concept_filter.remove(item)
    else:
        concept_filter.append(item)

    label = item.split(';')[0] if ';' in item else item
    scope = type + str(row_id)
    outline = in_filter
    color = 'info' if in_filter else 'success'

    with use_scope(scope):
        clear(scope)
        put_button(label, onclick=partial(filter_item, row_id=row_id, items=items, type=type), small=True, outline=outline, color=color)

    render_abstracts(documents)



def add_filter(limit):
    global concept_filter
    concept_filter = []

    entities = [
        ("diseases", diseases),
        ("drugs", chemicals),
        ("genes", genes),
        ("species", species),
        ("hlas", hlas),
        ("pmutations", p_mutations),
        ("snpmutations", snp_mutations),
        ("dnamutations", dna_mutations)
    ]
    
    def generate_rows(top_items, counts, prefix):
        rows = []
        for i, item in enumerate(top_items[:50]):
            mention = mesh_to_mention[item].split(';')[0] if ';' in item else mesh_to_mention[item]
            rows.append([mention, counts[i]])
        print('rows ==== ' , rows)    
        return rows

    def generate_dataframe(items, counts, col_name):
        return pd.DataFrame({col_name: items, "Rank": counts})
    
    tabs_content = []
    merged_dfs = []

    for prefix, entity in entities:
        top_items, counts = rerank(entity)
        rows = generate_rows(top_items, counts, prefix+"_")
        return rows
        # df = generate_dataframe(top_items, counts, prefix.capitalize())
        # merged_dfs.append(df)

    #     content = put_scrollable(put_table(rows).style("display:inline-table"), height=350)
    #     tabs_content.append({'title': prefix.capitalize(), 'content': content})

    # merged_df = pd.concat(merged_dfs, axis=1)
    # handle = merged_df.to_csv(index=False).encode('utf-8')
    # tabs_content.append({'title': 'Export Data', 'content': put_file('ranking_' + ranking + '.csv', handle, 'Export full table')})
    
    # with use_scope('filter'):
    #     put_tabs(tabs_content)

    # print('tabs_content' , tabs_content)


def validate_date(date_text):
    try:
        return date_text == datetime.strptime(date_text, "%Y-%m-%d").strftime('%Y-%m-%d')
    except ValueError:
        return False

#events
def change_event(handle):  
    global concept_filter, search_window, sortstate, highlighting, ranking
    global article_types, syns, final_concepts, candidates, to_date, from_date
    
    handle_name = handle['name']
    handle_value = handle['value']

    if handle_name in ('sortstate', 'ranking', 'article_types', 'highlighting'):
        globals()[handle_name] = handle_value
    elif handle_name in ('to_date', 'from_date'):
        globals()[handle_name] = handle_value if validate_date(handle_value) else ""
    elif handle_name == 'concept_query':
        while True:
            target = skipper = pin.concept_query
            if 'MESH:' in target and ' ' in target:
                target = ' '.join(target.split(':')[-1].split()[1:])
            result = process.extract(target, syns, processor=None, scorer=fuzz.QRatio, limit=5, score_cutoff=10)
            text = pin.concept_query

            with use_scope('concept_query_candidates'):
                with use_scope('choices'):
                    clear('choices')
                    put_buttons([
                        dict(label=candidates[entry[2]] + " " + final_concepts[entry[2]], value=final_concepts[entry[2]], color='info')
                        for entry in result
                    ], onclick=lambda btn_id: pin_update("concept_query", **{'value': (pin.concept_query.replace(target, "") + "MESH:" + btn_id).strip() + " "}), outline=True, small=True)
            if pin.concept_query != skipper:
                continue
            else:
                return
    elif handle_name == 'highlighting' and documents:
        highlighting = handle_value
        render_abstracts(documents)
    else:
        concept_filter = [item for item in handle_value]
        search_window = 0
        render_abstracts(documents)
        
def annotate(pmid, abstract, title, filter_h):
    div_tags = ("""<div class="entities" style="line-height: 1.5; direction: ltr">""", "</div>")
    doc = nlp(title.strip() + '\f' + abstract.strip())
    doc.spans["sc"] = []
    spans_to_render = [doc.char_span(int(entity['start']), int(entity['end']), entity['type'].replace("Chemical", "Drug")) for entity in concept_dictionary.get(pmid, []) if int(entity['start']) != -1 and int(entity['end']) < len(title + " " + abstract) and 'All' not in filter_h and entity['type'].replace("Chemical", "Drug") not in filter_h and doc.char_span(int(entity['start']), int(entity['end']), entity['type'].replace("Chemical", "Drug")) != None]
    doc.set_ents(filter_spans(spans_to_render))
    html = displacy.render(doc, style="ent", options=options).split('\f')
    return html[0] + div_tags[1], div_tags[0] + html[1]


MAPPING = {key: f'<b><br>{key}<br></b>' for key in ['INTRODUCTION:', 'OBJECTIVE:', 'OBJECTIVES:', 'CONCLUSIONS:', 'CONCLUSION:', 'METHODS:', 'METHOD:', 'RESULTS:', 'OUTCOMES:', 'CLINICAL IMPLICATIONS:', 'DISCUSSION:', 'BACKGROUND:', 'AIMS:', 'PURPOSE:', 'BACKGROUND/PURPOSE:']}

def render_abstracts(documents):

    filtered_documents = [entry for entry in documents if not concept_filter or set(concept_filter).issubset(set(concept['id'] for concept in concept_dictionary[entry['_source']['pmid']]))]
    print ('filtered_documents len ==' , len(filtered_documents))
    # with use_scope('documents'):
        # print(len(filtered_documents))
    for i, entry in enumerate(filtered_documents[search_window:search_window + 50]):
        source = entry['_source']
        if source['title'] and source['abstract']:
            # with use_scope(f'documents{i}'):
                html_title, html_abstract = annotate(source['pmid'], source['abstract'], source['title'], set(highlighting))
                for k, v in MAPPING.items():
                    html_abstract = html_abstract.replace(k, v)

                print('html_title :' , html_title , 'html_abstract : ' , html_abstract)
                # put_html(f"<h3>{html_title}</h3>")
                # put_collapse(source['abstract'][:100] + "...", [put_html(html_abstract)])
                # put_markdown(f"##### PMID: [{source['pmid']}](https://pubmed.ncbi.nlm.nih.gov/{source['pmid']}) In: {source['journal']['ISOAbbreviation']} (ISSN: {source['journal']['ISSN']}), {source['timestamp']}")
                # put_markdown("---")


def add_pagination(documents):
    global current_page
    with use_scope('pagination'):
        current_page = output(put_text("Page 1 from " + str(math.ceil(len(documents) / 50 ))))
        put_row([
            current_page,
            put_buttons(['Prev'], onclick=partial(decrease_window, documents=documents)),
            put_buttons(['Next'], onclick=partial(increase_window, documents=documents)),
        ]) 

def decrease_window(val, documents):
    global search_window
    if search_window >= 50:
        search_window -= 50
    current_page.reset("Page " + str(1 + int(search_window / 50)) + " from " + str(math.ceil(len(documents) /50 )))
    render_abstracts(documents)

def increase_window(val, documents):
    global search_window
    if search_window + 50 < (len(documents)):
        search_window += 50
        current_page.reset("Page " + str(1 + int(search_window / 50)) + " from " + str(math.ceil(len(documents) /50 )))
        render_abstracts(documents)

def show_filter_options():
    global sortstate, highlighting, ranking, article_types, from_date, to_date
    
    options = [
        ('Sort by Date', 'sortstate', ["desc", "asc"], sortstate),
        ('Ranking Option', 'ranking', ['Frequency', 'Kullback-Leibler-Divergenz'], ranking),
        ('Article Types', 'article_types', ["Abstracts", "Case Reports",  "Clinical Study", "Clinical Trial", "Clinical Trial, Phase I", "Clinical Trial, Phase II", "Clinical Trial, Phase III", "Clinical Trial, Phase IV", "Comment", "Comparative Study", "Congresses", "Controlled Clinical Trial", "Meta-Analysis", "Multicenter Study", "Randomized Controlled Trial", "Review", "Systematic Review"], article_types, True),
        ('From', 'from_date', DATE, "1979-12-31"),
        ('To', 'to_date', DATE, "Publication Date TO eg. 2022-11-31")
    ]
    
    content = []
    for option in options:
        content.append(put_text(option[0]))
        if len(option) == 5:
            content.append(put_select(option[1], options=option[2], value=option[3], multiple=option[4]))
        elif len(option) == 4 and isinstance(option[2], str):
            content.append(put_input(option[1], type=option[2], placeholder=option[3]))
        else:
            content.append(put_select(option[1], options=option[2], value=option[3]))

    popup("Filter Options", content)


def search_query(request_json):
    global search_window, documents
    if 'query' in request_json:
        query = request_json['query']
        is_concept = False 
    elif 'concept_query' in request_json:
        query = request_json['concept_query']
        is_concept = True
    else:
        query = None
    

    search_window = 0
    limit = 10000



    if query:

        documents = elastic_query(query, limit, concept_query=is_concept)['hits']['hits']
        docs= process_documents(documents)


    return docs


def process_documents(docs):


    transactions, concept_dictionary = obtain_frequencies(docs)

    rows = add_filter(limit=55)
    # add_pagination(docs)
    # print(docs)
    # render_abstracts(docs)
    print(' rows' , rows ,'concept_dictionary',concept_dictionary,'transactions',transactions)
    return docs
    # render_abstracts(docs)

global generic_lut, concept_dictionary, frequency_dict, final_concepts, syns, candidates
concept_dictionary = defaultdict(str)

generic_lut = load_lut()

# with open('./frequencies.pkl','rb') as in_file:
#     frequency_dict = pickle.load(in_file)

# final_concepts, syns = parse_ascii_mesh()
# candidates = syns.copy()
# syns = [utils.default_process(entry) for entry in syns]

# start_server(app, debug=True, port='9600')

