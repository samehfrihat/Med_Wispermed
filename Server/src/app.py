from bson import ObjectId
import json
from flask import Flask, request, json
from flask_cors import CORS
from math import ceil

from datetime import datetime
from pubmedAPI import PubMedSearch
from users import User
from search import search
from exceptions.search_validation_exception import SearchValidationException
from functools import wraps
from config import AUTH_CONFIG
import jwt
from autocomplete import autocomplete
from json import JSONEncoder
#from conceptsSearch import search_query

pubmed_obj = PubMedSearch()
user_db = User()


class JSONEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, bytes):
            return o.decode('utf-8')
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


app = Flask(__name__)
CORS(app)


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        if not token:
            user = {'email':'thisIsAFakeEmail@token.decorator'}  # to be deleted
            request.user = user  # to be deleted
            return f(*args, **kwargs)  # to be deleted
            return json.dumps({'message': 'a valid token is missing'})
        try:
            decoded = jwt.decode(token, AUTH_CONFIG['SECRET_KEY'], algorithms=["HS256"])

            is_guest = False
            if 'is_guest' in decoded:
                is_guest = True
            user = user_db.find_document({"_id": ObjectId(decoded["id"])}, is_guest_collection=is_guest)

            if user is None:
                return json.dumps({'message': 'token is invalid'})
            user['is_guest'] = is_guest
            request.user = user
        except:
            return json.dumps({'message': 'token is invalid'})

        return f(*args, **kwargs)

    return decorator


@app.route('/test', methods=["GET"])
# # @token_required
def test():
    print('TEST')
    return 'test'


@app.route('/signup/', methods=['POST'])
def signup():
    return user_db.signup()


@app.route('/login/', methods=['POST'])
def login():
    return user_db.signin()


@app.route('/guest/', methods=['POST'])
def guest():
    return user_db.guest()


@app.route('/logout/', methods=['POST'])
@token_required
def logout():
    return user_db.logout()


@app.route('/search_data/', methods=['POST'])
@token_required
def search_data():
    return user_db.search_data()


@app.route('/get_article/', methods=['POST'])
@token_required
def get_article():
    return user_db.get_article()


@app.route('/update_user_info', methods=['PUT'])
@token_required
def update_user_info():

    return app.response_class(
        response=JSONEncoder().encode(user_db.update_user_info(
            request.user["_id"]
        )),
        status=200,
        mimetype='application/json'
    )


@app.route('/get_user_info', methods=['GET'])
@token_required
def get_user_info():

    return app.response_class(
        response=JSONEncoder().encode(user_db.get_user_info(
            request.user["_id"]
        )),

        status=200,
        mimetype='application/json'
    )


@app.route('/search_query/', methods=['GET'])
@token_required
def main_search():
    try:
        request_json = request.args.to_dict()
        result = search(request_json)
        data = {
            "action": "search",
            "endpoint": request.base_url,
            "search_Query": request_json,
            "result": result['data'],
            "time": str(datetime.now())
        }
        user_db.insert_history(request.user, data)
        return app.response_class(
            response=json.dumps(result),
            status=200,
            mimetype='application/json'
        )

    except Exception as ex:
        # SearchValidationException
        if isinstance(ex, SearchValidationException):
            return app.response_class(
                response=ex.__str__(),
                status=400
            )

        print("Failed to search query, Error: {}".format(ex))
        # 406 Not Acceptable:
        # This response is sent when the web server, after performing server-driven content negotiation,
        # doesn't find any content that conforms to the criteria given by the user agent.
        return app.response_class(
            response='Failed to get search query content, Error: ' + ex.__str__(),
            status=406
        )


def format_search_based_concepts(result):
    return result


@app.route('/search_concepts', methods=['GET'])
@token_required
def search_based_concepts():
    try:

        request_json = request.args.to_dict()
        print('request_json' , request_json )

        result = ""  # search_query(request_json)

        return app.response_class(
            response=json.dumps(format_search_based_concepts(result)),
            status=200,
            mimetype='application/json'
        )

    except Exception as ex:
        # SearchValidationException
        if isinstance(ex, SearchValidationException):
            return app.response_class(
                response=ex.__str__(),
                status=400
            )

        print("Failed to search query, Error: {}".format(ex))
        # 406 Not Acceptable:
        # This response is sent when the web server, after performing server-driven content negotiation,
        # doesn't find any content that conforms to the criteria given by the user agent.
        return app.response_class(
            response='Failed to get search query content, Error: ' + ex.__str__(),
            status=406
        )


@app.route('/autocomplete', methods=["GET"])
@token_required
def autocomplete_route():
    try:
        request_json = request.args.to_dict()
        result = autocomplete(request_json)
        return app.response_class(
            response=json.dumps(result),
            status=200,
            mimetype='application/json'
        )

    except Exception as ex:
        # SearchValidationException
        if isinstance(ex, SearchValidationException):
            return app.response_class(
                response=ex.__str__(),
                status=400
            )
        else: 
            return app.response_class(
                response=ex.__str__(),
                status=400
            )


@app.route('/search_pubmed/', methods=['GET'])
@token_required
def search_pubmed():
    try:
        request_json = request.args.to_dict()

        if "page" in request_json:
                page = int(request_json["page"])
        else:
                page = 1

        if page < 1:
                page = 1
    
        results_per_page = 20
        
        if "query" not in request_json:
            raise ValueError('No query found!')

        print("request_json", request_json)
        result,total = pubmed_obj.search(request_json["query"],page,results_per_page)

        print("result", result)
         # shound no be less than 1 and if it's less cast to 1
        pages = total / results_per_page

        ids = [res["pmid"] for res in result]

        print("ids", ids)
        document_feedback = user_db.get_document_feedback(ids)

        data = {
            "action": "search",
            "endpoint": request.base_url,
            "search_Query": request_json,
            "result": ids,
            "time": str(datetime.now())
        }
        user_db.insert_history(request.user, data)

        return app.response_class(
            response=json.dumps({
            "pagination": {
                "total": total,
                "page": page,
                "total_pages": ceil(pages),
                "per_page": results_per_page
            },
            "data": result,
            "document_feedback": document_feedback
        }),
            status=200,
            mimetype='application/json'
        )

    except Exception as ex:
        # SearchValidationException
        if isinstance(ex, SearchValidationException):
            return app.response_class(
                response=ex.__str__(),
                status=400
            )

        print("Failed to search query, Error: {}".format(ex))
        # 406 Not Acceptable:
        # This response is sent when the web server, after performing server-driven content negotiation,
        # doesn't find any content that conforms to the criteria given by the user agent.
        return app.response_class(
            response='Failed to get search query content, Error: ' + ex.__str__(),
            status=406
        )


@app.route('/document_feedback/', methods=['POST'])
@token_required
def submit_document_feedback():

    result = user_db.store_document_feedback()
    if result:
        return app.response_class(
            response=json.dumps({'status': True}),
            status=200,
            mimetype='application/json'
        )
    return app.response_class(
        response=json.dumps({'status': False}),
        status=400,
        mimetype='application/json'
    )

@app.route('/user_study_feedback/', methods=['POST'])
@token_required
def submit_user_study_feedback():
    if user_db.store_user_study_feedback():
        return app.response_class(
            response=json.dumps({'status': True}),
            status=200,
            mimetype='application/json'
        )
    return app.response_class(
        response=json.dumps({'status': False}),
        status=400,
        mimetype='application/json'
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)
