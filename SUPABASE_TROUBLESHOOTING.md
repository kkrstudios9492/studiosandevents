# Supabase Database Troubleshooting Guide

## 🔍 Step-by-Step Troubleshooting

### Step 1: Test Database Connection
1. **Open `test-supabase.html`** in your browser
2. **Click "Test Supabase Connection"**
3. **Check the result** - this will tell us if the connection works

### Step 2: Check if Tables Exist
1. **Click "Check if Tables Exist"** 
2. **Look at the results** for each table:
   - ✅ `exists: true` = Table exists and accessible
   - ❌ `exists: false` = Table doesn't exist or has issues

### Step 3: Common Issues and Solutions

#### Issue 1: "relation does not exist" or "table does not exist"
**Solution**: Tables haven't been created yet
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the entire content from `supabase-setup.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the script
6. Verify tables are created in **Table Editor**

#### Issue 2: "permission denied" or "insufficient privileges"
**Solution**: Row Level Security (RLS) is blocking access
1. Go to **Authentication** > **Policies** in Supabase
2. Check if RLS policies are created
3. If not, run the `supabase-setup.sql` script again

#### Issue 3: "invalid API key" or "unauthorized"
**Solution**: Check your Supabase credentials
1. Go to **Project Settings** > **API**
2. Verify your **Project URL** and **anon key**
3. Make sure they match the ones in the code

#### Issue 4: "network error" or "failed to fetch"
**Solution**: Check internet connection and CORS
1. Make sure you have internet connection
2. Try opening the test page in a different browser
3. Check browser console for CORS errors

### Step 4: Verify Tables in Supabase Dashboard

1. **Go to your Supabase project dashboard**
2. **Click on "Table Editor"** in the left sidebar
3. **Look for these tables**:
   - `users`
   - `orders` 
   - `products`
   - `user_carts`
   - `categories`
   - `user_profiles`

### Step 5: Test User Creation

1. **Click "Test Create User in Database"** in the test page
2. **Check the result**:
   - ✅ Success = User created in database
   - ❌ Error = Check the error message for details

3. **Go to Supabase Table Editor**
4. **Click on the `users` table**
5. **You should see the new user** in the table

### Step 6: Test User Retrieval

1. **Click "Test Get User from Database"**
2. **Check the result**:
   - ✅ Success = User found in database
   - ❌ Error = User not found or database issue

## 🚨 Common Error Messages

| Error Message | Cause | Solution |
|----------------|-------|----------|
| "relation does not exist" | Tables not created | Run `supabase-setup.sql` |
| "permission denied" | RLS blocking access | Check RLS policies |
| "invalid API key" | Wrong credentials | Check Supabase settings |
| "network error" | Connection issue | Check internet/CORS |
| "PGRST116" | No rows found | Normal for empty tables |

## 📋 Quick Checklist

- [ ] Supabase project created
- [ ] Database tables created (run SQL script)
- [ ] RLS policies set up
- [ ] API keys correct
- [ ] Internet connection working
- [ ] Browser console shows no errors

## 🔧 Manual Table Creation

If the SQL script doesn't work, you can create tables manually:

1. **Go to Table Editor** in Supabase
2. **Click "Create a new table"**
3. **Create the `users` table** with these columns:
   - `id` (UUID, Primary Key)
   - `name` (Text)
   - `email` (Text)
   - `mobile` (Text)
   - `password` (Text)
   - `role` (Text)
   - `created_at` (Timestamp)

## 📞 Need Help?

If you're still having issues:
1. **Share the exact error message** from the test page
2. **Check your Supabase dashboard** for any error notifications
3. **Verify your project is active** (not paused)
4. **Make sure you have the correct project URL and API key**

The test page will give you detailed information about what's working and what's not!



