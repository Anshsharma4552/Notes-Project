# Troubleshooting Guide

## App Shows Blank Screen

### Issue 1: Dependencies Not Installed
**Solution:**
```bash
cd frontend
npm install

cd ../backend
npm install
```

### Issue 2: Backend Not Running
**Solution:**
1. Make sure MongoDB is running
2. Start the backend server:
```bash
cd backend
npm run dev
```
You should see: `🚀 Server running on port 5001`

### Issue 3: Frontend Not Running
**Solution:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

### Issue 4: Environment Variables Missing
**Solution:**
1. Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key-min-32-chars
```

2. Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Issue 5: CORS Error
**Solution:**
- Make sure backend is running on port 5001
- Make sure frontend is running on port 5173
- Check `backend/app.js` CORS configuration

### Issue 6: Browser Console Errors
**Check:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

### Issue 7: Stuck on Loading Screen
**Solution:**
- Clear browser localStorage:
```javascript
localStorage.clear()
```
- Refresh the page
- Make sure backend is running

## Common Errors

### "Network error"
- Backend server is not running
- Wrong API URL in `frontend/.env`
- CORS configuration issue

### "Cannot find module"
- Run `npm install` in both frontend and backend folders
- Delete `node_modules` and `package-lock.json`, then reinstall

### "MongoDB connection error"
- MongoDB is not running
- Wrong MongoDB URI in `backend/.env`
- Check MongoDB connection string

### "Token expired" or "Invalid token"
- Clear localStorage and login again
- Check JWT_SECRET in `backend/.env`

## Quick Fix Checklist

1. ✅ Install dependencies: `npm install` in both folders
2. ✅ Create `.env` files with correct values
3. ✅ Start MongoDB
4. ✅ Start backend: `cd backend && npm run dev`
5. ✅ Start frontend: `cd frontend && npm run dev`
6. ✅ Open browser: `http://localhost:5173`
7. ✅ Check browser console for errors
8. ✅ Clear localStorage if stuck

## Still Not Working?

1. Check if ports are available:
   - Backend: `lsof -i :5001`
   - Frontend: `lsof -i :5173`

2. Verify all files exist:
   ```bash
   ls -la frontend/src/
   ls -la backend/
   ```

3. Check for syntax errors:
   ```bash
   cd frontend && npm run build
   cd ../backend && node server.js
   ```

