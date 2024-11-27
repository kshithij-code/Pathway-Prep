import spacy

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# List of valid domains
valid_domains = [
    "web development", "data science", "data analytics",
    "cybersecurity", "game development", "blockchain", "machine learning"
]

# Function to find the best match
def find_best_match_spacy(user_input):
    input_doc = nlp(user_input)
    domain_docs = [nlp(domain) for domain in valid_domains]
    
    # Compute similarity scores
    similarities = [input_doc.similarity(domain_doc) for domain_doc in domain_docs]
    
    # Get the top 3 matches
    sorted_indices = sorted(range(len(similarities)), key=lambda i: similarities[i], reverse=True)
    suggestions = [(valid_domains[i], similarities[i]) for i in sorted_indices[:3]]
    return suggestions

# Main script
user_input = input("Enter your domain of interest: ").strip().lower()
suggestions = find_best_match_spacy(user_input)

print(f"Did you mean one of these?")
for i, (suggestion, score) in enumerate(suggestions, 1):
    print(f"{i}. {suggestion} (Similarity: {score:.2f})")

choice = input("Enter the number of your choice (or type 'none' to re-enter): ").strip().lower()
if choice.isdigit() and 1 <= int(choice) <= len(suggestions):
    corrected_input = suggestions[int(choice) - 1][0]
    print(f"You selected: {corrected_input}")
else:
    print("Please re-enter your domain of interest.")
