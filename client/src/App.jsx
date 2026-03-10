import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

// דף בית זמני (רק בשביל שיהיה לנו לאן להגיע)
function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Monopoly Birthday Game 🎂</h1>
      <p>Welcome! Please sign in or create an account.</p>
      <nav>
        <Link to="/register" style={{ marginRight: '20px' }}>Register</Link>
        <Link to="/login">Login (Coming Soon)</Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* נתיב ראשי - דף הבית */}
        <Route path="/" element={<Home />} />
        
        {/* נתיב להרשמה */}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;