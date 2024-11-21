from flask import Flask,jsonify
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "hello world"

@app.route("/init_1_out")
def init_1():
    # return jsonify({
    #         "questions":[
    #             {"question 1":["op 1","op 2","op 3","op 4"],"category":"coding"},
    #             {"question 2":["op 1","op 2","op 3","op 4"],"category":"coding"},
    #             {"question 3":["op 1","op 2","op 3","op 4"],"category":"domain"}
    #         ]
    #     })
    return jsonify({
        "questions": [
        {
            "question": "What is the time complexity of quicksort?",
            "options": ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
            "category": "coding"
        },
        {
            "question": "Which of the following is not a JavaScript data type?",
            "options": ["String", "Boolean", "Float", "Object"],
            "category": "coding"
        },
        {
            "question": "What does CSS stand for?",
            "options": ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
            "category": "domain"
        },
        {
            "question": "If a train travels 120 km in 2 hours, what is its average speed?",
            "options": ["30 km/h", "45 km/h", "60 km/h", "75 km/h"],
            "category": "aptitude"
        }
        ]
        })
    
@app.route("/init_2_out")
def init_2():
    
    return jsonify({
        "categories":{
            "coding":30,
            "aptitude":10,
            "domain":10
        },
        "area_of_impro":"",
        "graph_data":{
            "x":10,
            "y":90
        }
    })

if __name__=="__main__":
    app.run(debug=True)