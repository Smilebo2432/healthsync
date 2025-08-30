# Quick Database Setup for HealthSync AI

## 🚀 **Your Supabase Project is Ready!**

**Project URL**: `https://dswegujgkgcbszblpmcl.supabase.co`

## 📋 **Step 1: Create Database Schema**

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `dswegujgkgcbszblpmcl`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the Schema**
   - Open the file `supabase_schema.sql` in this project
   - Copy ALL the content
   - Paste it into the SQL Editor

4. **Run the SQL**
   - Click the "Run" button (or press Ctrl+Enter)
   - You should see "Success" message

## ✅ **What the Schema Creates:**

- **Users table**: User profiles
- **Health data table**: Medications, appointments, metrics
- **Documents table**: Uploaded medical documents
- **Chat history table**: AI conversation history
- **Row Level Security**: Users can only see their own data
- **Triggers**: Automatic user creation and data updates

## 🧪 **Test the Setup**

After running the schema:

1. **Go to http://localhost:3000**
2. **Click "Sign up"**
3. **Create a test account**
4. **Try logging in**

## 🚨 **If You Get Errors:**

### **"relation does not exist"**
- Make sure you ran the entire SQL schema
- Check that all tables were created

### **"permission denied"**
- This is normal - Row Level Security is working
- Users can only access their own data

### **"authentication failed"**
- Check that your Supabase keys are correct
- Verify the project URL matches

## 🎉 **Success!**

Once the schema is created and you can register/login, your authentication system is fully operational!

---

**Need help? Check the browser console for any error messages.**
