from firebase_functions import https_fn
from firebase_admin import initialize_app
import sys
import os

# Initialize Firebase Admin
initialize_app()

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

# Import Flask app
from app import app

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    """HTTP Cloud Function for API requests"""
    with app.request_context(req.environ):
        return app.full_dispatch_request()
