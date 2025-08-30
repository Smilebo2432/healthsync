# HealthSync AI - AI-Powered Health Assistant

An intelligent health management application that uses Google Gemini AI to read medical documents, manage medications, and automatically sync everything to your Google Calendar.

## 🚀 Features

- **AI Document Analysis**: Upload prescriptions, lab results, and doctor notes for instant AI-powered extraction
- **Smart Medication Management**: Track dosages, frequencies, and refill dates with intelligent reminders
- **Calendar Integration**: Automatically sync medications and appointments to Google Calendar
- **Personalized Health Chat**: AI-powered health assistant that knows your medical history
- **Health Dashboard**: Comprehensive view of your medications, appointments, and health metrics

## 🏗️ Architecture

### Backend (Python Flask)
- **Flask API**: RESTful endpoints for document processing and health management
- **Google Gemini Integration**: AI-powered document analysis and health conversations
- **Google Calendar API**: Automatic calendar synchronization
- **JSON Storage**: Simple file-based data storage (no database setup required)

### Frontend (React)
- **Modern UI**: Clean, professional healthcare interface built with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live data synchronization across all components

## 🛠️ Tech Stack

- **Backend**: Python Flask, Google Gemini API, Google Calendar API
- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **AI**: Google Gemini Pro (free tier)
- **Storage**: JSON files (simple, no database)
- **Deployment**: Vercel (frontend) + Railway (backend)

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key
- Google Calendar API credentials (optional for MVP)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd healthsync-ai
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY="your-gemini-api-key-here"

# Run the Flask server
python app.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CALENDAR_CREDENTIALS=path_to_credentials.json
FLASK_ENV=development
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📱 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/upload` | POST | Upload and analyze medical documents |
| `/chat` | POST | Chat with AI health assistant |
| `/sync-calendar` | POST | Sync health data to Google Calendar |
| `/health-data` | GET | Get user's health summary |
| `/chat-history` | GET | Get chat conversation history |

## 🎯 Demo Flow

### 1. Document Upload (30 seconds)
- Drag & drop prescription image
- Watch AI extract 3+ medications automatically
- View structured data extraction

### 2. Smart Calendar Sync (30 seconds)
- Click "Sync to Calendar"
- See 15+ events auto-created
- Highlight medication reminders

### 3. AI Health Chat (60 seconds)
- Ask: "When should I take my blood pressure medication?"
- AI responds with personalized timing
- Ask: "What exercises are safe for my condition?"
- AI gives specific recommendations based on profile

## 🔧 Development

### Backend Development
```bash
cd backend
python app.py
```

### Frontend Development
```bash
cd frontend
npm start
```

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Backend (Railway)
1. Push to GitHub
2. Connect Railway to repository
3. Add environment variables
4. Deploy automatically

### Frontend (Vercel)
1. Push to GitHub
2. Connect Vercel to repository
3. Deploy automatically
4. Update API URLs

## 🎨 Customization

### Adding New Health Metrics
1. Update the Gemini prompts in `gemini_service.py`
2. Modify the data structure in `data.json`
3. Update the frontend components

### Custom AI Prompts
The application uses specialized prompts for different health tasks:
- **Medical Document Analysis**: Extracts medications, appointments, and health metrics
- **Health Chat**: Provides personalized health advice
- **Smart Scheduling**: Creates optimal calendar events

## 🚨 Important Notes

- **Medical Disclaimer**: This application is for informational purposes only and should not replace professional medical advice
- **Data Privacy**: Health data is stored locally and should be handled with appropriate security measures
- **API Limits**: Google Gemini has rate limits on the free tier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the demo flow

## 🎉 Success Metrics

- ✅ Upload prescription → Extract 3+ medications automatically
- ✅ Generate 10+ smart calendar events in seconds
- ✅ AI chat answers 3 health questions using user's data
- ✅ Professional healthcare UI (clean, trustworthy design)
- ✅ Complete user journey under 90 seconds

---

**Built with ❤️ using Google Gemini AI**
