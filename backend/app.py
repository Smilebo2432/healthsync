from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from gemini_service import analyze_medical_document, health_chat, create_medication_schedule, generate_health_insights, test_gemini_connection
from calendar_service import sync_to_google_calendar
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://10.10.9.87:3000', 'http://localhost:3000', 'http://127.0.0.1:3000'])

# Initialize Supabase client
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

# Authentication middleware
def authenticate_user():
    """Extract and verify user from request headers"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    
    if not supabase:
        # For development without Supabase
        return {'id': 'dev-user', 'email': 'dev@example.com'}
    
    try:
        # Verify the JWT token with Supabase
        user = supabase.auth.get_user(token)
        return user.user
    except Exception as e:
        print(f"Authentication error: {e}")
        return None

# Load existing health data
def load_health_data():
    try:
        with open('data.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "documents": [],
            "medications": [],
            "appointments": [],
            "health_metrics": [],
            "recommendations": [],
            "chat_history": []
        }

# Save health data
def save_health_data(data):
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/health', methods=['GET'])
def health_check():
    # Test Gemini connection
    gemini_status = test_gemini_connection()
    return jsonify({
        "status": "healthy", 
        "message": "HealthSync AI is running!",
        "gemini_status": "connected" if gemini_status else "disconnected"
    })

@app.route('/upload', methods=['POST'])
def upload_document():
    try:
        # Authenticate user (optional for development)
        user = authenticate_user()
        if not user:
            # For development, use a default user
            user = {'id': 'dev-user', 'email': 'dev@example.com'}
        
        # Get the document text from the request
        data = request.get_json()
        document_text = data.get('text', '')
        
        if not document_text:
            return jsonify({"error": "No document text provided"}), 400
        
        # Analyze the document using Gemini AI
        analysis_result = analyze_medical_document(document_text)
        
        # Load existing data
        health_data = load_health_data()
        
        # Add new document
        new_document = {
            "id": len(health_data["documents"]) + 1,
            "text": document_text,
            "analysis": analysis_result,
            "uploaded_at": datetime.now().isoformat(),
            "user_id": user.get('id')
        }
        
        health_data["documents"].append(new_document)
        
        # Update medications, appointments, etc. from analysis, avoiding duplicates
        def add_unique_items(key):
            if key in analysis_result:
                for item in analysis_result[key]:
                    if item not in health_data[key]:
                        health_data[key].append(item)

        add_unique_items("medications")
        add_unique_items("appointments")
        add_unique_items("health_metrics")
        add_unique_items("recommendations")
        
        # Save updated data
        save_health_data(health_data)
        
        return jsonify({
            "message": "Document analyzed successfully",
            "analysis": analysis_result,
            "document_id": new_document["id"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/import-file', methods=['POST'])
def import_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        filename = secure_filename(file.filename)
        file_ext = os.path.splitext(filename)[1].lower()
        # Save file temporarily
        temp_path = os.path.join('/tmp', filename)
        file.save(temp_path)
        # For now, only support image files (extend to PDF as needed)
        with open(temp_path, 'rb') as f:
            image_data = f.read()
        from gemini_service import extract_text_from_image
        document_text = extract_text_from_image(image_data)
        # Analyze the extracted text
        analysis_result = analyze_medical_document(document_text)
        # Load and update health data
        health_data = load_health_data()
        new_document = {
            "id": len(health_data["documents"]) + 1,
            "text": document_text,
            "analysis": analysis_result,
            "uploaded_at": datetime.now().isoformat()
        }
        health_data["documents"].append(new_document)
        def add_unique_items(key):
            if key in analysis_result:
                for item in analysis_result[key]:
                    if item not in health_data[key]:
                        health_data[key].append(item)
        add_unique_items("medications")
        add_unique_items("appointments")
        add_unique_items("health_metrics")
        add_unique_items("recommendations")
        save_health_data(health_data)
        os.remove(temp_path)
        return jsonify({
            "message": "File imported and analyzed successfully",
            "analysis": analysis_result,
            "document_id": new_document["id"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Load user's health context
        health_data = load_health_data()
        health_context = {
            "medications": health_data["medications"],
            "appointments": health_data["appointments"],
            "health_metrics": health_data["health_metrics"],
            "recommendations": health_data["recommendations"]
        }
        
        # Get AI response using Gemini
        ai_response = health_chat(user_message, health_context)
        
        # Save chat history
        chat_entry = {
            "id": len(health_data["chat_history"]) + 1,
            "user_message": user_message,
            "ai_response": ai_response,
            "timestamp": datetime.now().isoformat()
        }
        
        health_data["chat_history"].append(chat_entry)
        save_health_data(health_data)
        
        return jsonify({
            "response": ai_response,
            "chat_id": chat_entry["id"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/sync-calendar', methods=['POST'])
def sync_calendar():
    try:
        # Load health data
        health_data = load_health_data()
        
        # Create medication schedule using Gemini
        schedule = create_medication_schedule(health_data["medications"])
        
        # Sync to Google Calendar
        calendar_result = sync_to_google_calendar(schedule)
        
        return jsonify({
            "message": "Calendar synced successfully",
            "events_created": len(schedule),
            "calendar_result": calendar_result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health-data', methods=['GET'])
def get_health_data():
    try:
        health_data = load_health_data()
        return jsonify(health_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chat-history', methods=['GET'])
def get_chat_history():
    try:
        health_data = load_health_data()
        return jsonify(health_data["chat_history"])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health-insights', methods=['POST'])
def get_health_insights():
    try:
        # Authenticate user (optional for development)
        user = authenticate_user()
        if not user:
            # For development, use a default user
            user = {'id': 'dev-user', 'email': 'dev@example.com'}
        
        # Get health data
        health_data = load_health_data()
        
        # Generate insights using Gemini AI
        insights = generate_health_insights(health_data)
        
        return jsonify(insights)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)