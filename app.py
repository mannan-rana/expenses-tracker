from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='static')
CORS(app)  # This line enables CORS for all routes

# In-memory storage for expenses
expenses = []


@app.route('/', methods=['GET'])
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/add-expense', methods=['POST'])
def add_expense():
    expense = request.json
    expenses.append(expense)
    return jsonify(expense), 201

@app.route('/expenses', methods=['GET'])
def get_expenses():
    return jsonify(expenses)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
