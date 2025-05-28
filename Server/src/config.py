import os

ELASTICSEARCH_CONFIG = {
    'ELASTIC_HOST': os.environ.get('ELASTIC_HOST'),
    'ELASTIC_PORT': os.environ.get('ELASTIC_PORT'),
    'ELASTIC_USERNAME': os.environ.get('ELASTIC_USERNAME'),
    'ELASTIC_PASSWORD': os.environ.get('ELASTIC_PASSWORD'),
    'INDEX_NAME': os.environ.get('INDEX_NAME')
}

CONNECTION_STRING = os.environ.get("DB")


READABILITY_LIST = ["easy", "medium", "hard", "expert"]
READABILITY_THRESHOLDS = [20, 15, 10, 0]

BIOCONCEPTS = ['Chemical', 'DNAMutation', 'Disease', 'Gene', 'ProteinMutation', 'SNP', 'Species']


ALLOW_PAGINATION = os.environ.get('PAGE', 'true').lower() in ('true', 'yes', '1', 't', 'y')

AUTH_CONFIG = {
    "SECRET_KEY": "ASDKJZMVM!@$?!@*^&$%@#$"

}
