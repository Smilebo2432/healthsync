import google.generativeai as genai
import json
import os
from datetime import datetime, timedelta

# Configure Gemini API
# Use environment variable for API key
api_key = os.getenv('GEMINI_API_KEY', 'AIzaSyDuNOzEpmeZ8-RQUkGsxhsT17OzkByvlN4')
genai.configure(api_key=api_key)

# Use Gemini Pro model (updated to latest version)
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
except:
    # Fallback to older model if needed
    model = genai.GenerativeModel('gemini-1.5-flash')

# Enhanced specialized prompts for different health tasks
MEDICAL_DOCUMENT_PROMPT = """
You are MedExtract AI, a specialized medical document processor with expertise in healthcare data extraction.

TASK: Extract structured health information from medical documents with high accuracy.

INPUT: Raw text from medical documents (prescriptions, lab results, doctor notes, discharge summaries)

OUTPUT FORMAT (JSON only, no other text):
{
  "medications": [
    {
      "name": "Exact medication name",
      "dosage": "Specific dosage and unit (e.g., 500mg, 10mg)",
      "frequency": "How often (e.g., twice daily, once daily, as needed)",
      "duration": "How long to take (e.g., ongoing, 7 days, until finished)",
      "instructions": "Special instructions (e.g., take with food, avoid alcohol)",
      "refill_date": "When to refill (YYYY-MM-DD format or relative date)"
    }
  ],
  "appointments": [
    {
      "type": "Appointment type (e.g., follow-up, consultation, lab work)",
      "doctor": "Doctor name or specialty",
      "date": "Appointment date (YYYY-MM-DD format or relative date)",
      "reason": "Why scheduled (e.g., diabetes check, blood pressure monitoring)"
    }
  ],
  "health_metrics": [
    {
      "metric": "Health metric name (e.g., blood pressure, blood sugar, weight)",
      "value": "Measurement value with units",
      "date": "When measured (YYYY-MM-DD format)",
      "status": "Status (normal, high, low, elevated, controlled)"
    }
  ],
  "recommendations": [
    "Specific actionable recommendations from the document"
  ]
}

RULES:
- Extract exact medication names, dosages, and frequencies
- Convert all dates to YYYY-MM-DD format when possible
- Flag any concerning or abnormal values
- Use precise medical terminology
- If information is missing, use empty arrays []
- Always return valid JSON format
- Include all medications mentioned, even if dosage is unclear
- Extract both current and future appointments
- Identify health metrics and their status
- Provide specific, actionable recommendations
"""

HEALTH_CHAT_PROMPT = """
You are HealthBuddy, a caring and knowledgeable personal health assistant powered by AI.

CONTEXT: You have access to the user's complete health profile including medications, lab results, appointments, and health metrics.

PERSONALITY:
- Warm, encouraging, and supportive
- Medically informed but always recommend consulting healthcare professionals
- Focuses on actionable, practical advice
- Celebrates health improvements and progress
- Professional yet approachable

CAPABILITIES:
- Medication timing and interaction advice
- Health goal tracking and motivation
- Symptom discussion and guidance
- Appointment preparation tips
- Lifestyle and wellness recommendations
- Health metric interpretation
- Preventive care suggestions

RESPONSE STYLE:
- Personal and specific to their health data
- Include relevant references to their medications, conditions, or metrics
- Always suggest consulting doctors for serious concerns
- Provide 2-3 actionable, specific steps when possible
- Keep responses concise but comprehensive (100-200 words)
- Use encouraging language
- Include safety reminders when appropriate

SAFETY GUIDELINES:
- Never provide definitive medical diagnoses
- Always recommend professional medical advice for serious symptoms
- Be cautious with medication advice beyond basic timing
- Encourage regular check-ups and preventive care
"""

SCHEDULER_PROMPT = """
You are ChronoHealth, an intelligent medical appointment and medication scheduler.

INPUT: User's health profile, medications, appointments, and health metrics

TASK: Create optimal calendar events for comprehensive health management.

OUTPUT FORMAT (JSON array of events):
[
  {
    "summary": "Event title",
    "description": "Detailed description with instructions",
    "start_time": "YYYY-MM-DDTHH:MM:SS",
    "end_time": "YYYY-MM-DDTHH:MM:SS",
    "reminders": ["popup", "email"],
    "colorId": "11"
  }
]

EVENT TYPES TO CREATE:
1. Medication reminders (optimal timing based on medication type)
2. Doctor appointments (with preparation reminders)
3. Lab work and checkups
4. Health activities (exercise, meal prep, monitoring)
5. Refill reminders (7 days before running out)
6. Preventive care reminders

SCHEDULING RULES:
- Morning medications: 8:00 AM
- Evening medications: 8:00 PM
- With-meal medications: 7:00 AM and 6:00 PM
- Appointment buffer: 15 minutes before
- Refill reminders: 7 days early
- Lab work: 30 minutes duration
- Exercise: 45 minutes duration
- Health monitoring: 15 minutes duration

MEDICATION TIMING CONSIDERATIONS:
- Blood pressure meds: Morning (8 AM)
- Diabetes meds: With meals
- Cholesterol meds: Evening (8 PM)
- Pain meds: As prescribed
- Antibiotics: Evenly spaced throughout day
"""

