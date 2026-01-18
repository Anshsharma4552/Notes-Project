import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CursorProvider } from './context/CursorContext';
import CustomCursor from './components/CustomCursor';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';

function App() {
  return (
    <AuthProvider>
      <CursorProvider>
        <Router>
          <CustomCursor />
          <div className="min-h-screen bg-background text-primary transition-colors duration-200">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Header />
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <ProtectedRoute>
                    <Header />
                    <NoteDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1A1A1A',
                  color: '#fff',
                  border: '1px solid #2A2A2A',
                  borderRadius: '12px',
                  padding: '16px',
                },
                success: {
                  style: {
                    border: '1px solid #10b981',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#10b981',
                  },
                },
                error: {
                  style: {
                    border: '1px solid #ef4444',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </Router>
      </CursorProvider>
    </AuthProvider>
  );
}

export default App;

