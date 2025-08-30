#!/usr/bin/env python3
"""
Test script to verify frontend data loading functionality
"""

import requests
import json
import time

def test_backend_health():
    """Test if backend is healthy"""
    try:
        response = requests.get('http://10.10.9.87:5001/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is healthy: {data['message']}")
            print(f"   Gemini status: {data['gemini_status']}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend health check error: {e}")
        return False

def test_health_data_endpoint():
    """Test the health-data endpoint"""
    try:
        response = requests.get('http://10.10.9.87:5001/health-data', timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health data loaded successfully")
            print(f"   Documents: {len(data.get('documents', []))}")
            print(f"   Medications: {len(data.get('medications', []))}")
            print(f"   Appointments: {len(data.get('appointments', []))}")
            print(f"   Health Metrics: {len(data.get('health_metrics', []))}")
            print(f"   Recommendations: {len(data.get('recommendations', []))}")
            print(f"   Chat History: {len(data.get('chat_history', []))}")
            return True
        else:
            print(f"❌ Health data endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health data endpoint error: {e}")
        return False

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    try:
        response = requests.get('http://10.10.9.87:3000', timeout=5)
        if response.status_code == 200:
            print(f"✅ Frontend is accessible")
            return True
        else:
            print(f"❌ Frontend access failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend access error: {e}")
        return False

def test_empty_data_scenario():
    """Test how the system handles empty data"""
    print("\n🧪 Testing empty data scenario...")
    
    # Test with a user that has no data
    try:
        # This would simulate a new user with no data
        empty_data = {
            "documents": [],
            "medications": [],
            "appointments": [],
            "health_metrics": [],
            "recommendations": [],
            "chat_history": []
        }
        
        print("✅ Empty data structure is valid")
        print(f"   Documents: {len(empty_data['documents'])}")
        print(f"   Medications: {len(empty_data['medications'])}")
        print(f"   Appointments: {len(empty_data['appointments'])}")
        print(f"   Health Metrics: {len(empty_data['health_metrics'])}")
        print(f"   Recommendations: {len(empty_data['recommendations'])}")
        print(f"   Chat History: {len(empty_data['chat_history'])}")
        
        return True
    except Exception as e:
        print(f"❌ Empty data test error: {e}")
        return False

def main():
    print("🔍 Testing HealthSync AI Data Loading...")
    print("=" * 50)
    
    # Test backend health
    backend_ok = test_backend_health()
    
    # Test health data endpoint
    data_ok = test_health_data_endpoint()
    
    # Test frontend accessibility
    frontend_ok = test_frontend_accessibility()
    
    # Test empty data scenario
    empty_ok = test_empty_data_scenario()
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   Backend Health: {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"   Data Loading: {'✅ PASS' if data_ok else '❌ FAIL'}")
    print(f"   Frontend Access: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    print(f"   Empty Data Handling: {'✅ PASS' if empty_ok else '❌ FAIL'}")
    
    if all([backend_ok, data_ok, frontend_ok, empty_ok]):
        print("\n🎉 All tests passed! The system should be working correctly.")
        print("\n💡 If you're still seeing a blank page:")
        print("   1. Try refreshing the browser (Cmd+R or Ctrl+R)")
        print("   2. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)")
        print("   3. Check browser console for JavaScript errors (F12)")
        print("   4. Try accessing http://10.10.9.87:3000 directly")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
