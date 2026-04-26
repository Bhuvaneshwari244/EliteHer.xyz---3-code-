import json
import os
from werkzeug.security import generate_password_hash

# Create a test user directly
test_user = {
    "email": "test@example.com",
    "password": generate_password_hash("test123"),
    "name": "Test User",
    "age": 25,
    "cycles": [],
    "symptoms": [],
    "moods": [],
    "medications": [],
    "exercises": [],
    "sleep": [],
    "water": [],
    "nutrition": [],
    "supplements": [],
    "weight": []
}

# Create users database
users_db = {
    "test@example.com": test_user
}

# Save to file
with open('users_data.json', 'w') as f:
    json.dump(users_db, f, indent=2)

print("✅ Test user created successfully!")
print("\nLogin credentials:")
print("Email: test@example.com")
print("Password: test123")
print("\nDatabase file created at: users_data.json")
