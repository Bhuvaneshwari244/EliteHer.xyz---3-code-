from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json
import os

auth_bp = Blueprint('auth', __name__)

# File-based persistent storage
DB_FILE = 'users_data.json'

def load_users_db():
    """Load users database from file"""
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading database: {e}")
            return {}
    return {}

def save_users_db(users_db):
    """Save users database to file"""
    try:
        with open(DB_FILE, 'w') as f:
            json.dump(users_db, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving database: {e}")
        return False

# Load existing users on startup
users_db = load_users_db()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    age = data.get('age')
    
    if not email or not password or not name:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if email in users_db:
        return jsonify({'error': 'User already exists'}), 409
    
    users_db[email] = {
        'email': email,
        'password': generate_password_hash(password),
        'name': name,
        'age': age,
        'created_at': datetime.utcnow().isoformat(),
        'cycles': [],
        'symptoms': []
    }
    
    # Save to file
    save_users_db(users_db)
    
    access_token = create_access_token(identity=email)
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': {
            'email': email,
            'name': name,
            'age': age
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = users_db.get(email)
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=email)
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'email': user['email'],
            'name': user['name'],
            'age': user.get('age'),
            'total_cycles': len(user.get('cycles', [])),
            'total_symptoms': len(user.get('symptoms', []))
        }
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'email': user['email'],
        'name': user['name'],
        'age': user.get('age'),
        'created_at': user['created_at'],
        'total_cycles': len(user.get('cycles', [])),
        'total_symptoms': len(user.get('symptoms', []))
    }), 200


@auth_bp.route('/check-email', methods=['POST'])
def check_email():
    """Check if an email is already registered"""
    users_db_current = load_users_db()
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    exists = email in users_db_current
    
    return jsonify({
        'exists': exists,
        'message': 'Email is already registered' if exists else 'Email is available'
    }), 200

@auth_bp.route('/users/count', methods=['GET'])
def get_users_count():
    """Get total number of registered users (for admin/debugging)"""
    users_db_current = load_users_db()
    return jsonify({
        'total_users': len(users_db_current),
        'message': f'{len(users_db_current)} users registered'
    }), 200
