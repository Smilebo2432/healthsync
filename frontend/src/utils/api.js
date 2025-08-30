const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.10.9.87:5001';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get authentication token from Supabase
  let token = null;
  try {
    const authData = localStorage.getItem('sb-dswegujgkgcbszblpmcl-auth-token');
    if (authData) {
      const parsed = JSON.parse(authData);
      token = parsed.access_token;
    }
  } catch (e) {
    console.log('No auth token found');
  }
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    // Always throw the error instead of using mock data
    throw error;
  }
};

// Health check
export const checkHealth = async () => {
  return apiCall('/health');
};

// Get all health data

export const getHealthData = async () => {
  return apiCall('/health-data');
};

// Upload and analyze document
export const uploadDocument = async (documentText) => {
  return apiCall('/upload', {
    method: 'POST',
    body: JSON.stringify({ text: documentText }),
  });
};

// Send chat message
export const sendChatMessage = async (message) => {
  return apiCall('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
};

// Sync to calendar
export const syncCalendar = async () => {
  return apiCall('/sync-calendar', {
    method: 'POST',
  });
};

// Get chat history
export const getChatHistory = async () => {
  return apiCall('/chat-history');
};

// Get health insights
export const getHealthInsights = async () => {
  return apiCall('/health-insights', {
    method: 'POST',
  });
};

// No mock data - always use real Gemini AI analysis

// No mock API - always use real Gemini AI analysis

// Export the API function
export const api = apiCall;
