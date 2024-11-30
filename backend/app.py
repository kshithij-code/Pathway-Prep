from flask import Flask,jsonify,session,request
from flask_cors import CORS
import pymongo
from model.roadmap import generate_dynamic_roadmap
# import pymongo.mongo_client
# from flask_pymongo import PyMongo

app=Flask(__name__)
CORS(app)


myclient=pymongo.MongoClient("mongodb://localhost:27017/PathwayPrep")
usersDB=myclient["usersDB"]
validations=usersDB["users"]

app.secret_key="pathway"

real_answers=[]

@app.route("/login",methods=['GET',"POST"])
def login():
    USN=request.json["usn"]
    password=request.json["password"]
    if not  validations.find_one({"USN":USN}):
        return jsonify({"login":False})
    
    if password not in validations.find_one({"USN":USN})["password"]:
        print(validations.find_one({"USN":USN},{"password":1}))
        return jsonify({"login":False})
    
    return jsonify({"login":True})

@app.route("/signup",methods=["POST"])
def signup():
    user=request.json["username"]
    USN=request.json["usn"]
    password=request.json["password"]
    college=request.json["college"]
    
    print(user,USN,password,college)
    
    print(validations.find_one({"USN":USN}))
    
    if validations.find_one({"USN":USN}):
        return jsonify({"signup":False})
    
    validations.insert_one({"user":user,"USN":USN,"college":college,"password":password})
    return jsonify({"signup":True})


@app.route("/genarate_ques",methods=["GET","POST"])
def genarate_ques():
    global real_answers
    interests=request.json["interests"]
    resume=request.json["resume"]
    real_answers=["O(n log n)","Float","Cascading Style Sheets","60 km/h"]
    return jsonify({
        "questions": [
        {
            "question": "Whats is the time complexity of quicksort?",
            "options": ["O(n)", "O(n log n)", "O(n^2)", "O(1)"],
            "category": "coding"
        },
        {
            "question": "Which of the following is not a JavaScript data type? hmm",
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
    
@app.route("/submit_quiz",methods=["POST"])
def submit_quiz():
    global real_answers
    answers=request.json["answers"]
    print(answers,real_answers)
    scores=0
    maxsc=0
    for i in answers:
        maxsc+=10
        if i in real_answers:
            scores+=10
            print(scores,maxsc)
    return jsonify({
        "categories":{
            "coding":scores-20,
            "aptitude":scores-30,
            "domain":scores-30,
            "AIML":10,
            "data":30
        },
        "area_of_impro":"need to improve in coding",
        "graph_data":{
            "x":maxsc-scores,
            "y":maxsc
        }
    })

@app.route("/genarate_roadmap",methods=["GET","POST"])
def roadmap():
    USN=request.json["usn"]
    per_roadmap=generate_dynamic_roadmap({
        "categories": {
            "coding": 30,
            "aptitude": 10,
            "domain": 10
        },
        "interest": [ "data science","computer network","master"]
    })
    return jsonify(per_roadmap)
    
if __name__=="__main__":
    app.run(debug=True)