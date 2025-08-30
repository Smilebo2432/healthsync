import React, { useState } from 'react';
import { Calendar, Pill, Activity, Clock, RefreshCw, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { syncCalendar } from '../utils/api';
import HealthInsights from './HealthInsights';

const HealthDashboard = ({ medications, appointments, healthMetrics, recommendations, onCalendarSync }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleCalendarSync = async () => {
    try {
      setSyncing(true);
      setSyncStatus(null);

      const result = await syncCalendar();
      
      
      if (result.success || result.events_created > 0) {
        setSyncStatus({
          type: 'success',
          message: `Successfully created ${result.events_created || 0} calendar events!`
        });
        
        if (onCalendarSync) {
          onCalendarSync(result);
        }
      } else {
        setSyncStatus({
          type: 'error',
          message: `Error syncing calendar: ${result.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      setSyncStatus({
        type: 'error',
        message: `Error syncing calendar: ${error.message}`
      });
    } finally {
      setSyncing(false);
    }
  };

  const getMetricStatus = (metric) => {
    const status = metric.status?.toLowerCase();
    if (status?.includes('normal') || status?.includes('controlled')) {
      return { color: 'text-green-600', icon: <TrendingUp className="w-4 h-4" />, bg: 'bg-green-100' };
    } else if (status?.includes('high') || status?.includes('elevated')) {
      return { color: 'text-yellow-600', icon: <TrendingDown className="w-4 h-4" />, bg: 'bg-yellow-100' };
    } else if (status?.includes('low')) {
      return { color: 'text-blue-600', icon: <TrendingDown className="w-4 h-4" />, bg: 'bg-blue-100' };
    }
    return { color: 'text-gray-600', icon: <Activity className="w-4 h-4" />, bg: 'bg-gray-100' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Health Dashboard</h2>
        <p className="text-lg text-gray-600">
          AI-powered insights and smart scheduling for your health journey
        </p>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4 inline mr-1" />
              Add New
            </button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={handleCalendarSync}
              disabled={syncing}
              className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 mr-3 ${syncing ? 'animate-spin' : ''}`} />
              <span className="font-medium">
                {syncing ? 'Syncing...' : 'Sync to Calendar'}
              </span>
            </button>
            
            <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
              <Plus className="w-5 h-5 mr-3" />
              <span className="font-medium">Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {syncStatus && (
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center p-4 rounded-md ${
            syncStatus.type === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className={`w-5 h-5 mr-3 ${
              syncStatus.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}>
              {syncStatus.type === 'success' ? '✓' : '✗'}
            </div>
            <p className={`text-sm ${
              syncStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {syncStatus.message}
            </p>
          </div>
        </div>
      )}

      {/* Medications */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Pill className="w-6 h-6 mr-2 text-blue-600" />
              Current Medications
            </h3>
            <span className="text-sm text-gray-500">{medications.length} active</span>
          </div>
          
          {medications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {medications.map((med, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{med.name}</h4>
                    <span className="text-sm text-blue-600 font-medium">{med.dosage}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {med.frequency}
                    </div>
                    {med.instructions && (
                      <div className="text-gray-500 italic">"{med.instructions}"</div>
                    )}
                    {med.refill_date && (
                      <div className="text-orange-600 font-medium">
                        Refill: {new Date(med.refill_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No medications added yet</p>
              <p className="text-sm">Upload a prescription to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointments */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              Upcoming Appointments
            </h3>
            <span className="text-sm text-gray-500">{appointments.length} scheduled</span>
          </div>
          
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{apt.type}</h4>
                      <p className="text-sm text-gray-600">Dr. {apt.doctor}</p>
                      <p className="text-sm text-gray-500">{apt.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {new Date(apt.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming appointments</p>
              <p className="text-sm">Your calendar is clear for now</p>
            </div>
          )}
        </div>
      </div>

      {/* Health Metrics */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-purple-600" />
              Health Metrics
            </h3>
            <span className="text-sm text-gray-500">{healthMetrics.length} tracked</span>
          </div>
          
          {healthMetrics.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {healthMetrics.map((metric, index) => {
                const status = getMetricStatus(metric);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                      <div className={`flex items-center ${status.color}`}>
                        {status.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{new Date(metric.date).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No health metrics tracked yet</p>
              <p className="text-sm">Upload lab results to see your data</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Health Insights */}
      <div className="max-w-4xl mx-auto">
        <HealthInsights 
          healthData={{
            medications,
            appointments,
            health_metrics: healthMetrics,
            recommendations
          }}
        />
      </div>

      {/* Recommendations */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
            AI Health Recommendations
          </h3>
          
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recommendations yet</p>
              <p className="text-sm">Upload documents to get personalized advice</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Sync Info */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Calendar Integration</h3>
            <p className="text-gray-600 mb-4">
              Sync your medications, appointments, and health reminders directly to Google Calendar
            </p>
            <button
              onClick={handleCalendarSync}
              disabled={syncing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;