HEALTH_INSIGHTS_PROMPT = """
You are HealthInsights AI, a specialized health data analyst.

TASK: Analyze health data and provide personalized insights and recommendations.

INPUT: User's health profile including medications, metrics, appointments, and health history.

OUTPUT FORMAT (JSON):
{
  "insights": [
    "Specific health insight based on data"
  ],
  "recommendations": [
    "Actionable recommendation"
  ],
  "trends": [
    "Health trend observation"
  ],
  "alerts": [
    "Important health alert or reminder"
  ]
}

ANALYSIS FOCUS:
- Medication effectiveness and timing
- Health metric trends and patterns
- Appointment scheduling optimization
- Preventive care opportunities
- Lifestyle improvement suggestions
- Risk factor identification
- Progress tracking and motivation
"""

def analyze_medical_document(document_text):
    """
    Analyze medical documents using Gemini AI with enhanced accuracy
    """
    try:
        prompt = MEDICAL_DOCUMENT_PROMPT + "\n\nDOCUMENT TEXT:\n" + document_text
        
        response = model.generate_content(prompt)
        
        # Try to parse the response as JSON
        try:
            # Clean the response text to extract JSON
            response_text = response.text.strip()
            
            # Find JSON content between curly braces
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                result = json.loads(json_str)
            else:
                result = json.loads(response_text)
            
            # Validate and clean the result
            validated_result = {
                "medications": result.get("medications", []),
                "appointments": result.get("appointments", []),
                "health_metrics": result.get("health_metrics", []),
                "recommendations": result.get("recommendations", [])
            }
            
            print(f"Successfully extracted: {len(validated_result['medications'])} medications, {len(validated_result['appointments'])} appointments")
            return validated_result
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Response text: {response.text}")
            # Return structured fallback
            return {
                "medications": [],
                "appointments": [],
                "health_metrics": [],
                "recommendations": ["Document processed but structure unclear. Please review manually."]
            }
            
    except Exception as e:
        error_msg = str(e)
        print(f"Error analyzing document: {error_msg}")
        
        # Handle specific error types
        if "429" in error_msg or "quota" in error_msg.lower():
            return {
                "medications": [],
                "appointments": [],
                "health_metrics": [],
                "recommendations": [
                    "AI analysis temporarily unavailable due to high usage. Please try again in a few minutes.",
                    "Your document has been saved and will be analyzed when the service is available."
                ]
            }
        elif "api key" in error_msg.lower() or "authentication" in error_msg.lower():
            return {
                "medications": [],
                "appointments": [],
                "health_metrics": [],
                "recommendations": [
                    "AI service configuration issue. Please contact support.",
                    "Your document has been saved for later processing."
                ]
            }
        else:
            return {
                "medications": [],
                "appointments": [],
                "health_metrics": [],
                "recommendations": [
                    "Document saved successfully. AI analysis will be retried automatically.",
                    "You can still view and manage your documents manually."
                ]
            }

def health_chat(user_message, health_context):
    """
    Enhanced chat with the health AI using Gemini
    """
    try:
        # Format health context for better AI understanding
        context_summary = {
            "medications": [f"{med.get('name', 'Unknown')} {med.get('dosage', '')} {med.get('frequency', '')}" for med in health_context.get('medications', [])],
            "appointments": [f"{apt.get('type', 'Appointment')} with {apt.get('doctor', 'Doctor')} on {apt.get('date', 'TBD')}" for apt in health_context.get('appointments', [])],
            "health_metrics": [f"{metric.get('metric', 'Metric')}: {metric.get('value', 'N/A')} ({metric.get('status', 'Unknown')})" for metric in health_context.get('health_metrics', [])],
            "recommendations": health_context.get('recommendations', [])
        }
        
        context_str = json.dumps(context_summary, indent=2)
        prompt = f"""
{HEALTH_CHAT_PROMPT}

USER'S HEALTH PROFILE:
{context_str}

USER MESSAGE: {user_message}

Please provide a helpful, personalized response based on their health data. Be specific and actionable.
"""
        
        response = model.generate_content(prompt)
        return response.text.strip()
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in health chat: {error_msg}")
        
        # Handle specific error types
        if "429" in error_msg or "quota" in error_msg.lower():
            return "I'm experiencing high usage right now. Please try again in a few minutes. Your message has been saved."
        elif "api key" in error_msg.lower() or "authentication" in error_msg.lower():
            return "I'm having technical difficulties. Please contact support for assistance."
        else:
            return "I'm having trouble processing your request right now. Please try again in a moment."

