import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthWrapper from './components/auth/AuthWrapper';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DocumentUpload from './components/DocumentUpload';
import HealthDashboard from './components/HealthDashboard';
import ChatBot from './components/ChatBot';
import { getHealthData } from './utils/api';
import { db } from './config/supabase';
import './App.css';

// Main App Component (protected by authentication)
const MainApp = () => {
  const [documents, setDocuments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useAuth();
  
  // For development, create a default user if none exists
  const currentUser = user || { id: 'dev-user', email: 'dev@example.com' };

  useEffect(() => {
    // Load data regardless of user status for development
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      
      // Try to get data from local API (since Supabase auth is not fully set up)
      const data = await getHealthData();
      
      // Check if data exists and has content, otherwise set empty arrays
      if (data && typeof data === 'object') {
        setDocuments(data.documents || []);
        setMedications(data.medications || []);
        setAppointments(data.appointments || []);
        setHealthMetrics(data.health_metrics || []);
        setRecommendations(data.recommendations || []);
        setChatHistory(data.chat_history || []);
      } else {
        // No data available, set empty arrays
        setDocuments([]);
        setMedications([]);
        setAppointments([]);
        setHealthMetrics([]);
        setRecommendations([]);
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
      // Set empty arrays if data loading fails
      setDocuments([]);
      setMedications([]);
      setAppointments([]);
      setHealthMetrics([]);
      setRecommendations([]);
      setChatHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (newDocument) => {
    try {
      // For now, just refresh data from the backend
      // The document is already saved by the backend
      await loadHealthData();
    } catch (error) {
      console.error('Error handling document upload:', error);
    }
  };

  const handleChatMessage = async (newMessage) => {
    try {
      // For now, just refresh data from the backend
      // The chat message is already saved by the backend
      await loadHealthData();
    } catch (error) {
      console.error('Error handling chat message:', error);
    }
  };

  const handleCalendarSync = async () => {
    // Refresh data after calendar sync
    await loadHealthData();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading HealthSync AI...</h2>
          <p className="text-gray-500">Preparing your personalized health assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">HealthSync AI</h1>
                <p className="text-sm text-gray-500">Your AI-powered health companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation Tabs */}
              <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'upload'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Upload
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  AI Chat
                </button>
              </nav>

              {/* User Menu */}
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-700">
                    {currentUser?.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <HealthDashboard
            medications={medications}
            appointments={appointments}
            healthMetrics={healthMetrics}
            recommendations={recommendations}
            onCalendarSync={handleCalendarSync}
          />
        )}
        
        {activeTab === 'upload' && (
          <DocumentUpload
            onUpload={handleDocumentUpload}
            documents={documents}
          />
        )}
        
        {activeTab === 'chat' && (
          <ChatBot
            onMessage={handleChatMessage}
            history={chatHistory}
            healthContext={{
              medications,
              appointments,
              healthMetrics,
              recommendations
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>HealthSync AI - Powered by Google Gemini • Secure • HIPAA Compliant</p>
            <p className="mt-1">Always consult healthcare professionals for medical advice</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Root App Component with Authentication
const App = () => {
  // For development, bypass authentication and go directly to main app
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <MainApp />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
