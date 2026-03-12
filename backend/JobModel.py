from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import pandas as pd
from xgboost import XGBClassifier

def decode_labels(pred):
  roles = le.inverse_transform(pred)
  print(roles)
  return roles


def  skill_to_binary(skills):
    master_skills = ["Python","Java","JavaScript","Go","CPP","Ruby","Swift","Kotlin","PHP","TypeScript",
                    "React","Angular","Vue","Django","Flask","Spring","Express","NodeJS","Flutter","NextJS",
                    "PostgreSQL","MySQL","MongoDB","Redis","Cassandra","Elasticsearch","DynamoDB","SQLite",
                    "AWS","Azure","GCP","DigitalOcean","Heroku","Cloudflare","Docker","Kubernetes",
                    "Terraform","Jenkins","Git","Ansible","PyTorch","TensorFlow","ScikitLearn"]
                    
    student_skills=skills.copy()
    student_skills_binary=[]
    for skill in master_skills:
        if skill in student_skills:
            student_skills_binary.append(1)
        else:
            student_skills_binary.append(0)
    print(student_skills_binary)
    res=model.predict(student_skills_binary)
    decode_labels(res)


def find_job_role(skills):
    bin=skill_to_binary(skills)
    pred = model.predict(bin)
    return decode_labels(pred)
    


def skill_to_learn(user_skill_set, role_name):
    role_core_skills = {
        "Full Stack Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "SQL", "Git"],
        "ML Engineer": ["Python", "SQL", "NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "TensorFlow", "Git"],
        "Mobile Developer": ["Java", "Kotlin", "Swift", "React Native", "Flutter", "Git"],
        "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "Jenkins", "AWS", "Git", "Python"],
        "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Vue.js", "Git"],
        "Data Scientist": ["Python", "SQL", "NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "TensorFlow", "Git"],
        "Software Engineer": ["Python", "Java", "C++", "SQL", "Git", "Data Structures", "Algorithms"],
        "Backend Developer": ["Python", "Java", "Node.js", "SQL", "Django", "Flask", "Git"]
    }

    if role_name not in role_core_skills:
        print(f"Role '{role_name}' not found.")
        return

    # Compute skills the user needs
    skills_needed = role_core_skills[role_name].copy()
    for skill in user_skill_set:
        if skill in skills_needed:
            skills_needed.remove(skill)
    
    print(f"Skills needed to become a {role_name}: {skills_needed}")

    # Generate AI content: explain skills and suggest courses
    prompt = (
        f"These are the skills the user needs to learn to become a {role_name}: {skills_needed}. "
        "Explain each skill briefly and then suggest some online courses or resources where they can learn them."
    )

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    print(response.text)



df=pd.read_csv("feature2.csv")
x=df.drop(columns=["Role"])
y=df["Role"]
print(y)


le = LabelEncoder()
y = le.fit_transform(y)
print(y)


X_train, X_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42
)



model = XGBClassifier(
    objective="multi:softmax",
    num_class=len(set(y))
)

model.fit(X_train, y_train)


user_data=["React","Angular","Vue","Django"]
sb=skill_to_binary(user_data)
job_role=find_job_role(sb)
print(job_role)


skill_to_learn(user_data,"")