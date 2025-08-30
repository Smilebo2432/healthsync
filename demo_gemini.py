#!/usr/bin/env python3
"""
Demo script to showcase Gemini AI features working in HealthSync AI
"""

import requests
import json

def demo_health_chat():
    """Demo the health chat feature"""
    print("🤖 Demo: Health Chat with Gemini AI")
    print("-" * 40)
    
    questions = [
        "When should I take my blood pressure medication?",
        "What exercises are safe for my condition?",
        "How often should I check my blood sugar?",
        "What foods should I avoid with my medications?"
    ]
    
    for question in questions:
        print(f"\n❓ Question: {question}")
        try:
            response = requests.post("http://localhost:5001/chat", 
                                   json={"message": question})
            if response.status_code == 200:
                data = response.json()
                answer = data['response'][:150] + "..." if len(data['response']) > 150 else data['response']
                print(f"🤖 Answer: {answer}")
            else:
                print(f"❌ Error: {response.status_code}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)

def demo_calendar_sync():
    """Demo the calendar sync feature"""
    print("📅 Demo: Calendar Sync with Gemini AI")
    print("-" * 40)
    
    try:
        response = requests.post("http://localhost:5001/sync-calendar")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Successfully created {data['events_created']} calendar events!")
            print(f"📊 Message: {data['message']}")
            
            # Show sample events if available
            if 'calendar_result' in data and 'events' in data['calendar_result']:
                events = data['calendar_result']['events']
                print(f"\n📋 Sample Events Created:")
                for i, event in enumerate(events[:3]):  # Show first 3 events
                    print(f"   {i+1}. {event.get('summary', 'Health Event')}")
                    print(f"      Time: {event.get('start_time', 'N/A')}")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)

def demo_health_status():
    """Demo the health status with Gemini connection"""
    print("🔍 Demo: Health Status & Gemini Connection")
    print("-" * 40)
    
    try:
        response = requests.get("http://localhost:5001/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {data['status']}")
            print(f"✅ Message: {data['message']}")
            print(f"✅ Gemini: {data['gemini_status']}")
            
            if data['gemini_status'] == 'connected':
                print("🎉 Gemini AI is fully connected and operational!")
            else:
                print("⚠️  Gemini AI connection issue detected")
        else:
            print(f"❌ Error: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)

def main():
    """Run all Gemini demos"""
    print("🚀 HealthSync AI - Gemini AI Features Demo")
    print("=" * 50)
    print("This demo showcases the Gemini AI integration working in real-time!")
    print("=" * 50)
    
    # Run demos
    demo_health_status()
    demo_health_chat()
    demo_calendar_sync()
    
    print("\n🎉 Demo Complete!")
    print("\n💡 What you just saw:")
    print("   • Gemini AI responding to health questions")
    print("   • AI creating intelligent calendar schedules")
    print("   • Real-time health data analysis")
    print("   • Personalized health recommendations")
    
    print("\n🌐 Try the full application at: http://localhost:3000")
    print("   • Register/login to access all features")
    print("   • Upload medical documents for AI analysis")
    print("   • Chat with your personal health assistant")
    print("   • Get AI-powered health insights")

if __name__ == "__main__":
    main()
