from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)

# Configure CORS to allow all origins (for Vercel deployment)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Request-Time"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False,
        "max_age": 3600
    }
})

jwt = JWTManager(app)

# Import routes
from routes.auth import auth_bp
from routes.cycles import cycles_bp
from routes.symptoms import symptoms_bp
from routes.predictions import predictions_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(cycles_bp, url_prefix='/api/cycles')
app.register_blueprint(symptoms_bp, url_prefix='/api/symptoms')
app.register_blueprint(predictions_bp, url_prefix='/api/predictions')

@app.route('/')
def home():
    return jsonify({
        'message': 'Aura API - Smart Period Tracking & PCOD Risk Prediction',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'auth': '/api/auth',
            'cycles': '/api/cycles',
            'symptoms': '/api/symptoms',
            'predictions': '/api/predictions'
        }
    })

@app.route('/api')
def api_home():
    return jsonify({
        'message': 'Aura API',
        'version': '1.0.0',
        'status': 'running'
    })

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# Vercel serverless function handler
def handler(request):
    return app(request.environ, request.start_response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
