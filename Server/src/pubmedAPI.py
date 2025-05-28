from Bio import Entrez
import xml.etree.ElementTree as ET
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from config import ALLOW_PAGINATION


class PubMedSearch:
    def __init__(self, email="", source="web"):
        print('teeeeeeeeeeeeest')
        if source not in ["web", "api"]:
            raise ValueError('source value should be "web" or "api"')
        if len(email) < 3 and source=="api":
            raise ValueError('Please enter a valid email!!')
        self.SEARCH_source = source
        self.email = email
        Entrez.email = email
        self.MEDLINE_DB = "pubmed"
        self.PUBMED_URL = "https://pubmed.ncbi.nlm.nih.gov/"

    def _search_query_api(self, query,page,results_per_page, max_results=20):
        try:
            # Get query, page, and results_per_page from request parameters

            # Calculate the start and end index for results based on the page number
            start_index = (page - 1) * results_per_page
            end_index = start_index + results_per_page

            # Perform the PubMed search with specified parameters
            handle = Entrez.esearch(db=self.MEDLINE_DB, term=query, retmax=end_index)
            record = Entrez.read(handle)
            handle.close()

            # Extract the results for the current page
            id_list = record["IdList"][start_index:end_index]

            return id_list
        except Exception as e:
            print(f"Error: {str(e)}")
            return jsonify({"error": "An error occurred"}), 500
        


    def _search_query_web(self, query, page=1, results_per_page=20):

        try:
            # Perform an initial request to fetch a large number of results
            if ALLOW_PAGINATION:
                initial_search_url = f"{self.PUBMED_URL}?term={query.replace(' ', '+')}&size={100}"
            else:
                initial_search_url = f"{self.PUBMED_URL}?term={query.replace(' ', '+')}&size={10}"
            initial_response = requests.get(initial_search_url)

            if initial_response.status_code == 200:
                soup = BeautifulSoup(initial_response.content, "html.parser")
                articles = [element.get("data-chunk-ids") for element in soup.find_all(attrs={"data-chunk-ids": True})]

                if len(articles) == 0:
                    print("Something went wrong! No data found!")
                    return [], 0  # Return an empty list and total result count as 0

                # Extract total result count
                total_result_count = len(articles[0].strip().split(','))

                # Calculate start and end indices based on the requested page and standard results_per_page
                start_index = (page - 1) * results_per_page
                end_index = start_index + results_per_page

                # Slice the results based on start and end indices
                result_ids = [id.strip() for id in articles[0].strip().split(',')][start_index:end_index]

                return result_ids, total_result_count
            else:
                raise ValueError("Error:", initial_response.status_code)
        except Exception as e:
            print("An error occurred:", str(e))
            return [], 0  # Return an empty list and total result count as 0



    # def _search_query_web(self, query, max_results=20):
    #     search_url = f"{self.PUBMED_URL}?term={query.replace(' ', '+')}&size={max_results}"
    #     response = requests.get(search_url)
    #     if response.status_code == 200:
    #         soup = BeautifulSoup(response.content, "html.parser")
    #         articles = [element.get("data-chunk-ids") for element in soup.find_all(attrs={"data-chunk-ids": True})]#data-chunk-ids
    #         if len(articles) == 0:
    #             print("Something went wrong! No data found!")
    #             return []
    #         if len(articles) > 1:
    #             print(f"{len(articles)} Attrs found in the search query!")
    #         return [id.strip() for id in articles[0].strip().split(',')]
    #     else:
    #         raise ValueError("Error:", response.status_code)
    #         # return []

    def search(self, query:str,page,results_per_page, max_results=100):
        if self.SEARCH_source == "api":
            pmids = self._search_query_api(query,page,results_per_page, max_results=100)
            result = []
            for pmid in pmids:
                metadata = self.fetch_metadata(pmid)
                if metadata:
                    result.append(metadata)
            return result
        else:  # web
            page_number = page  # Change this to the desired page number
            #results_per_page = 20  # Number of results per page
            pmids,total = self._search_query_web(query, page=page_number ,results_per_page=results_per_page)

            return self.fetch_metadata(pmids) ,total

    def _fetch_metadata_item(self, pmid:str):
        try:
            handle = Entrez.efetch(db=self.MEDLINE_DB, id=pmid, rettype="medline", retmode="xml")
            xml_data = handle.read()
            handle.close()

            root = ET.fromstring(xml_data)
            pubmed_article = root.find(".//PubmedArticle")
            if pubmed_article is not None:
                metadata = {}
                metadata["pmid"] = pmid
                for elem in pubmed_article.iter():
                    if elem.tag == "ArticleTitle":
                        metadata["title"] = elem.text
                    elif elem.tag == "AbstractText":
                        metadata["abstract"] = elem.text
                    elif elem.tag == "AuthorList":
                        metadata["authors"] = [author.find("LastName").text + " " + author.find("ForeName").text
                                               for author in elem.findall(".//Author")]
                    elif elem.tag == "PubDate":
                        year = elem.find("Year")
                        month = elem.find("Month")
                        day = elem.find("Day")
                        if year is not None:
                            date_parts = [year.text]
                            if month is not None:
                                date_parts.append(month.text.zfill(2))
                            if day is not None:
                                date_parts.append(day.text.zfill(2))
                            metadata["publication_date"] = "-".join(date_parts)
                    elif elem.tag == "PublicationTypeList":
                        metadata["publication_type"] = [pt.text for pt in elem.findall(".//PublicationType")]
                return metadata
            else:
                return None
        except Exception as e:
            print(f"Error: {str(e)}")
            return None

    def _fetch_metadata_list(self, pmids:list):
        try:
            handle = Entrez.efetch(db=self.MEDLINE_DB, id=pmids, rettype="medline", retmode="xml")
            xml_data = handle.read()
            handle.close()

            root = ET.fromstring(xml_data)
            metadata_list = []

            for pubmed_article in root.findall(".//PubmedArticle"):
                try:
                    metadata = {}
                    pmid = pubmed_article.find(".//ArticleId[@IdType='pubmed']").text
                    metadata["pmid"] = pmid
                    article_title = pubmed_article.find(".//ArticleTitle")
                    if article_title is not None:
                        metadata["title"] = article_title.text
                    abstract = pubmed_article.find(".//AbstractText")
                    if abstract is not None:
                        metadata["abstract"] = abstract.text
                    authors = pubmed_article.findall(".//AuthorList/Author")
                    metadata["authors"] = [f"{author.find('LastName').text} {author.find('ForeName').text}" for author in authors]
                    pub_date = pubmed_article.find(".//PubDate")
                    if pub_date is not None:
                        year = pub_date.find("Year").text
                        month = "01"
                        if pub_date.find("Month") is not None:
                            month = pub_date.find("Month").text.zfill(2)
                        day = "01"
                        if pub_date.find("Day") is not None:
                            day = pub_date.find("Day").text.zfill(2)
                        metadata["publication_date"] = f"{year}-{month}-{day}"

                    publication_types = pubmed_article.findall(".//PublicationTypeList/PublicationType")
                    metadata["publication_types"] = [pt.text for pt in publication_types]
                    metadata_list.append(metadata)
                except Exception as ex:
                    print("Error:- ", ex.__str__())
            return metadata_list
        except Exception as e:
            print(f"Error: {str(e)}")
            return None

    def fetch_metadata(self, pmid, isList=True):
        if isList:
            return self._fetch_metadata_list(pmid)
        else:
            return self._fetch_metadata_item(pmid)


if __name__ == "__main__":
    query = "cancer treatment melanoma"
    pubmed_search = PubMedSearch()
    docs = pubmed_search.search(query)
    print(docs)
