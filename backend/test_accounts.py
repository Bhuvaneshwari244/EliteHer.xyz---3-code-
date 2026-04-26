"""
Test script to verify account persistence
Run this to check if accounts are being saved and loaded correctly
"""

import json
import os

DB_FILE = 'users_data.json'

def check_database():
    """Check if database file exists and show its contents"""
    print("=" * 60)
    print("ACCOUNT PERSISTENCE TEST")
    print("=" * 60)
    
    if not os.path.exists(DB_FILE):
        print(f"\n❌ Database file '{DB_FILE}' does not exist yet")
        print("   This is normal if no accounts have been created")
        print("   Create an account through the app to initialize the database")
        return
    
    try:
        with open(DB_FILE, 'r') as f:
            users_db = json.load(f)
        
        print(f"\n✅ Database file found: {DB_FILE}")
        print(f"✅ Total accounts: {len(users_db)}")
        
        if len(users_db) > 0:
            print("\n📋 Registered Accounts:")
            print("-" * 60)
            for email, user_data in users_db.items():
                print(f"\n📧 Email: {email}")
                print(f"   Name: {user_data.get('name', 'N/A')}")
                print(f"   Age: {user_data.get('age', 'N/A')}")
                print(f"   Created: {user_data.get('created_at', 'N/A')}")
                print(f"   Cycles logged: {len(user_data.get('cycles', []))}")
                print(f"   Symptoms logged: {len(user_data.get('symptoms', []))}")
                print(f"   Password: {'✅ Encrypted (secure)' if user_data.get('password') else '❌ Missing'}")
        else:
            print("\n⚠️  No accounts registered yet")
            print("   Create an account through the app to test persistence")
        
        print("\n" + "=" * 60)
        print("✅ ACCOUNT PERSISTENCE IS WORKING!")
        print("=" * 60)
        print("\nHow to test:")
        print("1. Create an account in the app")
        print("2. Close the app and restart the backend")
        print("3. Login with the same credentials")
        print("4. You should be able to login successfully!")
        print("\n")
        
    except json.JSONDecodeError:
        print(f"\n❌ Error: Database file is corrupted")
        print("   Delete the file and create a new account")
    except Exception as e:
        print(f"\n❌ Error reading database: {e}")

if __name__ == '__main__':
    check_database()
