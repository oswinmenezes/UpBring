import os
import json
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# ─── Gemini client ────────────────────────────────────────────────────────────
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
_gemini = genai.GenerativeModel("gemini-2.5-flash")

# ─── Master skill list (column order MUST match feature2.csv columns) ─────────
MASTER_SKILLS = [
    "Python", "Java", "JavaScript", "Go", "CPP", "Ruby", "Swift", "Kotlin",
    "PHP", "TypeScript", "React", "Angular", "Vue", "Django", "Flask", "Spring",
    "Express", "NodeJS", "Flutter", "NextJS", "PostgreSQL", "MySQL", "MongoDB",
    "Redis", "Cassandra", "Elasticsearch", "DynamoDB", "SQLite", "AWS", "Azure",
    "GCP", "DigitalOcean", "Heroku", "Cloudflare", "Docker", "Kubernetes",
    "Terraform", "Jenkins", "Git", "Ansible", "PyTorch", "TensorFlow", "ScikitLearn"
]

# ─── Train model once at import time ──────────────────────────────────────────
_df = pd.read_csv(os.path.join(os.path.dirname(__file__), "feature2.csv"))
_X = _df.drop(columns=["Role"])
_y = _df["Role"]

le = LabelEncoder()
_y_enc = le.fit_transform(_y)

_X_train, _X_test, _y_train, _y_test = train_test_split(
    _X, _y_enc, test_size=0.2, random_state=42
)

model = XGBClassifier(
    objective="multi:softmax",
    num_class=len(set(_y_enc))
)
model.fit(_X_train, _y_train)


# ─── Public API ───────────────────────────────────────────────────────────────

def skill_to_binary(skills: list[str]) -> list[int]:
    """Convert a list of skill names to a binary feature vector."""
    return [1 if skill in skills else 0 for skill in MASTER_SKILLS]


def find_job_role(skills: list[str]) -> str:
    """
    Given a list of skill names, return the predicted job role string.
    
    Args:
        skills: List of skill name strings, e.g. ["Python", "Django", "React"]
    
    Returns:
        Predicted role as a string, e.g. "Full Stack Developer"
    """
    binary_features = skill_to_binary(skills)
    features_array = np.array(binary_features).reshape(1, -1)
    pred = model.predict(features_array)
    role = le.inverse_transform(pred)
    return str(role[0])


def skill_to_learn(user_skill_set: list[str], role_name: str) -> dict:
    """
    Given the user's current skills and a target role, use Gemini to return
    a structured learning roadmap as a JSON-compatible dict.

    Args:
        user_skill_set: List of skills the user already knows.
        role_name:      Target job role (e.g. "Backend Developer").

    Returns:
        dict with keys: role, description, roadmap, courselinks
              OR {"error": "..."} if the role is not recognized.
    """
    role_core_skills = {
        "Full Stack Developer":  ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Git"],
        "ML Engineer":           ["Python", "SQL", "NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "TensorFlow", "Git"],
        "Mobile Developer":      ["Java", "Kotlin", "Swift", "React Native", "Flutter", "Git"],
        "DevOps Engineer":       ["Linux", "Docker", "Kubernetes", "Jenkins", "AWS", "Git", "Python"],
        "Frontend Developer":    ["HTML", "CSS", "JavaScript", "React", "Vue.js", "Git"],
        "Data Scientist":        ["Python", "SQL", "NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "TensorFlow", "Git"],
        "Software Engineer":     ["Python", "Java", "C++", "SQL", "Git", "Data Structures", "Algorithms"],
        "Backend Developer":     ["Python", "Java", "Node.js", "SQL", "Django", "Flask", "Git"],
    }

    if role_name not in role_core_skills:
        return {"error": f"Role '{role_name}' not found. Valid roles: {list(role_core_skills.keys())}"}

    skills_needed = [s for s in role_core_skills[role_name] if s not in user_skill_set]

    prompt = f"""
    The user wants to become a {role_name}.
    They already know: {user_skill_set}.
    They need to learn: {skills_needed}.

    Generate a JSON object with the following structure:
    {{
      "role": "{role_name}",
      "description": "A brief, professional overview of the role.",
      "roadmap": ["Step-by-step list of how to master the missing skills"],
      "marketDemand": "A short sentence about the current market demand for this role.",
      "advices": "A short piece of professional advice for someone transitioning into this role.",
      "courses": [
        {{"name": "Course Title", "platform": "Platform Name (e.g. Coursera, Udemy)", "link": "https://..."}}
      ]
    }}
    Return ONLY the JSON object. Do not include markdown code blocks or extra text.
    """

    response = _gemini.generate_content(prompt)

    try:
        result = json.loads(response.text)
        result["missingSkills"] = skills_needed
        return result
    except json.JSONDecodeError:
        cleaned = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        result["missingSkills"] = skills_needed
        return result