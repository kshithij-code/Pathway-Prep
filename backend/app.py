from flask import Flask,jsonify

app=Flask(__name__)

@app.route("/")
def index():
    return "hello world"

@app.route("/init_1_in",["GET","POST"])
def init_1():
    return jsonify({
        "questions":{
            "question 1":["op 1","op 2","op 3","op 4"],
            "question 2":["op 1","op 2","op 3","op 4"],
            "question 3":["op 1","op 2","op 3","op 4"]
        }})
    
@app.route("/init_2_in",["GET","POST"])
def init_2():
    
    return jsonify({
        "chosen_op":{
            "question 1":["op 1"],
            "question 2":["op 3"],
            "question 3":["op 2"]
        }
    })

if __name__=="__main__":
    app.run(debug=True)