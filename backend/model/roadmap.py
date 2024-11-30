import random
import json
import spacy

# Load spaCy model for NLP-based title generation
nlp = spacy.load('en_core_web_sm')

# Fallback Topics and Stages
FALLBACK_TOPICS = {
    "quantum computing": {
        "Introduction": [
            "Understanding Quantum Mechanics",
            "Quantum Gates and Qubits",
        ],
        "Programming": [
            "Introduction to Qiskit",
            "Introduction to Cirq",
        ],
        "Advanced Topics": [
            "Quantum Error Correction",
            "Quantum Algorithms (Shor's, Grover's)",
        ],
        "Applications": [
            "Quantum Computing in AI",
            "Quantum Computing in Cryptography",
        ]
    },
    "blockchain": {
        "Introduction": [
            "Blockchain Fundamentals",
            "Cryptography Basics"
        ],
        "Smart Contracts": [
            "Ethereum Basics",
            "Solidity Basics"
        ],
        "Applications": [
            "Blockchain for Supply Chain",
            "Blockchain for Finance"
        ]
    }
    # Add more topics as necessary
}

# Function to generate dynamic node titles using NLP techniques
def generate_dynamic_title(interest, step_number, subtopic=None):
    """
    Generate a dynamic node title using NLP techniques.
    Uses the interest, step number, and optionally subtopics to create contextually relevant titles.
    """
    # Define basic structures for titles
    title_templates = [
        f"Introduction to {interest}",
        f"Learn the Basics of {interest}",
        f"Understanding the Fundamentals of {interest}",
        f"Explore Advanced Topics in {interest}",
        f"Hands-on Practice with {interest}",
        f"Applications of {interest}",
        f"Mastering {interest}"
    ]
    
    # Generate title based on subtopic
    if subtopic:
        title_templates = [
            f"Introduction to {subtopic} in {interest}",
            f"Explore {subtopic} in {interest}",
            f"Mastering {subtopic} with {interest}",
            f"Hands-on Practice in {subtopic} with {interest}"
        ]
    
    # Randomly select a title template
    title = random.choice(title_templates)

    return title

# Function to generate a fallback learning plan for unknown topics
def generate_fallback_plan(interest):
    """
    Generate a fallback learning plan for an unknown or unlisted topic.
    """
    return {
        "Introduction": [
            "Fundamentals and Key Concepts",
            "Core Theories and Ideas",
        ],
        "Advanced Topics": [
            "Applications in the Real World",
            "Mastering Key Skills",
        ]
    }

# Function to generate dynamic roadmap with branching paths
def generate_dynamic_roadmap(data):
    """
    Generates a personalized learning roadmap with dynamic branching paths.
    """
    interests = data.get("interest", [])
    if not interests:
        return {"error": "No interests provided"}

    # Select a random interest from the list
    selected_interest = random.choice(interests)
    
    # Get the learning plan for the selected interest (using fallback if necessary)
    learning_plan = FALLBACK_TOPICS.get(selected_interest.lower())
    if not learning_plan:
        learning_plan = generate_fallback_plan(selected_interest)

    # Create the roadmap structure
    roadmap = {
        "title": f"{selected_interest.capitalize()} Learning Roadmap",
        "nodes": [],
        "edges": []
    }

    # Add the starting point (Main node)
    roadmap["nodes"].append({
        "id": "1",
        "type": "input",
        "data": { "label": f"{selected_interest.capitalize()} Introduction" },
        "position": { "x": 250, "y": 100 },
        "style": { "background": "#fff", "border": "1px solid #1a192b", "borderRadius": "3px", "padding": "10px" }
    })

    # Generate dynamic branching roadmap with corrected distances
    node_id = 2  # Start from node 2
    y_offset = 100  # Vertical offset to keep nodes closer
    x_offset = 200  # Horizontal offset to prevent nodes from being too far apart

    for category, subtopics in learning_plan.items():
        # Add category node (each stage)
        roadmap["nodes"].append({
            "id": str(node_id),
            "data": { "label": f"{category} in {selected_interest.capitalize()}" },
            "position": { "x": 250, "y": node_id * y_offset },
            "style": { "background": "#ff5722", "border": "1px solid #1a192b", "borderRadius": "3px", "padding": "10px" }
        })

        # Connect the category node to the main node
        roadmap["edges"].append({
            "id": f"e1-{node_id}",
            "source": "1",
            "target": str(node_id),
            "type": "smoothstep",
            "animated": True,
            "style": { "stroke": "#1a192b" }
        })

        # Create branching subtopic nodes
        for sub_idx, subtopic in enumerate(subtopics):
            subtopic_node_id = str(node_id + sub_idx + 1)
            roadmap["nodes"].append({
                "id": subtopic_node_id,
                "data": { "label": generate_dynamic_title(selected_interest, sub_idx, subtopic) },
                "position": { "x": 500 + (sub_idx * x_offset), "y": (node_id * y_offset) + 50 },
                "style": { "background": "#ff5722", "border": "1px solid #1a192b", "borderRadius": "3px", "padding": "10px" }
            })

            # Create edges between category and subtopic nodes
            roadmap["edges"].append({
                "id": f"e{node_id}-{subtopic_node_id}",
                "source": str(node_id),
                "target": subtopic_node_id,
                "type": "smoothstep",
                "animated": True,
                "style": { "stroke": "#1a192b" }
            })

        node_id += len(subtopics) + 1

    return roadmap

# Example user input
input_data = {
    "categories": {
        "coding": 30,
        "aptitude": 10,
        "domain": 10
    },
    "interest": ["quantum computing", "blockchain"]
}

# Generate the roadmap with dynamic branching paths
roadmap = generate_dynamic_roadmap(input_data)

# Print the result (or return it to the Next.js app)
print(json.dumps(roadmap, indent=4))
