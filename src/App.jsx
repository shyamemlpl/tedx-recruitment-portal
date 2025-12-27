import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Apply from './pages/Apply';
import CheckStatus from './pages/CheckStatus';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="page">
          <Navbar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/apply"
                element={
                  <ProtectedRoute>
                    <Apply />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/status"
                element={
                  <ProtectedRoute>
                    <CheckStatus />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
