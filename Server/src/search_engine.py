import sys
from datetime import datetime
from math import ceil
import re
#import nltk
#from nltk.corpus import stopwords
import json
from elasticsearch import Elasticsearch, helpers
from random import randrange, choice
from config import ELASTICSEARCH_CONFIG, READABILITY_LIST, READABILITY_THRESHOLDS, ALLOW_PAGINATION

# Download NLTK stop words (only required once)
#nltk.download('stopwords')


def readability_tag(read_score):
    read_score = float(read_score)
    if read_score > READABILITY_THRESHOLDS[0] or read_score == -1:
        return READABILITY_LIST[0]
    elif read_score > READABILITY_THRESHOLDS[1]:
        return READABILITY_LIST[1]
    elif read_score > READABILITY_THRESHOLDS[2]:
        return READABILITY_LIST[2]
    return READABILITY_LIST[3]


class SearchEngine:
    def __init__(self):
        self.es = Elasticsearch(
            [{'host': ELASTICSEARCH_CONFIG['ELASTIC_HOST'],
              'port': ELASTICSEARCH_CONFIG['ELASTIC_PORT']}],
            http_auth=(ELASTICSEARCH_CONFIG['ELASTIC_USERNAME'],
                       ELASTICSEARCH_CONFIG['ELASTIC_PASSWORD'])
        )
        if not self.es.ping():
            sys.exit("Can't connect to elasticsearch index ...")
        else:
            print("[STEP] Elasticsearch index successfully!")
        self.Index_Name = ELASTICSEARCH_CONFIG['INDEX_NAME']
        self.RETRIEVED_DOCS_SIZE = 10
        self.SEARCH_TIMEOUT = 60
        #self.STOP_WORDS = set(stopwords.words('english'))  # Get a list of English stop words

    def search_abstract(self, data):
        try:
            if "page" in data:
                page = int(data["page"])
            else:
                page = 1
            if page < 1:
                page = 1
            body = {
                'query': {
                    'bool': {
                        "must": [
                                    {"match": {"abstract": {"query": data["query"]}}},
                                    {"match": {"title": {"query": data["query"]}}},
                                ] + build_query(data),
                    },
                }
            }
            res = self.es.search(
                index=self.Index_Name,
                body=body,
                size=self.RETRIEVED_DOCS_SIZE,
                request_timeout=self.SEARCH_TIMEOUT,
                from_=(page - 1) * self.RETRIEVED_DOCS_SIZE,
            )
            pages = 1
            if ALLOW_PAGINATION:
                pages = res["hits"]["total"]['value'] / self.RETRIEVED_DOCS_SIZE

            docs_list = []
            for doc_contant in res['hits']['hits']:
                doc = doc_contant['_source']
                doc["bm25_score"] = doc_contant["_score"]
                doc["readability"] = "easy" #readability_tag(doc["readability"])
                docs_list.append(doc)

            return {
                "pagination": {
                    "total": res["hits"]["total"]['value'] if ALLOW_PAGINATION else self.RETRIEVED_DOCS_SIZE,
                    "page": page,
                    "total_pages": ceil(pages),
                    "per_page": self.RETRIEVED_DOCS_SIZE
                },
                "data": docs_list
            }
        except Exception as ex:
            print("[WARNING] some exception has occurred!")
            print(ex)
            return []

    def update_data(self):
        query_all = {"query": {
            "bool": {
                "must_not": {
                    "exists": {
                        "field": "readability"
                    }
                }
            }
        }}
        scroll(self.es, self.Index_Name, query_all)

    def query_concepts_extractor(self, query_string):
        try:
            documents_size = 1000
            body = {
                '_source': ['concepts'],
                'query': {
                    'bool': {
                        "must": [
                            {"match": {"abstract": {"query": query_string}}},
                            {"match": {"title": {"query": query_string}}},
                        ],
                    },
                }
            }
            res = self.es.search(
                index=self.Index_Name,
                body=body,
                size=documents_size,
                request_timeout=self.SEARCH_TIMEOUT,
            )
            query_string = query_string.lower()

            concepts = {}
            for doc_content in res['hits']['hits']:
                if len(doc_content['_source']['concepts']) < 1:
                    continue
                for item in json.loads(doc_content['_source']['concepts']):
                    if item['entity'].lower() in query_string:
                        if item['id'] not in concepts:
                            concepts[item['id']] = {"values": [item['entity']], 'count': 0, 'type': item['type']}
                        # elif item['entity'] not in concepts[item['id']]['values']:
                        #    concepts[item['id']]['values'].append(item['entity'])
                        concepts[item['id']]['count']+=1

            result = []
            for key in concepts.keys():
                if concepts[key]['count'] > documents_size*0.10:
                    result.append({
                        "id": key,
                        "name": concepts[key]['values'][0],
                        "type": concepts[key]['type'],
                        'score': concepts[key]['count']
                    })

            return result
        except Exception as ex:
            print("[WARNING] some exception has occurred!")
            print(ex)
            return []


