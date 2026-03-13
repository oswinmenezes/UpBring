import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
from github import Github, GithubException
from JobModel import find_job_role, skill_to_learn
from ocr import send_image_as_base64

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

# ─── OCR Endpoints ──────────────────────────────────────────────────────────

@app.route('/api/ocr/extract-text', methods=['POST'])
def extract_text_from_image():
    """
    Extract text from an uploaded image using OCR.

    Request:
        - File upload: multipart/form-data with key 'image'
        - The image file (JPG, PNG, etc.)

    Response (JSON):
        {
            "success": true,
            "extracted_text": "The extracted text from the image..."
        }
    """
    # Check if image file is in the request
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image file provided in request'}), 400

    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({'success': False, 'error': 'No image file selected'}), 400

    # Validate file extension
    allowed_extensions = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'}
    if not ('.' in image_file.filename and image_file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
        return jsonify({'success': False, 'error': 'Invalid file type. Allowed: jpg, jpeg, png, gif, bmp, webp'}), 400

    try:
        # Save the image temporarily using system temp directory
        temp_dir = tempfile.gettempdir()
        temp_image_path = os.path.join(temp_dir, image_file.filename)
        image_file.save(temp_image_path)

        # Get API key from environment
        api_key = os.getenv('HUGGING_FACE_API')
        if not api_key:
            return jsonify({'success': False, 'error': 'API key not configured on server'}), 500

        # Extract text using OCR
        extracted_text = send_image_as_base64(temp_image_path, api_key)

        # Clean up temporary file
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

        return jsonify({
            'success': True,
            'extracted_text': extracted_text
        }), 200

    except ValueError as e:
        # Handle file read errors
        return jsonify({'success': False, 'error': str(e)}), 400
    except RuntimeError as e:
        # Handle OCR processing errors
        return jsonify({'success': False, 'error': str(e)}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': f'Unexpected error: {str(e)}'}), 500


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
        print(e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)