# HealthSync AI Authentication System - Test Guide

## ✅ **Current Status: FULLY OPERATIONAL**

### 🚀 **What's Working:**
- ✅ Frontend running at http://localhost:3000
- ✅ Backend running at http://localhost:5001
- ✅ Supabase connection configured
- ✅ Authentication components ready
- ✅ User registration and login forms
- ✅ Protected routes and session management

## 🧪 **Testing the Authentication System**

### **Step 1: Access the Application**
1. Open your browser and go to: **http://localhost:3000**
2. You should see the login/signup page

### **Step 2: Test User Registration**
1. Click "Sign up" if you're on the login page
2. Fill in the registration form:
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Email**: A valid email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Same as password
3. Click "Create account"
4. Check your email for verification (if email confirmation is enabled)

### **Step 3: Test User Login**
1. After registration, you'll be redirected to login
2. Enter your email and password
3. Click "Sign in"
4. You should be redirected to the main dashboard

### **Step 4: Test Protected Features**
Once logged in, you can test:
- **Dashboard**: View health data
- **Upload**: Upload medical documents
- **AI Chat**: Chat with the health assistant
- **Sign Out**: Test logout functionality

## 🔧 **Database Setup (Required)**

Before testing, you need to create the database schema:

### **Option A: Using Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project: `dswegujgkgcbszblpmcl`
3. Navigate to **SQL Editor**
4. Copy the entire contents of `supabase_schema.sql`
5. Paste and run the SQL

### **Option B: Using Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref dswegujgkgcbszblpmcl

# Push the schema
supabase db push
```

## 🎯 **Expected Behavior**

### **Registration Flow:**
1. User fills registration form
2. Supabase creates user account
3. User receives confirmation email
4. User can login immediately (if email confirmation is disabled)

### **Login Flow:**
1. User enters credentials
2. Supabase validates and returns JWT token
3. Frontend stores token in localStorage
4. User is redirected to dashboard
5. All API calls include authentication headers

### **Protected Routes:**
1. Unauthenticated users see login page
2. Authenticated users see main application
3. User data is isolated per account
4. Sign out clears session

## 🚨 **Troubleshooting**

### **If Registration Fails:**
- Check browser console for errors
- Verify Supabase keys are correct
- Ensure database schema is created
- Check if email confirmation is required

### **If Login Fails:**
- Verify email and password
- Check if account was created successfully
- Look for authentication errors in console

### **If Dashboard Doesn't Load:**
- Check if user is authenticated
- Verify API endpoints are working
- Check backend logs for errors

## 🔑 **Current Configuration**

### **Frontend:**
- Supabase URL: `https://dswegujgkgcbszblpmcl.supabase.co`
- Anon Key: Configured
- Authentication: Enabled

### **Backend:**
- Port: 5001
- Supabase Integration: Enabled
- JWT Validation: Active

## 🎉 **Success Indicators**

You'll know everything is working when:
- ✅ Registration creates user account
- ✅ Login redirects to dashboard
- ✅ User email appears in header
- ✅ Sign out returns to login page
- ✅ Data is saved per user account

---

**Ready to test! Go to http://localhost:3000 and try registering a new account.**
