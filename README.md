# HealthSync AI - Your AI-Powered Health Companion

HealthSync AI is an intelligent health assistant that helps you manage medications, appointments, and health data using Google Gemini AI and Supabase authentication.

## Features

- 🔐 **Secure Authentication**: User registration and login with Supabase
- 🤖 **AI-Powered Document Analysis**: Upload prescriptions, lab results, and medical documents
- 💊 **Medication Management**: Track dosages, frequencies, and refill dates
- 📅 **Smart Calendar Integration**: Sync health events to Google Calendar
- 💬 **Health Chat Assistant**: Get personalized health advice and reminders
- 📊 **Health Dashboard**: Visualize your health metrics and recommendations
- 🗄️ **Cloud Database**: Secure data storage with Supabase

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API Key (free tier available)
- Supabase Account (free tier available)

### 1. Get Your API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for the next step

#### Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and API keys from Settings → API
3. Copy the following keys:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon Key** (public key, starts with `eyJ...`)
   - **Service Key** (private key, for backend)

### 2. Setup Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd healthsync

# Backend environment
cp backend/env_example.txt backend/.env
# Edit backend/.env and add your keys:
# GEMINI_API_KEY=your_actual_gemini_key
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_KEY=your_supabase_service_key

# Frontend environment
cp frontend/env_example.txt frontend/.env
# Edit frontend/.env and add your keys:
# REACT_APP_SUPABASE_URL=your_supabase_url
# REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase_schema.sql`
4. Run the SQL to create the database schema

### 4. Run the Application

#### Option A: Use the startup script (Recommended)
```bash
./start.sh
```

#### Option B: Manual setup

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## API Keys Required

### Required for Full Functionality:
- **Google Gemini API Key**: For AI-powered document analysis and health chat
  - Get it from: https://makersuite.google.com/app/apikey
  - Free tier: 15 requests/minute, 1500 requests/day

- **Supabase Keys**: For authentication and data storage
  - **Project URL**: Your Supabase project URL
  - **Anon Key**: Public key for frontend
  - **Service Key**: Private key for backend
  - Get them from: https://supabase.com

### Optional (for production):
- **Google Calendar API**: For calendar integration
  - Only needed if you want to sync events to Google Calendar
  - Requires OAuth setup

## How It Works

### Authentication Flow
1. Users register/login with email and password
2. Supabase handles authentication and JWT tokens
3. All API requests include authentication headers
4. Row Level Security ensures users only see their own data

### Document Upload
1. Upload medical documents (prescriptions, lab results, doctor notes)
2. AI extracts structured health information
3. Data is saved to Supabase database
4. Automatically populates your health dashboard

### Health Chat
1. Ask questions about your medications, appointments, or health
2. AI provides personalized responses based on your health profile
3. Chat history is stored securely in Supabase
4. Get reminders and recommendations

### Calendar Sync
1. Click "Sync to Calendar" in the dashboard
2. AI creates optimal medication reminders and appointment events
3. Events are added to your Google Calendar (mock mode in development)

## Development

### Project Structure
```
healthsync/
├── backend/           # Flask API server
│   ├── app.py        # Main Flask application with auth
│   ├── gemini_service.py  # Google Gemini AI integration
│   ├── calendar_service.py # Google Calendar integration
│   └── data.json     # Local data storage (fallback)
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/     # Authentication components
│   │   │   └── ...       # Other components
│   │   ├── contexts/     # React contexts
│   │   ├── config/       # Supabase configuration
│   │   └── utils/        # API utilities
│   └── package.json
├── supabase_schema.sql  # Database schema
└── start.sh         # Startup script
```

### API Endpoints

- `GET /health` - Health check
- `GET /health-data` - Get all health data (authenticated)
- `POST /upload` - Upload and analyze document text (authenticated)
- `POST /import-file` - Upload and analyze file (authenticated)
- `POST /chat` - Send chat message (authenticated)
- `POST /sync-calendar` - Sync to Google Calendar (authenticated)
- `GET /chat-history` - Get chat history (authenticated)

### Authentication Flow

1. **Frontend**: User enters credentials
2. **Supabase**: Validates credentials and returns JWT token
3. **Frontend**: Stores token and includes in API requests
4. **Backend**: Validates JWT token with Supabase
5. **Database**: Row Level Security ensures data isolation

## Troubleshooting

### Backend Issues
- **Port already in use**: Change port in `backend/app.py`
- **API key error**: Check your `.env` file
- **Import errors**: Make sure virtual environment is activated
- **Supabase connection error**: Verify your Supabase keys

### Frontend Issues
- **Cannot connect to backend**: Check if backend is running on port 5001
- **Build errors**: Run `npm install` in frontend directory
- **Authentication errors**: Check Supabase configuration

### Supabase Issues
- **Database schema not created**: Run the SQL from `supabase_schema.sql`
- **RLS policies not working**: Check if Row Level Security is enabled
- **User creation failing**: Verify the trigger function exists

### Mock Mode
If the backend is not available, the frontend will automatically use mock data for development.

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Supabase provides Row Level Security for data isolation
- JWT tokens are automatically handled by Supabase
- The current implementation uses mock calendar service for development
- For production, implement proper OAuth for Google Calendar

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Always consult healthcare professionals for medical advice.
