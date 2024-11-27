from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Improvement suggestions based on categories
improvement_data = {
    "Beginner": [
        {"title": "Learn fundamentals", "description": "Focus on the basics of the subject."},
        {"title": "Complete beginner projects", "description": "Build simple projects to practice concepts."},
        {"title": "Explore tutorials", "description": "Use online resources to strengthen your foundation."}
    ],
    "Intermediate": [
        {"title": "Work on intermediate projects", "description": "Create projects to test real-world skills."},
        {"title": "Learn advanced concepts", "description": "Explore deeper topics and frameworks."},
        {"title": "Collaborate with peers", "description": "Work in teams to enhance problem-solving abilities."}
    ],
    "Advanced": [
        {"title": "Contribute to open source", "description": "Participate in large-scale projects to improve expertise."},
        {"title": "Take leadership roles", "description": "Mentor beginners or lead a small team."},
        {"title": "Pursue specialization", "description": "Focus on niche areas or research topics."}
    ]
}

# Function to categorize test scores
def categorize_score(score):
    if score <= 50:
        return "Beginner"
    elif 51 <= score <= 75:
        return "Intermediate"
    else:
        return "Advanced"

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/generate_roadmap', methods=['POST'])
def generate_roadmap():
    data = request.json
    score = data.get("score", 0)
    category = categorize_score(score)
    improvements = improvement_data.get(category, [])
    return jsonify({"category": category, "improvements": improvements})

if __name__ == "__main__":
    app.run(debug=True)
