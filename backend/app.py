import os
import requests
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes, allowing requests from the frontend
CORS(app, supports_credentials=True)

GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')
GITHUB_API_BASE_URL = 'https://api.github.com'

@app.route('/api/auth/github', methods=['POST'])
def github_auth():
    """
    Exchange the authorization code for an access token.
    Expects JSON body: { "code": "..." }
    """
    data = request.get_json()
    if not data or 'code' not in data:
        return jsonify({'error': 'Authorization code is missing'}), 400

    code = data['code']

    if not GITHUB_CLIENT_ID or not GITHUB_CLIENT_SECRET:
        return jsonify({'error': 'GitHub OAuth credentials are not configured on the server'}), 500

    # Exchange code for access token
    token_url = 'https://github.com/login/oauth/access_token'
    headers = {
        'Accept': 'application/json'
    }
    payload = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_CLIENT_SECRET,
        'code': code
    }

    try:
        response = requests.post(token_url, headers=headers, json=payload)
        response.raise_for_status()
        token_data = response.json()
        print(token_data)

        if 'error' in token_data:
            return jsonify({'error': token_data.get('error_description', token_data['error'])}), 400

        access_token = token_data.get('access_token')
        if not access_token:
            return jsonify({'error': 'Access token not found in GitHub response'}), 500

        return jsonify({'access_token': access_token})

    except requests.exceptions.RequestException as e:
        print(f"Error exchanging code for token: {e}")
        return jsonify({'error': 'Failed to communicate with GitHub for token exchange'}), 502

@app.route('/api/github/repos', methods=['GET'])
def get_github_repos():
    """
    Fetch all repositories for the authenticated user and their READMEs.
    Expects Authorization header: Bearer <access_token>
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid Authorization header'}), 401

    access_token = auth_header.split(' ')[1]
    
    headers = {
        'Authorization': f'token {access_token}',
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
    }

    try:
        # 1. Fetch user repositories (public and private, requires 'repo' scope)
        repos_url = f'{GITHUB_API_BASE_URL}/user/repos?sort=updated&per_page=100'
        repos_response = requests.get(repos_url, headers=headers)
        print(repos_response)
        repos_response.raise_for_status()
        repos = repos_response.json()

        result = []

        # 2. Iterate through repos and fetch README for each
        # Note: In a production app with many repos, this synchronous loop might be slow.
        # Consider using asyncio/aiohttp or a task queue if performance is an issue.
        for repo in repos:
            repo_name = repo['name']
            owner = repo['owner']['login']
            private = repo['private']
            desc = repo['description']
            
            readme_content = None
            
            readme_url = f'{GITHUB_API_BASE_URL}/repos/{owner}/{repo_name}/readme'
            readme_response = requests.get(readme_url, headers=headers)
            
            print(readme_response)
            if readme_response.status_code == 200:
                readme_data = readme_response.json()
                # Decode base64 content
                if 'content' in readme_data:
                    try:
                        # GitHub base64 includes newlines, which need to be stripped sometimes or handled
                        decoded_bytes = base64.b64decode(readme_data['content'])
                        readme_content = decoded_bytes.decode('utf-8', errors='replace')
                    except Exception as e:
                        print(f"Error decoding README for {repo_name}: {e}")
                        readme_content = f"Error decoding: {str(e)}"
            elif readme_response.status_code == 404:
                # No README found
                readme_content = None
            else:
                print(f"Error fetching README for {repo_name}: {readme_response.status_code}")

            result.append({
                'id': repo['id'],
                'name': repo_name,
                'full_name': repo['full_name'],
                'private': private,
                'description': desc,
                'html_url': repo['html_url'],
                'readme': readme_content
            })
        print(result)

        return jsonify({'repos': result})

    except requests.exceptions.HTTPError as e:
        print(f"GitHub API Error: {e.response.text}")
        return jsonify({'error': f"GitHub API returned error: {e.response.status_code}"}), e.response.status_code
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
        return jsonify({'error': 'Failed to communicate with GitHub API'}), 502

if __name__ == '__main__':
    # Run the app. Debug=True for development only.
    app.run(host='0.0.0.0', port=5000, debug=True)
