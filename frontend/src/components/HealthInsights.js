import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { getHealthInsights } from '../utils/api';

const HealthInsights = ({ healthData }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getHealthInsights();
      setInsights(result);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
      console.error('Error generating insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (healthData && (healthData.medications?.length > 0 || healthData.health_metrics?.length > 0)) {
      generateInsights();
    }
  }, [healthData]);

  if (!healthData || (healthData.medications?.length === 0 && healthData.health_metrics?.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI Health Insights</h3>
          <p className="text-gray-500">Upload health documents to get personalized AI insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-6 h-6 mr-2 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">AI Health Insights</h3>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
          <p className="text-gray-500">AI is analyzing your health data...</p>
        </div>
      )}

      {insights && !loading && (
        <div className="space-y-6">
          {/* Insights */}
          {insights.insights && insights.insights.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Key Insights
              </h4>
              <div className="space-y-2">
                {insights.insights.map((insight, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trends */}
          {insights.trends && insights.trends.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Health Trends
              </h4>
              <div className="space-y-2">
                {insights.trends.map((trend, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">{trend}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {insights.alerts && insights.alerts.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Important Alerts
              </h4>
              <div className="space-y-2">
                {insights.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-gray-700">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!insights && !loading && !error && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Click "Refresh" to generate AI insights</p>
        </div>
      )}
    </div>
  );
};

export default HealthInsights;
