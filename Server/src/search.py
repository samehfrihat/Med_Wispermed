from exceptions.search_validation_exception import SearchValidationException
from search_engine import SearchEngine
from random import randrange


search_obj = SearchEngine()


def random():
    return randrange(50, 100)

def search(request_json):
    if "query" not in request_json:
        raise SearchValidationException("Query is required")

    if("medicalAbstracts" in request_json):
        result = search_obj.search_abstract(request_json)
    else:
        result = search_obj.search_summary(request_json)  

    
    # for i in range(len(result)):
    #     if("Abstract" in result[i]):
    #         result[i]["brief_summary"] = result[i]["Abstract"]
    #     if("title" in result[i]):
    #         result[i]["brief_title"] = result[i]["title"]
    
    return result
