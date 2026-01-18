# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment

### Backend Configuration
Create `backend/.env` file:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration
Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5001/api
```

## Step 3: Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

## Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Step 5: Open Browser

Navigate to: `http://localhost:5173`

## ✅ You're All Set!

1. Register a new account
2. Create your first note
3. Start organizing your thoughts!

---

**Note**: Make sure MongoDB is running before starting the backend server.

