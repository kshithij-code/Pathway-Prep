import os
import random
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import json

# Set the cache directory for models
cache_dir = r"D:\AI models IMPORTANT\GPT2"
os.environ["TRANSFORMERS_CACHE"] = cache_dir

# Load the model and tokenizer
model = AutoModelForCausalLM.from_pretrained("gpt2", cache_dir=cache_dir)
tokenizer = AutoTokenizer.from_pretrained("gpt2", cache_dir=cache_dir)


# Use the model for text generation
generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

# Function to generate a question based on the user's interest
def generate_question(interest):
    prompt = f"Generate a multiple-choice question about {interest}:"
    question = generator(prompt, max_length=100, num_return_sequences=1)
    return question[0]['generated_text']

# Function to generate the correct answer
def generate_correct_answer(interest):
    return f"The correct answer related to {interest}."

# Function to generate false options (incorrect answers)
def generate_false_options(interest):
    # Manually create false answers related to the topic
    false_answers = [
        f"{interest} has no real-world applications.",
        f"{interest} is only relevant in fictional works.",
        f"{interest} is completely obsolete today.",
    ]
    return false_answers

# Function to generate the MCQ with the correct and false answers
def generate_mcq(interest, category):
    question = generate_question(interest)
    correct_answer = generate_correct_answer(interest)
    false_answers = generate_false_options(interest)
    
    # Shuffle the correct answer into the false options
    options = false_answers + [correct_answer]
    random.shuffle(options)
    
    # Get the correct answer from the shuffled options
    answer = correct_answer
    
    # Return the formatted question in the desired output format
    return {
        "question": question,
        "options": options,
        "category": category,
        "answer": answer
    }

# Sample list of interests and categories from the user
user_interests = ['artificial intelligence', 'data science', 'machine learning', 'financial investing']
categories = ['domain', 'coding', 'domain', 'aptitude']  # Categories for each question

# Generate MCQs for the user’s interests
questions = []
for interest, category in zip(user_interests, categories):
    mcq = generate_mcq(interest, category)
    questions.append(mcq)

# Final formatted output
output = {
    "questions": questions
}

# Print the output as the final JSON format
print(json.dumps(output, indent=4))
