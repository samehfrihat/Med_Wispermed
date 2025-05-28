import os
from modified_autocomplete import AutoComplete 

import csv
import pandas as pd
import json
import re
from flask import Flask, request, json
import csv

def autocomplete(request_json):

    words = get_words('src/test.tsv')

    autocomplete = AutoComplete(words=words)

    # max_cost , Maximum Levenshtein edit distance to be considered when calculating results
    result= autocomplete.search(word=request_json['query'], max_cost=3, size=5)

    # updatedWords = autocomplete.update_count_of_word(word='Direct', count=10)


    return result


def get_words(path):
 
    # df_test = pd.read_tsv(path, sep="\t", lineterminator='\n', encoding="utf8")
    df_test = pd.read_table(path)
    
    words = {}

    for TI in df_test['TI']:
        if TI:
            local_words = [TI, '{}'.format(TI)]
            while local_words:
                word = local_words.pop()
                if word not in words:
                    words[word] = {}
        if TI not in words:
            words[TI] = {}
    return words



   


    
    
   


