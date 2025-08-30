# HealthSync AI - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API key (free)

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a free account
3. Generate an API key
4. Copy the key

### 2. Clone & Setup
```bash
git clone <your-repo>
cd healthsync-ai
./deploy.sh
```

### 3. Configure Environment
```bash
cd backend
cp env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 4. Run the Application
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python run.py

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 5. Open Your Browser
Navigate to `http://localhost:3000`

## 🎯 Test the Demo

### Upload a Document
1. Go to Upload tab
2. Paste this prescription:
```
Prescription: Metformin 500mg twice daily with meals. 
Lisinopril 10mg once daily in the morning.
```
3. Click "Analyze with AI"
4. Watch AI extract 3 medications automatically

### Sync to Calendar
1. Go to Dashboard tab
2. Click "Sync to Calendar"
3. See 15+ events created instantly

### Chat with AI
1. Go to AI Chat tab
2. Ask: "When should I take my blood pressure medication?"
3. Get personalized response based on your data

## 🔧 Troubleshooting

### Backend Issues
- **Port 5000 busy:** Change port in `app.py`
- **Missing dependencies:** Run `pip install -r requirements.txt`
- **API key error:** Check `.env` file

### Frontend Issues
- **Port 3000 busy:** React will suggest alternative port
- **Build errors:** Delete `node_modules` and run `npm install`

### Mock Mode
If backend isn't working, the frontend will use mock data automatically.

## 📱 What You'll See

- **Professional healthcare UI** with Tailwind CSS
- **AI-powered document analysis** using Gemini
- **Smart calendar integration** with Google Calendar
- **Personalized health chat** that knows your profile
- **Responsive design** that works on all devices

## 🎉 Success!

You now have a working AI-powered health assistant that:
- Reads medical documents with AI
- Manages medications intelligently  
- Syncs to Google Calendar automatically
- Provides personalized health advice

---

**Next Steps:** Customize the AI prompts, add more health metrics, or deploy to production!
