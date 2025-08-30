#!/usr/bin/env python3
"""
HealthSync AI Backend Startup Script
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Check for required environment variables
required_vars = ['GEMINI_API_KEY']
missing_vars = []

for var in required_vars:
    if not os.getenv(var):
        missing_vars.append(var)

if missing_vars:
    print("❌ Missing required environment variables:")
    for var in missing_vars:
        print(f"   - {var}")
    print("\nPlease create a .env file with the required variables.")
    print("Example .env file:")
    print("GEMINI_API_KEY=your_gemini_api_key_here")
    sys.exit(1)

# Import and run the Flask app
try:
    from app import app
    print("🚀 HealthSync AI Backend Starting...")
    print("✅ Environment variables loaded successfully")
    print("✅ Gemini API configured")
    print("✅ Flask app initialized")
    print("\n🌐 Server will be available at: http://localhost:5001")
    print("📚 API Documentation:")
    print("   - Health Check: GET /health")
    print("   - Upload Document: POST /upload")
    print("   - Chat: POST /chat")
    print("   - Sync Calendar: POST /sync-calendar")
    print("   - Health Data: GET /health-data")
    print("\nPress Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5003)
    
except ImportError as e:
    print(f"❌ Error importing Flask app: {e}")
    print("Please make sure all dependencies are installed:")
    print("pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    sys.exit(1)
