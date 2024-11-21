from flask import Flask,jsonify

app=Flask(__name__)

@app.route("/")
def index():
    return "hello world"

@app.route("/init_1_out")
def init_1():
    return jsonify({
        "questions":{
            {"question 1":["op 1","op 2","op 3","op 4"],"category":"coding"},
            {"question 2":["op 1","op 2","op 3","op 4"],"category":"coding"},
            {"question 3":["op 1","op 2","op 3","op 4"],"category":"domain"}
        }})
    
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