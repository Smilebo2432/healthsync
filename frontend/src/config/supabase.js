import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://dswegujgkgcbszblpmcl.supabase.co"
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzd2VndWpna2djYnN6YmxwbWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTczMzQsImV4cCI6MjA2ODA5MzMzNH0.yYPHxPkDRAWFUmlogrWfkZk-zbp_s3hshNcu_JvdUYM"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })
    return { data, error }
  }
}

// Database helper functions
export const db = {
  // Get user's health data
  getHealthData: async (userId) => {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  // Update user's health data
  updateHealthData: async (userId, healthData) => {
    const { data, error } = await supabase
      .from('health_data')
      .upsert({
        user_id: userId,
        ...healthData,
        updated_at: new Date().toISOString()
      })
    return { data, error }
  },

  // Get user's documents
  getDocuments: async (userId) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Add new document
  addDocument: async (userId, document) => {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        ...document,
        created_at: new Date().toISOString()
      })
    return { data, error }
  },

  // Get chat history
  getChatHistory: async (userId) => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    return { data, error }
  },

  // Add chat message
  addChatMessage: async (userId, message) => {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        ...message,
        created_at: new Date().toISOString()
      })
    return { data, error }
  }
}
