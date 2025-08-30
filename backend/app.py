from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
from gemini_service import analyze_medical_document, health_chat, create_medication_schedule
from calendar_service import sync_to_google_calendar

app = Flask(__name__)
CORS(app)

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
    return jsonify({"status": "healthy", "message": "HealthSync AI is running!"})

@app.route('/upload', methods=['POST'])
def upload_document():
    try:
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
            "uploaded_at": datetime.now().isoformat()
        }
        
        health_data["documents"].append(new_document)
        
        # Update medications, appointments, etc. from analysis
        if "medications" in analysis_result:
            health_data["medications"].extend(analysis_result["medications"])
        
        if "appointments" in analysis_result:
            health_data["appointments"].extend(analysis_result["appointments"])
            
        if "health_metrics" in analysis_result:
            health_data["health_metrics"].extend(analysis_result["health_metrics"])
            
        if "recommendations" in analysis_result:
            health_data["recommendations"].extend(analysis_result["recommendations"])
        
        # Save updated data
        save_health_data(health_data)
        
        return jsonify({
            "message": "Document analyzed successfully",
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
