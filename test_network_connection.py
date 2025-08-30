#!/usr/bin/env python3
"""
Test script to verify network connection between frontend and backend
"""

import requests
import time

def test_backend_network_access():
    """Test if backend is accessible from network IP"""
    print("🔧 Testing Backend Network Access...")
    print("=" * 40)
    
    urls = [
        "http://localhost:5001/health",
        "http://10.10.9.87:5001/health",
        "http://127.0.0.1:5001/health"
    ]
    
    for url in urls:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {url}: {data['status']} - Gemini: {data['gemini_status']}")
            else:
                print(f"❌ {url}: Status {response.status_code}")
        except Exception as e:
            print(f"❌ {url}: Error - {e}")
    
    print()

def test_frontend_network_access():
    """Test if frontend is accessible from network IP"""
    print("🌐 Testing Frontend Network Access...")
    print("=" * 40)
    
    urls = [
        "http://localhost:3000",
        "http://10.10.9.87:3000",
        "http://127.0.0.1:3000"
    ]
    
    for url in urls:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {url}: Frontend loading successfully")
            else:
                print(f"❌ {url}: Status {response.status_code}")
        except Exception as e:
            print(f"❌ {url}: Error - {e}")
    
    print()

def test_api_endpoints_from_network():
    """Test API endpoints from network IP"""
    print("🔌 Testing API Endpoints from Network...")
    print("=" * 40)
    
    base_url = "http://10.10.9.87:5001"
    endpoints = [
        "/health",
        "/health-data",
        "/chat",
        "/upload"
    ]
    
    for endpoint in endpoints:
        try:
            if endpoint == "/chat":
                response = requests.post(f"{base_url}{endpoint}", 
                                       json={"message": "test"}, 
                                       timeout=5)
            elif endpoint == "/upload":
                response = requests.post(f"{base_url}{endpoint}", 
                                       json={"text": "test"}, 
                                       timeout=5)
            else:
                response = requests.get(f"{base_url}{endpoint}", timeout=5)
            
            if response.status_code in [200, 401]:  # 401 is expected for auth endpoints
                print(f"✅ {endpoint}: {response.status_code}")
            else:
                print(f"❌ {endpoint}: {response.status_code}")
                
        except Exception as e:
            print(f"❌ {endpoint}: Error - {e}")

def main():
    """Run all network tests"""
    print("🚀 HealthSync AI - Network Connection Test")
    print("=" * 50)
    print("Testing connectivity from different IP addresses...")
    print("=" * 50)
    
    # Wait a moment for services to start
    print("⏳ Waiting for services to start...")
    time.sleep(3)
    
    # Run tests
    test_backend_network_access()
    test_frontend_network_access()
    test_api_endpoints_from_network()
    
    print("=" * 50)
    print("📊 Network Test Summary:")
    print("=" * 50)
    print("✅ Backend should be accessible at: http://10.10.9.87:5001")
    print("✅ Frontend should be accessible at: http://10.10.9.87:3000")
    print("\n🌐 Try accessing the application at:")
    print("   http://10.10.9.87:3000")
    print("\n💡 If the page is still blank:")
    print("   1. Check browser console for errors (F12)")
    print("   2. Make sure both frontend and backend are running")
    print("   3. Try refreshing the page")

if __name__ == "__main__":
    main()
