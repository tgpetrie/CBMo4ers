# app.py
Not Found
The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
	return "Hello, Coinbase Tracker!"

if __name__ == '__main__':
	app.run(debug=True)