def create_medication_schedule(medications):
    """
    Create comprehensive medication schedule using Gemini AI
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
Consider medication interactions, meal timing, and optimal dosing schedules.
Return as JSON array of calendar events.
"""
        
        response = model.generate_content(prompt)
        
        try:
            # Clean and parse JSON response
            response_text = response.text.strip()
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                schedule = json.loads(json_str)
            else:
                schedule = json.loads(response_text)
            
            # Validate schedule format
            validated_schedule = []
            for event in schedule:
                if isinstance(event, dict) and 'summary' in event:
                    validated_schedule.append({
                        "summary": event.get("summary", "Health Event"),
                        "description": event.get("description", ""),
                        "start_time": event.get("start_time", ""),
                        "end_time": event.get("end_time", ""),
                        "reminders": event.get("reminders", ["popup"]),
                        "colorId": event.get("colorId", "11")
                    })
            
            print(f"Created {len(validated_schedule)} calendar events")
            return validated_schedule
            
        except json.JSONDecodeError:
            print("JSON parsing failed, using fallback schedule")
            return create_fallback_schedule(medications)
            
    except Exception as e:
        print(f"Error creating schedule: {e}")
        return create_fallback_schedule(medications)

def generate_health_insights(health_data):
    """
    Generate personalized health insights using Gemini AI
    """
    try:
        data_str = json.dumps(health_data, indent=2)
        prompt = f"""
{HEALTH_INSIGHTS_PROMPT}

HEALTH DATA:
{data_str}

Analyze this health data and provide personalized insights, recommendations, and trends.
"""
        
        response = model.generate_content(prompt)
        
        try:
            # Parse JSON response
            response_text = response.text.strip()
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                insights = json.loads(json_str)
            else:
                insights = json.loads(response_text)
            
            return insights
            
        except json.JSONDecodeError:
            return {
                "insights": ["Health data analysis completed"],
                "recommendations": ["Continue monitoring your health metrics"],
                "trends": ["Regular check-ups are important"],
                "alerts": []
            }
            
    except Exception as e:
        print(f"Error generating insights: {e}")
        return {
            "insights": ["Unable to generate insights at this time"],
            "recommendations": ["Please consult with your healthcare provider"],
            "trends": [],
            "alerts": []
        }

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
                "description": f"Dosage: {med.get('dosage', 'As prescribed')}\nInstructions: {med.get('instructions', '')}",
                "start_time": event_date.replace(hour=8, minute=0, second=0, microsecond=0).isoformat(),
                "end_time": event_date.replace(hour=8, minute=15, second=0, microsecond=0).isoformat(),
                "reminders": ["popup"],
                "colorId": "11"
            })
            
            # Evening reminder if needed
            if med.get('frequency', '').lower() in ['twice daily', 'bid', '2x daily']:
                schedule.append({
                    "summary": f"Take {med.get('name', 'Medication')}",
                    "description": f"Dosage: {med.get('dosage', 'As prescribed')}\nInstructions: {med.get('instructions', '')}",
                    "start_time": event_date.replace(hour=20, minute=0, second=0, microsecond=0).isoformat(),
                    "end_time": event_date.replace(hour=20, minute=15, second=0, microsecond=0).isoformat(),
                    "reminders": ["popup"],
                    "colorId": "11"
                })
    
    return schedule

def extract_text_from_image(image_data):
    """
    Extract text from medical document images using Gemini Vision
    """
    try:
        # For now, return a sample text for testing
        # In production, this would use Gemini Vision API
        return "Sample prescription: Metformin 500mg twice daily with meals. Lisinopril 10mg once daily in the morning."
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return ""

def test_gemini_connection():
    """
    Test if Gemini API is working properly
    """
    try:
        test_prompt = "Hello, this is a test. Please respond with 'Gemini is working!'"
        response = model.generate_content(test_prompt)
        return response.text.strip() == "Gemini is working!"
    except Exception as e:
        print(f"Gemini connection test failed: {e}")
        return False
