from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from routes.auth import users_db, save_users_db, load_users_db

cycles_bp = Blueprint('cycles', __name__)

@cycles_bp.route('/', methods=['POST'])
@jwt_required()
def add_cycle():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    flow_intensity = data.get('flow_intensity', 'medium')
    
    if not start_date:
        return jsonify({'error': 'Start date is required'}), 400
    
    cycle = {
        'id': len(user['cycles']) + 1,
        'start_date': start_date,
        'end_date': end_date,
        'flow_intensity': flow_intensity,
        'created_at': datetime.utcnow().isoformat()
    }
    
    user['cycles'].append(cycle)
    
    # Save to file
    save_users_db(users_db)
    
    return jsonify({
        'message': 'Cycle added successfully',
        'cycle': cycle
    }), 201

@cycles_bp.route('/', methods=['GET'])
@jwt_required()
def get_cycles():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'cycles': user['cycles'],
        'total': len(user['cycles'])
    }), 200

@cycles_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_cycle_stats():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user or len(user['cycles']) < 2:
        return jsonify({
            'message': 'Not enough data for statistics',
            'cycles_count': len(user.get('cycles', []))
        }), 200
    
    cycles = user['cycles']
    cycle_lengths = []
    
    for i in range(len(cycles) - 1):
        start1 = datetime.fromisoformat(cycles[i]['start_date'])
        start2 = datetime.fromisoformat(cycles[i + 1]['start_date'])
        length = (start2 - start1).days
        cycle_lengths.append(length)
    
    avg_length = sum(cycle_lengths) / len(cycle_lengths) if cycle_lengths else 0
    irregularity = max(cycle_lengths) - min(cycle_lengths) if len(cycle_lengths) > 1 else 0
    
    return jsonify({
        'total_cycles': len(cycles),
        'average_cycle_length': round(avg_length, 1),
        'irregularity_score': irregularity,
        'is_irregular': irregularity > 7,
        'cycle_lengths': cycle_lengths
    }), 200

@cycles_bp.route('/predict-next', methods=['GET'])
@jwt_required()
def predict_next_cycle():
    # Reload database to get latest data
    global users_db
    users_db = load_users_db()
    
    current_user_email = get_jwt_identity()
    user = users_db.get(current_user_email)
    
    if not user or len(user['cycles']) < 2:
        return jsonify({
            'message': 'Need at least 2 cycles for prediction'
        }), 200
    
    cycles = user['cycles']
    cycle_lengths = []
    
    for i in range(len(cycles) - 1):
        start1 = datetime.fromisoformat(cycles[i]['start_date'])
        start2 = datetime.fromisoformat(cycles[i + 1]['start_date'])
        cycle_lengths.append((start2 - start1).days)
    
    avg_length = sum(cycle_lengths) / len(cycle_lengths)
    last_cycle_start = datetime.fromisoformat(cycles[-1]['start_date'])
    predicted_start = last_cycle_start + timedelta(days=int(avg_length))
    
    return jsonify({
        'predicted_start_date': predicted_start.isoformat(),
        'confidence': 'high' if max(cycle_lengths) - min(cycle_lengths) < 5 else 'medium',
        'average_cycle_length': round(avg_length, 1)
    }), 200
