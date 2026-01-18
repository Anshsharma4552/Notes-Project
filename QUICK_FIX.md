# 🚨 Quick Fix: MongoDB Connection Error

## The Problem
```
Operation `users.findOne()` buffering timed out after 10000ms
```

This means MongoDB Atlas is blocking your connection because your IP address isn't whitelisted.

## ⚡ Quick Solution (2 minutes)

### Step 1: Whitelist Your IP in MongoDB Atlas

1. **Open MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** to your account
3. **Click "Network Access"** (left sidebar, under Security)
4. **Click "Add IP Address"** button
5. **Click "Add Current IP Address"** (or click "Allow Access from Anywhere" for `0.0.0.0/0`)
6. **Click "Confirm"**
7. **Wait 1-2 minutes** for changes to apply

### Step 2: Restart Your Server

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
cd backend
npm run dev
```

### Step 3: Test Login

Try logging in again in your browser. It should work now!

---

## 🔍 Verify It's Fixed

Check if MongoDB connects:

```bash
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(e => { console.error('❌ Error:', e.message); process.exit(1); });"
```

If you see `✅ Connected!`, you're good to go!

---

## 🆘 Still Not Working?

1. **Check if cluster is running** (not paused) in Atlas dashboard
2. **Verify username/password** in connection string
3. **Try "Allow Access from Anywhere"** (`0.0.0.0/0`) temporarily for testing
4. **Wait 2-3 minutes** after whitelisting (can take time to propagate)

---

## 📝 Your MongoDB Connection String

Currently using:
```
mongodb+srv://anshsharma2463_db_user:Ansh%401234@cluster0.yqimhgk.mongodb.net/notesapp
```

Make sure this cluster exists and is running in your Atlas account.

