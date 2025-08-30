#!/usr/bin/env python3
"""
Test script to verify all Gemini AI features are working in HealthSync AI
"""

import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:5001"
TEST_DOCUMENT = """
Prescription for John Doe:
- Metformin 500mg twice daily with meals for diabetes management
- Lisinopril 10mg once daily in the morning for blood pressure control
- Atorvastatin 20mg once daily in the evening for cholesterol

Follow-up appointment with Dr. Sarah Johnson on September 15th, 2024 at 2:00 PM for diabetes management check-up.

Recent lab results:
- Blood pressure: 135/85 (slightly elevated)
- Blood sugar (fasting): 120 mg/dL (controlled)
- Weight: 180 lbs

Recommendations:
- Monitor blood sugar levels regularly
- Check blood pressure weekly
- Continue daily exercise routine
- Maintain low-sodium diet
"""

def test_health_endpoint():
    """Test the health endpoint and Gemini connection"""
    print("🔍 Testing Health Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            print(f"✅ Gemini status: {data['gemini_status']}")
            return data['gemini_status'] == 'connected'
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_document_analysis():
    """Test document analysis with Gemini AI"""
    print("\n📄 Testing Document Analysis...")
    try:
        response = requests.post(f"{BASE_URL}/upload", 
                               json={"text": TEST_DOCUMENT})
        if response.status_code == 200:
            data = response.json()
            print("✅ Document analysis successful!")
            print(f"📊 Extracted {len(data['analysis']['medications'])} medications")
            print(f"📅 Extracted {len(data['analysis']['appointments'])} appointments")
            print(f"📈 Extracted {len(data['analysis']['health_metrics'])} health metrics")
            print(f"💡 Generated {len(data['analysis']['recommendations'])} recommendations")
            
            # Show sample extracted data
            if data['analysis']['medications']:
                med = data['analysis']['medications'][0]
                print(f"   Sample medication: {med.get('name', 'Unknown')} {med.get('dosage', '')}")
            
            return True
        else:
            print(f"❌ Document analysis failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Document analysis error: {e}")
        return False

def test_health_chat():
    """Test health chat with Gemini AI"""
    print("\n💬 Testing Health Chat...")
    try:
        response = requests.post(f"{BASE_URL}/chat", 
                               json={"message": "When should I take my blood pressure medication?"})
        if response.status_code == 200:
            data = response.json()
            print("✅ Health chat successful!")
            print(f"🤖 AI Response: {data['response'][:100]}...")
            return True
        else:
            print(f"❌ Health chat failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Health chat error: {e}")
        return False

def test_calendar_sync():
    """Test calendar sync with Gemini AI"""
    print("\n📅 Testing Calendar Sync...")
    try:
        response = requests.post(f"{BASE_URL}/sync-calendar")
        if response.status_code == 200:
            data = response.json()
            print("✅ Calendar sync successful!")
            print(f"📅 Created {data['events_created']} calendar events")
            return True
        else:
            print(f"❌ Calendar sync failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Calendar sync error: {e}")
        return False

def test_health_insights():
    """Test health insights with Gemini AI"""
    print("\n🧠 Testing Health Insights...")
    try:
        response = requests.post(f"{BASE_URL}/health-insights")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health insights successful!")
            print(f"💡 Generated {len(data.get('insights', []))} insights")
            print(f"📋 Generated {len(data.get('recommendations', []))} recommendations")
            print(f"📊 Generated {len(data.get('trends', []))} trends")
            print(f"⚠️  Generated {len(data.get('alerts', []))} alerts")
            return True
        else:
            print(f"❌ Health insights failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Health insights error: {e}")
        return False

def main():
    """Run all Gemini feature tests"""
    print("🚀 HealthSync AI - Gemini Features Test")
    print("=" * 50)
    
    # Wait a moment for backend to be ready
    time.sleep(2)
    
    tests = [
        ("Health Endpoint", test_health_endpoint),
        ("Document Analysis", test_document_analysis),
        ("Health Chat", test_health_chat),
        ("Calendar Sync", test_calendar_sync),
        ("Health Insights", test_health_insights),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All Gemini features are working perfectly!")
    elif passed > 0:
        print("⚠️  Some Gemini features are working, but there are issues to resolve.")
    else:
        print("❌ No Gemini features are working. Please check your configuration.")

if __name__ == "__main__":
    main()
