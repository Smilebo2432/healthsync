const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
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

// Mock data for development (when backend is not available)
export const getMockHealthData = () => {
  return {
    documents: [
      {
        id: 1,
        text: "Prescription: Metformin 500mg twice daily with meals. Lisinopril 10mg once daily in the morning.",
        analysis: {
          medications: [
            {
              name: "Metformin",
              dosage: "500mg",
              frequency: "twice daily",
              duration: "ongoing",
              instructions: "Take with meals",
              refill_date: "2024-09-15"
            },
            {
              name: "Lisinopril",
              dosage: "10mg",
              frequency: "once daily",
              duration: "ongoing",
              instructions: "Take in the morning",
              refill_date: "2024-09-20"
            }
          ],
          appointments: [],
          health_metrics: [],
          recommendations: [
            "Monitor blood sugar levels regularly",
            "Check blood pressure weekly"
          ]
        },
        uploaded_at: "2024-08-29T21:15:00"
      }
    ],
    medications: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "twice daily",
        duration: "ongoing",
        instructions: "Take with meals",
        refill_date: "2024-09-15"
      },
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "once daily",
        duration: "ongoing",
        instructions: "Take in the morning",
        refill_date: "2024-09-20"
      }
    ],
    appointments: [
      {
        type: "Follow-up Visit",
        doctor: "Dr. Sarah Johnson",
        date: "2024-09-15T10:00:00",
        reason: "Diabetes management check-up"
      }
    ],
    health_metrics: [
      {
        metric: "Blood Pressure",
        value: "135/85",
        date: "2024-08-28",
        status: "slightly elevated"
      },
      {
        metric: "Blood Sugar (Fasting)",
        value: "120 mg/dL",
        date: "2024-08-28",
        status: "controlled"
      }
    ],
    recommendations: [
      "Monitor blood sugar levels regularly",
      "Check blood pressure weekly",
      "Schedule follow-up in 3 months",
      "Continue daily exercise routine",
      "Maintain low-sodium diet"
    ],
    chat_history: [
      {
        id: 1,
        user_message: "When should I take my blood pressure medication?",
        ai_response: "Based on your prescription, you should take Lisinopril 10mg once daily in the morning. It's best to take it at the same time each day to maintain consistent blood pressure control. Since you're also taking Metformin twice daily with meals, you might want to take the Lisinopril with your breakfast to establish a routine.",
        timestamp: "2024-08-29T21:10:00"
      },
      {
        id: 2,
        user_message: "What exercises are safe for my condition?",
        ai_response: "Great question! With diabetes and slightly elevated blood pressure, low-impact exercises are excellent choices. Walking for 30 minutes daily, swimming, and gentle yoga are all safe and beneficial. These activities help control blood sugar, lower blood pressure, and improve circulation. Start with 10-15 minutes and gradually increase. Remember to check your blood sugar before and after exercise, and stay hydrated!",
        timestamp: "2024-08-29T21:12:00"
      }
    ]
  };
};

// Mock API responses for development
export const mockApiCall = async (endpoint, options = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (endpoint) {
    case '/health':
      return { status: 'healthy', message: 'HealthSync AI is running!' };
    
    case '/health-data':
      return getMockHealthData();
    
    case '/upload':
      const { text } = JSON.parse(options.body);
      return {
        message: 'Document analyzed successfully',
        analysis: {
          medications: [
            {
              name: "Sample Medication",
              dosage: "100mg",
              frequency: "once daily",
              duration: "ongoing",
              instructions: "Take as directed",
              refill_date: "2024-09-30"
            }
          ],
          appointments: [],
          health_metrics: [],
          recommendations: ["Follow up with your doctor", "Monitor symptoms"]
        },
        document_id: Date.now()
      };
    
    case '/chat':
      const { message } = JSON.parse(options.body);
      return {
        response: `This is a mock response to: "${message}". In the real application, this would be generated by Google Gemini AI based on your health profile.`,
        chat_id: Date.now()
      };
    
    case '/sync-calendar':
      return {
        message: 'Calendar synced successfully',
        events_created: 7,
        calendar_result: { success: true }
      };
    
    case '/chat-history':
      return getMockHealthData().chat_history;
    
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

// Use mock API in development if backend is not available
export const useMockAPI = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL;

// Export the appropriate API function
export const api = useMockAPI ? mockApiCall : apiCall;
