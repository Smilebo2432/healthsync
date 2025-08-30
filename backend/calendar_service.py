import json
import os
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

# Google Calendar API setup
SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_google_calendar_service():
    """
    Get authenticated Google Calendar service
    """
    creds = None
    
    # Check if we have valid credentials
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    # If no valid credentials available, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # For MVP, we'll use a mock service
            # In production, implement OAuth flow
            return MockCalendarService()
        
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    try:
        service = build('calendar', 'v3', credentials=creds)
        return service
    except Exception as e:
        print(f"Error building calendar service: {e}")
        return MockCalendarService()

class MockCalendarService:
    """
    Mock calendar service for MVP development
    """
    def __init__(self):
        self.events = []
    
    def events(self):
        return self
    
    def insert(self, calendarId='primary', body=None):
        if body:
            event = {
                'id': f"mock_event_{len(self.events) + 1}",
                'summary': body.get('summary', 'Health Event'),
                'description': body.get('description', ''),
                'start': body.get('start', {}),
                'end': body.get('end', {}),
                'reminders': body.get('reminders', {})
            }
            self.events.append(event)
            print(f"Mock event created: {event['summary']}")
        return self
    
    def execute(self):
        return {'id': f"mock_event_{len(self.events)}"}

def sync_to_google_calendar(schedule):
    """
    Sync medication schedule to Google Calendar
    """
    try:
        service = get_google_calendar_service()
        
        created_events = []
        
        for event_data in schedule:
            # Create calendar event
            event = {
                'summary': event_data.get('summary', 'Health Reminder'),
                'description': event_data.get('description', ''),
                'start': {
                    'dateTime': event_data.get('start_time'),
                    'timeZone': 'America/New_York',
                },
                'end': {
                    'dateTime': event_data.get('end_time'),
                    'timeZone': 'America/New_York',
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'popup', 'minutes': 10},
                        {'method': 'email', 'minutes': 60},
                    ],
                },
                'colorId': '11',  # Blue color for health events
            }
            
            # Insert event into calendar
            event_result = service.events().insert(
                calendarId='primary',
                body=event
            ).execute()
            
            created_events.append({
                'id': event_result.get('id'),
                'summary': event.get('summary'),
                'start_time': event.get('start', {}).get('dateTime'),
                'status': 'created'
            })
            
        return {
            'success': True,
            'events_created': len(created_events),
            'events': created_events
        }
        
    except Exception as e:
        print(f"Error syncing to calendar: {e}")
        return {
            'success': False,
            'error': str(e),
            'events_created': 0,
            'events': []
        }

def create_medication_reminders(medications):
    """
    Create medication reminder events
    """
    events = []
    today = datetime.now()
    
    for medication in medications:
        name = medication.get('name', 'Medication')
        dosage = medication.get('dosage', 'As prescribed')
        frequency = medication.get('frequency', 'daily').lower()
        
        # Create events for the next 7 days
        for i in range(7):
            event_date = today + timedelta(days=i)
            
            # Morning reminder
            events.append({
                'summary': f"Take {name}",
                'description': f"Dosage: {dosage}\nInstructions: {medication.get('instructions', '')}",
                'start_time': event_date.replace(hour=8, minute=0, second=0, microsecond=0).isoformat(),
                'end_time': event_date.replace(hour=8, minute=15, second=0, microsecond=0).isoformat(),
                'reminders': ['popup']
            })
            
            # Evening reminder for twice-daily medications
            if frequency in ['twice daily', 'bid', '2x daily']:
                events.append({
                    'summary': f"Take {name}",
                    'description': f"Dosage: {dosage}\nInstructions: {medication.get('instructions', '')}",
                    'start_time': event_date.replace(hour=20, minute=0, second=0, microsecond=0).isoformat(),
                    'end_time': event_date.replace(hour=20, minute=15, second=0, microsecond=0).isoformat(),
                    'reminders': ['popup']
                })
    
    return events

def create_appointment_events(appointments):
    """
    Create appointment events
    """
    events = []
    
    for appointment in appointments:
        try:
            # Parse appointment date
            if isinstance(appointment.get('date'), str):
                appointment_date = datetime.fromisoformat(appointment['date'].replace('Z', '+00:00'))
            else:
                appointment_date = datetime.now() + timedelta(days=7)  # Default to next week
            
            # Create appointment event with buffer time
            start_time = appointment_date - timedelta(minutes=15)
            end_time = appointment_date + timedelta(hours=1)
            
            events.append({
                'summary': f"{appointment.get('type', 'Medical Appointment')} - {appointment.get('doctor', 'Doctor')}",
                'description': f"Reason: {appointment.get('reason', 'Check-up')}",
                'start_time': start_time.isoformat(),
                'end_time': end_time.isoformat(),
                'reminders': ['popup', 'email'],
                'colorId': '3'  # Red for appointments
            })
            
        except Exception as e:
            print(f"Error creating appointment event: {e}")
            continue
    
    return events

def get_upcoming_events(days=7):
    """
    Get upcoming health events from calendar
    """
    try:
        service = get_google_calendar_service()
        
        # Calculate time range
        now = datetime.utcnow().isoformat() + 'Z'
        end_date = (datetime.utcnow() + timedelta(days=days)).isoformat() + 'Z'
        
        events_result = service.events().list(
            calendarId='primary',
            timeMin=now,
            timeMax=end_date,
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        
        events = events_result.get('items', [])
        
        # Filter for health-related events
        health_events = []
        for event in events:
            summary = event.get('summary', '').lower()
            if any(keyword in summary for keyword in ['medication', 'take', 'appointment', 'doctor', 'health']):
                health_events.append({
                    'id': event.get('id'),
                    'summary': event.get('summary'),
                    'start': event.get('start', {}).get('dateTime'),
                    'end': event.get('end', {}).get('dateTime'),
                    'description': event.get('description', '')
                })
        
        return health_events
        
    except Exception as e:
        print(f"Error getting upcoming events: {e}")
        return []
