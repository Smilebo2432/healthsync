import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../utils/api';

// Helper to render *italic*, **bold**, ***bold and italic***
const renderFormattedMessage = (text) => {
  let html = text
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return { __html: html };
};

const ChatBot = ({ onMessage, history, healthContext }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [suggestions] = useState([
    "When should I take my blood pressure medication?",
    "What exercises are safe for my condition?",
    "How often should I check my blood sugar?",
    "What foods should I avoid with my medications?",
    "When is my next refill due?",
    "What symptoms should I watch for?"
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with chat history
    if (history && history.length > 0) {
      setMessages(history.map(msg => ({
        id: msg.id,
        type: 'user',
        content: msg.user_message,
        timestamp: msg.timestamp
      })).concat(history.map(msg => ({
        id: `ai-${msg.id}`,
        type: 'ai',
        content: msg.ai_response,
        timestamp: msg.timestamp
      }))));
    }
  }, [history]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim() || sending) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    try {
      const response = await sendChatMessage(message);
      
      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      if (onMessage) {
        onMessage({ userMessage, aiMessage });
      }
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: 'Sorry, I\'m having trouble responding right now. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getHealthSummary = () => {
    const { medications, appointments, healthMetrics } = healthContext;
    const summary = [];
    
    if (medications.length > 0) {
      summary.push(`${medications.length} active medication${medications.length > 1 ? 's' : ''}`);
    }
    
    if (appointments.length > 0) {
      summary.push(`${appointments.length} upcoming appointment${appointments.length > 1 ? 's' : ''}`);
    }
    
    if (healthMetrics.length > 0) {
      summary.push(`${healthMetrics.length} health metric${healthMetrics.length > 1 ? 's' : ''} tracked`);
    }
    
    return summary.join(', ') || 'No health data available yet';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Health Assistant</h2>
        <p className="text-lg text-gray-600">
          Chat with your personalized AI health companion
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Powered by Google Gemini AI
        </div>
      </div>

      {/* Health Context Summary */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-900">Your Health Profile</h3>
              <p className="text-sm text-green-700">{getHealthSummary()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Start a conversation with your AI health assistant</p>
                <p className="text-sm">Ask about medications, appointments, or general health advice</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start">
                      {message.type === 'ai' && (
                        <Bot className="w-4 h-4 mr-2 mt-1 text-blue-600 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="w-4 h-4 mr-2 mt-1 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm" dangerouslySetInnerHTML={renderFormattedMessage(message.content)} />
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {sending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center">
                    <Bot className="w-4 h-4 mr-2 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 0 && (
            <div className="border-t border-gray-200 p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Questions:</h4>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your health, medications, or appointments..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sending}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || sending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What I Can Help You With</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Medication Management</h4>
            <p className="text-sm text-gray-600">Dosage timing, interactions, refill reminders</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Appointment Scheduling</h4>
            <p className="text-sm text-gray-600">Follow-up reminders, preparation tips</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Health Insights</h4>
            <p className="text-sm text-gray-600">Trends, recommendations, lifestyle advice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import icons for the features section
const Pill = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Activity = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default ChatBot;
