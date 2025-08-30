#!/usr/bin/env python3
"""
Test script to verify the webpage is working properly
"""

import requests
from bs4 import BeautifulSoup

def test_frontend_loading():
    """Test if the frontend is loading properly"""
    print("🌐 Testing Frontend Loading...")
    print("=" * 40)
    
    try:
        response = requests.get("http://localhost:3000")
        
        if response.status_code == 200:
            print("✅ Frontend is loading successfully!")
            
            # Parse the HTML to check for key elements
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Check for title
            title = soup.find('title')
            if title:
                print(f"📄 Title: {title.text}")
            
            # Check for React app div
            app_div = soup.find('div', {'id': 'root'})
            if app_div:
                print("✅ React app container found")
            else:
                print("⚠️  React app container not found")
            
            return True
        else:
            print(f"❌ Frontend returned status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error loading frontend: {e}")
        return False

def test_backend_health():
    """Test if the backend is healthy"""
    print("\n🔧 Testing Backend Health...")
    print("=" * 40)
    
    try:
        response = requests.get("http://localhost:5001/health")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is healthy!")
            print(f"📊 Status: {data['status']}")
            print(f"🤖 Gemini: {data['gemini_status']}")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error checking backend: {e}")
        return False

def test_api_endpoints():
    """Test key API endpoints"""
    print("\n🔌 Testing API Endpoints...")
    print("=" * 40)
    
    endpoints = [
        ("/health-data", "GET"),
        ("/chat", "POST"),
        ("/upload", "POST"),
        ("/sync-calendar", "POST")
    ]
    
    results = []
    
    for endpoint, method in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"http://localhost:5001{endpoint}")
            else:
                # For POST endpoints, send minimal data
                data = {"message": "test"} if endpoint == "/chat" else {"text": "test"}
                response = requests.post(f"http://localhost:5001{endpoint}", json=data)
            
            if response.status_code in [200, 401]:  # 401 is expected for auth endpoints
                print(f"✅ {method} {endpoint}: {response.status_code}")
                results.append(True)
            else:
                print(f"❌ {method} {endpoint}: {response.status_code}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ {method} {endpoint}: Error - {e}")
            results.append(False)
    
    return all(results)

def main():
    """Run all tests"""
    print("🚀 HealthSync AI - Webpage Test")
    print("=" * 50)
    
    # Run tests
    frontend_ok = test_frontend_loading()
    backend_ok = test_backend_health()
    api_ok = test_api_endpoints()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    results = [
        ("Frontend Loading", frontend_ok),
        ("Backend Health", backend_ok),
        ("API Endpoints", api_ok)
    ]
    
    for test_name, result in results:
        status = "✅ WORKING" if result else "❌ FAILED"
        print(f"{status} {test_name}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        print("\n🎉 SUCCESS: Webpage is working properly!")
        print("\n🌐 You can now access the application at:")
        print("   Frontend: http://localhost:3000")
        print("   Backend: http://localhost:5001")
        print("\n💡 Features available:")
        print("   • Upload medical documents for AI analysis")
        print("   • Chat with AI health assistant")
        print("   • View health dashboard")
        print("   • Get AI-powered insights")
    else:
        print("\n⚠️  Some components need attention")
        print("   Check the console for error messages")

if __name__ == "__main__":
    main()
