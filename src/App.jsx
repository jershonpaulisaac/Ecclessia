import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import QA from './pages/QA';
import QuietTime from './pages/QuietTime';
import Teachings from './pages/Teachings';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Contribution from './pages/Contribution';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import JoinCommunity from './pages/JoinCommunity';

import ScrollToTop from './components/ScrollToTop';

import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin route - standalone without nav/footer */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* All other routes with nav/footer */}
        <Route path="*" element={
          <div className="app-container">
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/qa" element={<QA />} />
                <Route path="/quiet-time" element={<QuietTime />} />
                <Route path="/teachings" element={<Teachings />} />
                <Route path="/join" element={<JoinCommunity />} />
                <Route path="/contribution" element={<Contribution />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            {/* Removed redundant footer here */}
          </div>
        } />
      </Routes>
      <footer className="simple-footer">
        <div className="container text-center">
          <p className="soli-deo-gloria">Soli Deo Gloria</p>
          <p className="copyright-text">&copy; 2026 Ecclesia Community. All rights reserved.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
