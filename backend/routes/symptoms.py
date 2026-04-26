from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from routes.auth import users_db, save_users_db, load_users_db

symptoms_bp = Blueprint('symptoms', __name__)

@symptoms_bp.route('/', methods=['POST'])
@jwt_required()
def log_symptom():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    symptom = {
        'id': len(user['symptoms']) + 1,
        'date': data.get('date', datetime.utcnow().isoformat().split('T')[0]),
        'mood': data.get('mood'),
        'pain_level': data.get('pain_level', 0),
        'symptoms': data.get('symptoms', []),
        'cramps': data.get('cramps', False),
        'headache': data.get('headache', False),
        'fatigue': data.get('fatigue', 0),
        'acne': data.get('acne', False),
        'bloating': data.get('bloating', False),
        'notes': data.get('notes', ''),
        'created_at': datetime.utcnow().isoformat()
    }
    
    user['symptoms'].append(symptom)
    
    # Save to file
    save_users_db(users_db)
    
    return jsonify({
        'message': 'Symptom logged successfully',
        'symptom': symptom
    }), 201

@symptoms_bp.route('/', methods=['GET'])
@jwt_required()
def get_symptoms():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Optional date range filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    symptoms = user['symptoms']
    
    if start_date and end_date:
        symptoms = [s for s in symptoms 
                   if start_date <= s['date'] <= end_date]
    
    return jsonify({
        'symptoms': symptoms,
        'total': len(symptoms)
    }), 200

@symptoms_bp.route('/analysis', methods=['GET'])
@jwt_required()
def analyze_symptoms():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user or not user['symptoms']:
        return jsonify({
            'message': 'No symptoms data available'
        }), 200
    
    symptoms = user['symptoms']
    
    # Calculate averages and patterns
    total = len(symptoms)
    avg_pain = sum(s.get('pain_level', 0) for s in symptoms) / total
    avg_fatigue = sum(s.get('fatigue', 0) for s in symptoms) / total
    cramps_frequency = sum(1 for s in symptoms if s.get('cramps')) / total * 100
    headache_frequency = sum(1 for s in symptoms if s.get('headache')) / total * 100
    
    return jsonify({
        'total_entries': total,
        'average_pain_level': round(avg_pain, 1),
        'average_fatigue': round(avg_fatigue, 1),
        'cramps_frequency': round(cramps_frequency, 1),
        'headache_frequency': round(headache_frequency, 1),
        'insights': [
            'Track symptoms daily for better predictions',
            'High pain levels detected - consider consulting a doctor' if avg_pain > 6 else 'Pain levels are manageable'
        ]
    }), 200
