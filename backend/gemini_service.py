import google.generativeai as genai
import json
import os
from datetime import datetime, timedelta

# Configure Gemini API
# In production, use environment variable
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-api-key-here')
genai.configure(api_key=GEMINI_API_KEY)

# Use Gemini Pro model
model = genai.GenerativeModel('gemini-pro')

# Specialized prompts for different health tasks
MEDICAL_DOCUMENT_PROMPT = """
You are MedExtract AI, a specialized medical document processor.

TASK: Extract structured health information from medical documents.

INPUT: Raw text from medical documents (prescriptions, lab results, doctor notes)

OUTPUT FORMAT (JSON):
{
  "medications": [
    {
      "name": "Medication name",
      "dosage": "Amount and unit",
      "frequency": "How often",
      "duration": "How long",
      "instructions": "Special notes",
      "refill_date": "When to refill"
    }
  ],
  "appointments": [
    {
      "type": "Appointment type",
      "doctor": "Doctor name",
      "date": "Appointment date",
      "reason": "Why scheduled"
    }
  ],
  "health_metrics": [
    {
      "metric": "Blood pressure, weight, etc.",
      "value": "Measurement",
      "date": "When measured",
      "status": "normal/high/low"
    }
  ],
  "recommendations": [
    "Action items from the document"
  ]
}

RULES:
- Extract exact medication names and dosages
- Convert relative dates to actual dates
- Flag any concerning values
- Be precise with medical terminology
- If information is missing, use null or empty arrays
- Always return valid JSON
"""

HEALTH_CHAT_PROMPT = """
You are HealthBuddy, a caring personal health assistant.

CONTEXT: You have access to the user's complete health profile including medications, lab results, appointments, and health goals.

PERSONALITY:
- Encouraging and supportive
- Medically informed but not a replacement for doctors
- Focuses on actionable advice
- Celebrates small wins

CAPABILITIES:
- Medication reminders and interactions
- Health goal tracking
- Symptom discussions
- Appointment scheduling suggestions
- Lifestyle recommendations

RESPONSE STYLE:
- Warm and personal
- Include specific references to their health data
- Always suggest consulting doctors for serious concerns
- Provide 2-3 actionable steps when possible
- Keep responses under 150 words
"""

SCHEDULER_PROMPT = """
You are ChronoHealth, an intelligent medical appointment scheduler.

INPUT: User's health profile, medications, and scheduling preferences

TASK: Create optimal calendar events for:
1. Medication reminders (with meal timing)
2. Doctor appointments (based on conditions)
3. Lab work and checkups
4. Health activities (exercise, meal prep)

OUTPUT: Google Calendar compatible events with:
- Optimal timing based on medication interactions
- Buffer time for medical appointments
- Preventive care reminders
- Refill alerts before running out

RULES:
- Avoid medication conflicts
- Consider meal timing for medications
- Schedule preventive care based on age/conditions
- Add 15min buffer for medical appointments
- Set refill reminders 7 days early
- Always return valid JSON array of events
"""

def analyze_medical_document(document_text):
    """
    Analyze medical documents using Gemini AI
    """
    try:
        prompt = MEDICAL_DOCUMENT_PROMPT + "\n\nDOCUMENT TEXT:\n" + document_text
        
        response = model.generate_content(prompt)
        
        # Try to parse the response as JSON
        try:
            result = json.loads(response.text)
            return result
        except json.JSONDecodeError:
            # If JSON parsing fails, return a structured fallback
            return {
                "medications": [],
                "appointments": [],
                "health_metrics": [],
                "recommendations": ["Document processed but structure unclear"]
            }
            
    except Exception as e:
        print(f"Error analyzing document: {e}")
        return {
            "medications": [],
            "appointments": [],
            "health_metrics": [],
            "recommendations": [f"Error processing document: {str(e)}"]
        }

def health_chat(user_message, health_context):
    """
    Chat with the health AI using Gemini
    """
    try:
        context_str = json.dumps(health_context, indent=2)
        prompt = f"""
{HEALTH_CHAT_PROMPT}

USER'S HEALTH PROFILE:
{context_str}

USER MESSAGE: {user_message}

Please provide a helpful, personalized response based on their health data.
"""
        
        response = model.generate_content(prompt)
        return response.text.strip()
        
    except Exception as e:
        print(f"Error in health chat: {e}")
        return "I'm having trouble processing your request right now. Please try again or contact support."

def create_medication_schedule(medications):
    """
    Create medication schedule using Gemini AI
    """
    try:
        if not medications:
            return []
            
        meds_str = json.dumps(medications, indent=2)
        prompt = f"""
{SCHEDULER_PROMPT}

MEDICATIONS TO SCHEDULE:
{meds_str}

Create a 7-day schedule starting from today ({datetime.now().strftime('%Y-%m-%d')}).
Return as JSON array of calendar events.
"""
        
        response = model.generate_content(prompt)
        
        try:
            schedule = json.loads(response.text)
            return schedule
        except json.JSONDecodeError:
            # Fallback: create basic schedule
            return create_fallback_schedule(medications)
            
    except Exception as e:
        print(f"Error creating schedule: {e}")
        return create_fallback_schedule(medications)

def create_fallback_schedule(medications):
    """
    Create a basic medication schedule if AI fails
    """
    schedule = []
    today = datetime.now()
    
    for med in medications:
        # Create daily reminders for each medication
        for i in range(7):
            event_date = today + timedelta(days=i)
            
            # Morning reminder
            schedule.append({
                "summary": f"Take {med.get('name', 'Medication')}",
                "description": f"Dosage: {med.get('dosage', 'As prescribed')}",
                "start_time": event_date.replace(hour=8, minute=0, second=0, microsecond=0).isoformat(),
                "end_time": event_date.replace(hour=8, minute=15, second=0, microsecond=0).isoformat(),
                "reminders": ["popup"]
            })
            
            # Evening reminder if needed
            if med.get('frequency', '').lower() in ['twice daily', 'bid', '2x daily']:
                schedule.append({
                    "summary": f"Take {med.get('name', 'Medication')}",
                    "description": f"Dosage: {med.get('dosage', 'As prescribed')}",
                    "start_time": event_date.replace(hour=20, minute=0, second=0, microsecond=0).isoformat(),
                    "end_time": event_date.replace(hour=20, minute=15, second=0, microsecond=0).isoformat(),
                    "reminders": ["popup"]
                })
    
    return schedule

def extract_text_from_image(image_data):
    """
    Extract text from medical document images using Gemini Vision
    """
    try:
        # For MVP, we'll use a mock implementation
        # In production, use Gemini Vision API
        return "Sample prescription text for testing purposes"
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return ""
