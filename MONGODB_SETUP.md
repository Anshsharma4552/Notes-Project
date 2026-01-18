# MongoDB Setup Guide

## Issue: Connection Refused / IP Not Whitelisted

Your MongoDB Atlas cluster is blocking connections because your IP address isn't whitelisted.

## Solution 1: Whitelist Your IP in MongoDB Atlas (Recommended)

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Log in to your account

2. **Navigate to Network Access**
   - Click on your cluster
   - Go to "Network Access" in the left sidebar
   - Or go directly: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add IP Address**
   - Click "Add IP Address" button
   - Choose one of these options:
     - **Option A**: Click "Add Current IP Address" (easiest)
     - **Option B**: Click "Allow Access from Anywhere" (0.0.0.0/0) - Less secure but works from anywhere
     - **Option C**: Manually enter your IP address

4. **Save Changes**
   - Click "Confirm"
   - Wait 1-2 minutes for changes to propagate

5. **Test Connection**
   - Restart your backend server
   - Check if connection works

## Solution 2: Use Local MongoDB (Alternative)

If you prefer to use a local MongoDB instance:

1. **Install MongoDB Locally**
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. **Update .env file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/notesapp
   ```

3. **Restart Server**
   ```bash
   cd server
   npm run dev
   ```

## Solution 3: Allow All IPs (Quick Fix - Less Secure)

**⚠️ Warning: This is less secure but works for development**

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Enter: `0.0.0.0/0`
4. Add comment: "Development - Allow all"
5. Click "Confirm"

**Note**: Remove this after development or restrict to specific IPs for production.

## Verify Connection

After whitelisting, test the connection:

```bash
cd server
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(e => { console.error('❌ Error:', e.message); process.exit(1); });"
```

## Current MongoDB URI

Your current connection string is:
```
mongodb+srv://anshsharma2463_db_user:Ansh%401234@cluster0.yqimhgk.mongodb.net/notesapp
```

Make sure:
- ✅ Your IP is whitelisted
- ✅ Username and password are correct
- ✅ Cluster is running (not paused)

## Still Having Issues?

1. Check MongoDB Atlas cluster status (make sure it's not paused)
2. Verify username/password in connection string
3. Check if database name exists
4. Try connecting from MongoDB Compass to test connection

