import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from github import Github, GithubException
from JobModel import find_job_role, skill_to_learn

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')

@app.route('/api/auth/github', methods=['POST'])
def github_auth():
    """
    Exchange the authorization code for an access token.
    (PyGithub starts after this step, so we use requests here).
    """
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({'error': 'Authorization code is missing'}), 400

    token_url = 'https://github.com/login/oauth/access_token'
    payload = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code
    }
    
    try:
        response = requests.post(token_url, json=payload, headers={'Accept': 'application/json'})
        token_data = response.json()
        
        if 'error' in token_data:
            return jsonify({'error': token_data.get('error_description')}), 400
            
        return jsonify({'access_token': token_data.get('access_token')})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/github/repos', methods=['GET'])
def get_github_repos():
    """
    Fetch all repositories and their READMEs using PyGithub.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid Authorization header'}), 401

    access_token = auth_header.split(' ')[1]
    
    try:
        # Initialize PyGithub client
        g = Github(access_token)
        user = g.get_user()
        
        result = []
        # get_repos() returns a PaginatedList of Repository objects
        repos = user.get_repos(sort="updated")

        for repo in repos:
            readme_content = None
            try:
                # PyGithub handles the API call and base64 decoding for you
                readme = repo.get_readme()
                readme_content = readme.decoded_content.decode('utf-8')
            except GithubException as e:
                # 404 means no README exists
                if e.status != 404:
                    print(f"Error fetching README for {repo.name}: {e.data.get('message')}")
                readme_content = None

            result.append({
                'id': repo.id,
                'name': repo.name,
                'full_name': repo.full_name,
                'private': repo.private,
                'description': repo.description,
                'html_url': repo.html_url,
                'readme': readme_content
            })

        return jsonify({'repos': result})

    except GithubException as e:
        return jsonify({'error': e.data.get('message', 'GitHub API error')}), e.status
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─── Job Model Endpoints ────────────────────────────────────────────────────

@app.route('/api/job/find-role', methods=['POST'])
def get_job_role():
    """
    Predict the best-fit job role from a list of skills.

    Request body (JSON):
        { "skills": ["Python", "Django", "React", ...] }

    Response (JSON):
        { "role": "Backend Developer" }
    """
    data = request.get_json()
    skills = data.get('skills', [])

    if not skills or not isinstance(skills, list):
        return jsonify({'error': '"skills" must be a non-empty list of strings'}), 400

    try:
        role = find_job_role(skills)
        return jsonify({'role': role})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/job/skill-to-learn', methods=['POST'])
def get_skills_to_learn():
    """
    Return a Gemini-generated learning roadmap for a target job role.

    Request body (JSON):
        {
          "skills": ["Python", "Git"],   # skills the user already has
          "role":   "Backend Developer"   # desired target role
        }

    Response (JSON):
        {
          "role":        "Backend Developer",
          "description": "...",
          "roadmap":     ["Step 1", ...],
          "courselinks": ["URL..", ...]
        }
    """
    data = request.get_json()
    skills = data.get('skills', [])
    role   = data.get('role', '')

    if not role:
        return jsonify({'error': '"role" is required'}), 400
    if not isinstance(skills, list):
        return jsonify({'error': '"skills" must be a list of strings'}), 400

    try:
        result = skill_to_learn(skills, role)
        if 'error' in result:
            return jsonify(result), 404
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)