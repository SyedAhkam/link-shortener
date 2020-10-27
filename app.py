from flask import Flask, render_template, request, redirect
from flask_pymongo import PyMongo
from dotenv import load_dotenv
from shortid import ShortId
from datetime import datetime

import os

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv('MONGODB_URI')

mongo = PyMongo(app)
sid = ShortId()

def is_document_exists(collection, id):
	return bool(collection.count_documents({ '_id': id }, limit = 1))

def create_shortened_url(url_to_be_shortened, id):
	if not id:
		id = sid.generate()
	mongo.db.links.insert_one({
		'_id': id,
		'original_url': url_to_be_shortened,
		'created_at': datetime.utcnow()
	})
	return id

@app.route('/', methods=['GET'])
def index(): 
    return render_template('index.html')

@app.route('/new', methods=['POST'])
def new():
	post_data = request.get_json()
	if is_document_exists(mongo.db.links, post_data['id']):
		return {
			'error': 'This ID is not available.'
		}
	short_url_id = create_shortened_url(post_data['urlToShorten'], post_data['id'])
	return {
		'shortenedURL': request.url_root + short_url_id
	}

@app.route('/<id>', methods=['GET'])
def links(id):
	document = mongo.db.links.find_one_or_404({'_id': id})
	return redirect(document['original_url'])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
