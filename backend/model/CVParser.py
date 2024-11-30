import re
import pdfplumber

def parse_skills_and_projects(file_path):
    # Open PDF and extract text
    with pdfplumber.open(file_path) as pdf:
        text = ''.join([page.extract_text() for page in pdf.pages])
    
    # Extract Skills Section
    skills_match = re.search(r"(Skills):?\s*(.*?)(\n\n|\Z)", text, re.DOTALL)
    if skills_match:
        skills_text = skills_match.group(2)

        # Separate by subheadings: Languages and Soft Skills
        languages_match = re.search(r"Languages\s*\|\s*(.*)", skills_text)
        soft_skills_match = re.search(r"Soft Skills\s*\|\s*(.*)", skills_text)

        languages = [
            lang.strip() for lang in languages_match.group(1).split(',') if languages_match
        ] if languages_match else []

        soft_skills = [
            skill.strip() for skill in soft_skills_match.group(1).split(',') if soft_skills_match
        ] if soft_skills_match else []
    else:
        languages = []
        soft_skills = []

    # Extract Projects Section
    projects_match = re.search(r"(Project):?\s*(.*?)(\n\n|\Z)", text, re.DOTALL)
    if projects_match:
        projects_text = projects_match.group(2)
        # Split projects into a list by newline or bullet point, clean up unwanted characters
        projects = [
            re.sub(r"(\uf0b7|\n)", "", proj).strip()
            for proj in re.split(r"\n|•|-", projects_text)
            if proj.strip()
        ]
    else:
        projects = []

    # Return the cleaned parsed data
    return {
        "Skills": {
            "Languages": languages,
            "Soft Skills": soft_skills
        },
        "Projects": projects
    }

# Test the function
parsed_data = parse_skills_and_projects("D:\Downloads\AchalResume.pdf")
print(parsed_data)
