# 📝 Notes App - Production-Ready MERN Stack Application

A modern, full-featured Notes Making Web Application built with React, Node.js, Express, and MongoDB. Features authentication, CRUD operations, search, filtering, dark mode, and beautiful animations.

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes (frontend + backend)
- Secure logout functionality

### 📝 Notes Management (Full CRUD)
- ✅ Create new notes
- ✅ Edit existing notes
- ✅ Delete notes (with confirmation)
- ✅ View all notes
- ✅ View single note detail page
- ✅ Auto-save capability
- ✅ Timestamps (created & updated)

### 🎯 Organization Features
- 📌 Pin/Unpin notes
- ⭐ Mark favorite notes
- 🏷️ Tags for notes
- 🔍 Search notes by title/content
- 🎨 Filter by tags, favorites, pinned
- 📊 Sort by: Newest, Oldest, Alphabetical, Recently Updated

### 🎨 UI/UX Features
- 🌓 Dark mode & Light mode toggle
- 📱 Fully responsive (Mobile + Tablet + Desktop)
- ✨ Smooth animations with Framer Motion
- 🎴 Beautiful note cards
- ➕ Floating "Add Note" button
- 🔔 Toast notifications
- 💀 Skeleton loaders
- 🎨 Color-coded notes
- 📝 Empty state illustrations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Notes-project/
├── backend/                 # Backend
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── notFound.js     # 404 handler
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Note.js         # Note schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   ├── app.js              # Express app config
│   └── server.js           # Server entry point
│
└── frontend/                 # Frontend
    ├── src/
    │   ├── components/     # Reusable components
    │   │   ├── Header.jsx
    │   │   ├── NoteCard.jsx
    │   │   ├── Modal.jsx
    │   │   ├── NoteForm.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Skeleton.jsx
    │   ├── context/        # Context providers
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── hooks/          # Custom hooks
    │   │   └── useNotes.js
    │   ├── pages/          # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── NoteDetail.jsx
    │   ├── services/       # API services
    │   │   └── api.js
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Notes-project
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   **Backend** (`backend/.env`):
   ```env
   PORT=5001
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Notes
- `GET /api/notes` - Get all notes (Protected)
  - Query params: `sort`, `search`, `tag`, `isFavorite`, `isPinned`
- `GET /api/notes/:id` - Get single note (Protected)
- `POST /api/notes` - Create note (Protected)
- `PUT /api/notes/:id` - Update note (Protected)
- `DELETE /api/notes/:id` - Delete note (Protected)
- `PATCH /api/notes/:id/pin` - Toggle pin (Protected)
- `PATCH /api/notes/:id/favorite` - Toggle favorite (Protected)

## 🧪 Testing the API

You can test the API using Postman or any REST client:

1. **Register a user:**
   ```json
   POST http://localhost:5001/api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login:**
   ```json
   POST http://localhost:5001/api/auth/login
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Create a note (use token from login):**
   ```json
   POST http://localhost:5001/api/notes
   Authorization: Bearer <your-token>
   {
     "title": "My First Note",
     "content": "This is the content of my note",
     "tags": ["important", "work"],
     "color": "#ffffff"
   }
   ```

## 🎯 Key Features Explained

### Authentication Flow
1. User registers/logs in
2. Server returns JWT token
3. Token stored in localStorage
4. Token sent with every API request
5. Backend validates token on protected routes

### Notes CRUD
- **Create**: Modal form with title, content, tags, color
- **Read**: Grid/list view with search and filters
- **Update**: Edit modal with pre-filled data
- **Delete**: Confirmation dialog before deletion

### Search & Filter
- Real-time search in title and content
- Filter by tags, favorites, pinned status
- Sort by date, alphabetical order
- Combined filters work together

### Dark Mode
- Toggle button in header
- Preference saved in localStorage
- Respects system preference on first visit
- Smooth transitions

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token expiration (7 days)
- Input validation on both frontend and backend
- CORS configured for allowed origins
- Protected routes require authentication
- Error handling prevents information leakage

## 📦 Production Build

### Build Frontend
```bash
cd frontend
npm run build
```

### Start Production Server
```bash
cd backend
NODE_ENV=production npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using MERN stack

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for beautiful styling
- Framer Motion for smooth animations
- MongoDB for the database solution

---

**Happy Note Taking! 📝✨**

# Notes-Project
