from flask import Flask,jsonify,session,request
from flask_cors import CORS
import pymongo
from model.roadmap import generate_dynamic_roadmap
from model.exportQuestions import get_random_question,random
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
        # print(validations.find_one({"USN":USN},{"password":1}))
        return jsonify({"login":False})
    
    return jsonify({"login":True})

@app.route("/signup",methods=["POST"])
def signup():
    user=request.json["username"]
    USN=request.json["usn"]
    password=request.json["password"]
    college=request.json["college"]
    
    # print(user,USN,password,college)
    
    # print(validations.find_one({"USN":USN}))
    
    if validations.find_one({"USN":USN}):
        return jsonify({"signup":False})
    
    validations.insert_one({"user":user,"USN":USN,"college":college,"password":password})
    return jsonify({"signup":True})


@app.route("/genarate_ques",methods=["GET","POST"])
def genarate_ques():
    global real_answers
    interests=request.json["interests"]
    resume=request.json["resume"]
    questions=[]
    if len(interests)<1:
        for i in range(5):
            question,answer=get_random_question(interests[0])
            question["category"]=interests[0]
            questions.append(question)
            real_answers.append([answer,interests[0]])
    else:
        for i in range(5):
            num=random.randint(0,len(interests)-1)
            question,answer=get_random_question(interests[num])
            question["category"]=interests[num]
            questions.append(question)
            real_answers.append([answer,interests[num]])
    return jsonify({
        "questions": questions
        })
    
@app.route("/submit_quiz",methods=["POST"])
def submit_quiz():
    global real_answers
    answers=request.json["answers"]
    # print(answers,real_answers)
    # scores=0
    maxsc=0
    categories={}
    for i in answers:
        maxsc+=10
        for j in real_answers:
            print(j[0],j[1],"debug 0")
            if j[1] not in categories:
                print(j[1],"debug 1")
                categories[j[1]]=0
            if j[0]["answer"]==i:
                print(j[0],"debug 2")
                categories[j[1]]+=10
    # print(categories)
    lowest_cat=""
    lowest_score=99999
    for i in categories.keys():
        if categories[i]<=lowest_score:
            lowest_score=categories[i]
            lowest_cat=i
    return jsonify({
        "categories":categories,
        "area_of_impro":f"need to improve in {lowest_cat}",
        "graph_data":{
            "x":30,
            "y":90
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