def build_query(data):
    query_list = []

    print('query',data )

    # make sure readability can accept also multiple values filter!!
    if "readability" in data:
        readability_range = [0, 9999]
        if data["readability"].lower() == READABILITY_LIST[0]:
            readability_range = [READABILITY_THRESHOLDS[0], 9999]
        elif data["readability"].lower() == READABILITY_LIST[1]:
            readability_range = [READABILITY_THRESHOLDS[1], READABILITY_THRESHOLDS[0]]
        elif data["readability"].lower() == READABILITY_LIST[2]:
            readability_range = [READABILITY_THRESHOLDS[2], READABILITY_THRESHOLDS[1]]
        elif data["readability"].lower() == READABILITY_LIST[3]:
            readability_range = [READABILITY_THRESHOLDS[3], READABILITY_THRESHOLDS[2]]
        query_list.append(
            {"range": {"readability": {
                'gte': readability_range[0],
                'lte': readability_range[1],
            }}}
        )
    if "levelOfEvidence" in data:
        levelOfEvidence = data['levelOfEvidence'].split(",")
        query_list.append(
            {"range": {"loe": {
                'gte': levelOfEvidence[0],
                'lte': levelOfEvidence[1],
            }}}
        )
    # if "technicalityLevel" in data:
    #    technicalityLevel = data['technicalityLevel'].split(",")
    #    query_list.append(
    #        {"range": {"technicality_level": {
    #            'gte': technicalityLevel[0],
    #            'lte': technicalityLevel[1],
    #        }}}
    #    )
    if "year" in data:
        year = data['year'].split(',')  # example: 2020,2022
        query_list.append(
            {
                "range": {
                    "timestamp": {
                        'gte': f'{year[0]}-01-01' if len(year[1]) > 3 else f'1900-01-01',
                        'lte': f'{year[1]}-12-31' if len(year[1]) > 3 else f'{datetime.now().year}-12-31',
                    }
                }
            }
        )
    if 'article_type' in data:
        query_list.append({
            "wildcard": {  # wildcard or term
                "publication_types.keyword": f"*{data['article_type']}*"
            }
        })
    if 'concepts_include' in data and len(data["concepts_include"]) > 1:
        query_list.append({"match": {"concepts": {"query": data["concepts_include"].replace(",", " ")}}})
        #for item in data['concepts_include']:
        #    query_list.append(
        #        {"match_phrase": {"concepts": item}}
        #    )
    return query_list


def random():
    return randrange(50, 100)


def scroll(es, index, body, scroll_id=None, counter=0, **kw):
    size = 100
    time = "5m"
    if scroll_id:
        page = es.scroll(scroll_id=scroll_id, scroll=time)
    else:
        page = es.search(index=index, body=body, scroll=time, size=size, **kw)
    # 168407
    # print(page["hits"]["total"]["value"])
    # return
    next_scroll_id = page['_scroll_id']
    source_to_update = {
        "technicality_level": random(),
        "readability": choice(["easy", "medium", "hard", "expert"]),
        "loe": random(),
    }
    docs = []
    for hit in page["hits"]["hits"]:
        docs.append(
            {"update": {"_id": hit["_id"], "_index": index}},
        )
        docs.append(
            {"doc": source_to_update},
        )
        counter = counter + 1
        print("UPDATE:", counter)
    if len(docs) == 0:
        return
    # return
    es.bulk(body=docs)
    # helpers.bulk(es, docs)
    print("UPDATED", len(docs))
    if (next_scroll_id and len(page["hits"]["hits"]) == size):
        scroll(es, index, body, next_scroll_id, counter, **kw)


if __name__ == '__main__':
    obj = SearchEngine()
    # query = "melanoma among white patients in the USA with vitamin d"
    query = "can braf mutation improve melanoma response"
    doc = obj.search_abstract({"query":query})
    print(doc)