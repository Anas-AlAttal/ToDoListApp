import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import AdminPanel from './components/AdminPanel';
import { authService } from './services/authService';
import { isAdmin } from './utils/auth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      try {
        const userInfo = await authService.getCurrentUser();
        setUserRole(isAdmin() ? 'Admin' : 'User');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (loading) {
    return <div className="loading-screen">جاري التحميل...</div>;
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <nav className="navbar">
            <div className="nav-container">
              <h2 className="nav-logo">قائمة المهام</h2>
              <div className="nav-links">
                <Link to="/tasks">المهام</Link>
                {userRole === 'Admin' && <Link to="/admin">لوحة الإدارة</Link>}
                <button onClick={handleLogout} className="btn-logout">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/tasks" /> : <Login onLogin={checkAuth} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/tasks" /> : <Register />
            }
          />
          <Route
            path="/tasks"
            element={
              isAuthenticated ? <TaskList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && userRole === 'Admin' ? (
                <AdminPanel />
              ) : (
                <Navigate to="/tasks" />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/tasks" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
