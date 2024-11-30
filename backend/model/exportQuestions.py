import json
import random
from pprint import pprint

def get_random_question(interest):
    # Load the JSON file
    file_path = 'model/Questions/FinalQuestionJSON.json'
    with open(file_path, 'r') as file:
        data = json.load(file)
    
    # Get the list of questions
    questions = data.get(interest, [])
    
    # Select a random question
    if questions:
        selected_question = random.choice(questions)
        return {
            "question": selected_question["question"],
            "options": selected_question["options"],
        },{"answer": selected_question["answer"]}
    else:
        return {"error": "No questions available in the file."}

# File path to your JSON file


# Get a random question
# random_question = get_random_question("Aptitude")

# # Print the result
# pprint(random_question)
