import sys
from flask import request, json
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import bcrypt
from config import CONNECTION_STRING, AUTH_CONFIG
import jwt


class User:
    def __init__(self):
        client = MongoClient(CONNECTION_STRING)  # , ssl=True, ssl_cert_reqs='CERT_NONE'
        if 'ok' not in client.users_DB.command('ping'):
            sys.exit("Can't connect Users DB ...")
        else:
            print("[STEP] Database connected successfully!")
        self.db_signup = client.users['user']  # signup collection
        self.db_history = client.history  # history database
        self.doc_feedback = self.db_history["document_feedback"]
        self.user_study_feedback = self.db_history["user_study_feedback"]
        self.db_guest = client.guests['guest']  # guest collection

    def signup(self):
        data = request.json

        newPassword = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        user = {
            "name": data['name'],
            "password": newPassword,
            "email": data['email'],
            "specialistIn": data['specialistIn'],
            "language": data['language'],
            "experience": data['experience']
        }
        if self.db_signup.find_one({"email": data['email']}):
            return json.jsonify({"error": "Email address already in use", "status": 400}), 400

        if self.db_signup.insert_one(user):
            return json.jsonify({'message': 'registered successfully', "status": 200})

        return json.jsonify({"error": "SignUp failed"}), 400

    def signin(self):
        data = request.json
        history = {
            "endpoint": request.base_url,
            "action": "login",
            "time": str(datetime.now())
        }

        if self.db_signup.find_one({"email": data['email']}):
            courser = self.db_signup.find({"email": data['email']})

            for document in courser:
                data['name'] = document['name']

                if not bcrypt.checkpw(data['password'].encode('utf-8'), document['password']):
                    return json.jsonify({"error": "Invalid Email or Password", "status": 400}), 400

            if self.db_history[data['email']].insert_one(history):
                data['password'] = str(bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()))
                data['status'] = 200
                token = jwt.encode({'id': str(document["_id"]), }, AUTH_CONFIG['SECRET_KEY'], "HS256")
                return json.jsonify({'token': token, "user": {"name": data['name'], "email": data['email']}})
            else:
                return json.jsonify({"error": 'could not verify', "status": 401},
                                    {'Authentication': '"login required"'})
        else:
            return json.jsonify({"error": "Email address not exists", "status": 400}), 400

    def logout(self):
        history = {
            "endpoint": request.endpoint,
            "action": "logout",
            "time": str(datetime.now())
        }

        if self.insert_history(request.user, history):
            return json.jsonify({"action": "you are logged out", "status": 200}), 200

    def guest(self):
        print(request)
        print("-----------------------------")
        print(request.json)
        data = request.json
        # data = {
        #     "specialistIn": data['specialistIn'],
        #     "levelOfExpertise": data['levelOfExpertise'],
        # }

        _id = self.db_guest.insert_one(data)

        guest = self.db_guest.find_one(ObjectId(_id.inserted_id))

        if guest:
            token = jwt.encode({'id': str(guest["_id"]), 'is_guest': True}, AUTH_CONFIG['SECRET_KEY'], "HS256")
            response = {
                'token': token,
                'user': {
                    "is_guest": True
                }
            }
            return json.jsonify(response)

        return json.jsonify({"error": "Failed"}), 400

    def search_data(self):
        data = request.json
        search = {
            "action": "search",
            "endpoint": request.base_url,
            "search_Query": data['query'],
            "result": data['pages'],
            "time": str(datetime.now())
        }

        if self.insert_history(request.user, search):
            return json.jsonify({"action": "get doc", "status": 200}), 200

    def get_user_info_by_email(self, email):
        try:
            user = self.db_signup.find_one(
                {"email": email}, {'password': 0})
            return user
        except Exception as ex:
            print("[WARNING] some exception has occurred!")
            print("Error in searching query, cause ")
            print(ex)
            return []

    def get_user_info(self, id):
        try:
            return self.db_signup.find_one(id)
        except Exception as ex:
            print("[WARNING] some exception has occurred!")
            print("Error in searching query, cause ")
            print(ex)
            return []

    def update_user_info(self, id):
        data = request.json

        user = {
            "name": data['name'],
            "email": data['email'],
            "language": data['language'],
            "specialistIn": data['specialistIn'],
        }

        if self.db_signup.update_one({"_id": id}, {"$set": user}):
            return data

        return {"error": "SignUp failed"}

    def get_article(self):
        data = request.json
        search = {
            "action": "get_article",
            "article": {
                "search_Query": data['search_Query'],
                "endpoint": request.base_url,
                "title": data['title'],
                "url": data['url']
            },
            "time": str(datetime.now())
        }
        # User.user_search_docs.append({ data['search_Query']: {"title":data['title'],"url":data['url']} })
        if data['email']:
            if self.db_history[data['email']].insert_one(search):
                return json.jsonify({"action": "get doc", "status": 200}), 200

        else:
            if self.db_history[data['guest']].insert_one(search):
                return json.jsonify({"action": "get doc", "status": 200}), 200

    def insert_history(self, user, history):
        if "is_guest" in user and user["is_guest"] == True:
            return self.db_history['guest_' + str(user['_id'])].insert_one(history)
        else:
            return self.db_history[request.user['email']].insert_one(history)

    def find_document(self, doc, is_guest_collection=False):
        if is_guest_collection:
            return self.db_guest.find_one(doc)
        return self.db_signup.find_one(doc)  # user =

    def get_document_feedback(self,ids):
        try:
            user = request.user
            if "is_guest" in user and user["is_guest"] == True:
                user = 'guest_' + str(user['_id'])
            else:
                user = user['email']

            matching_documents_cursor = self.doc_feedback.find({'pmid': {'$in': ids} , 'user': user})
        
         # Convert the MongoDB cursor to a list of dictionaries
            document_list = list(matching_documents_cursor)

            print('document_list =========' , document_list)


            # Convert ObjectId to string for each document
            for document in document_list:
                document['_id'] = str(document['_id'])


            return document_list  # Return the matching documents as JSON

        except Exception as ex:
            print("[ERROR] some exception has occurred in get document feedback!")
            print(ex)
            return False

    def store_document_feedback(self):
        try:
            data = request.json
            print(data)
            user = request.user
            print(user)
            data = {
                    'pmid': data['pmid'],
                    'score': data['score'],
                    'rank': data['rank'],
                    'query': data['query'],
                    'time': str(datetime.now())
                }
            if "is_guest" in user and user["is_guest"] == True:
                data["user"] = 'guest_' + str(user['_id'])

            else:
                data["user"] = user['email']

            # Define the filter based on the unique field ("query")
            filter = {'pmid': data['pmid'], 'user' :data["user"] }

            # Define the update operation
            update = {'$set': data}
            res = self.doc_feedback.update_one(filter, update, upsert=True)

            return res
        except Exception as ex:
            print("[ERROR] some exception has occurred in storing document feedback!")
            print(ex)
            return False

    def store_user_study_feedback(self):
        try:
            data = request.json
            print(data)
            user = request.user
            print(user)
            data['time'] = str(datetime.now())

            if "is_guest" in user and user["is_guest"] == True:
                data["user"] = 'guest_' + str(user['_id'])
            else:
                data["user"] = user['email']

            self.user_study_feedback.insert_one(data)
            return True
        except Exception as ex:
            print("[ERROR] some exception has occurred in storing document feedback!")
            print(ex)
            return False


if __name__ == "__main__":
    query = "cancer treatment melanoma"
    db = User()
