import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // הוק לניווט בין דפים

function RegisterPage() {
  // 1. הגדרת ה-State של הטופס
  // במקום ליצור משתנה לכל שדה, אנחנו יוצרים אובייקט אחד שמחזיק את הכל
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate(); // הכלי שיעביר אותנו דף אחרי ההרשמה

  // 2. פונקציה שמתעדכנת בכל פעם שהמשתמש מקליד תו
  const handleChange = (e) => {
    // e.target.name = השם של השדה (למשל "email")
    // e.target.value = מה שהמשתמש הקליד
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. שליחת הטופס לשרת
  const handleSubmit = async (e) => {
    e.preventDefault(); // מונע מהדף להתרענן (התנהגות ברירת מחדל של טפסים)
    
    try {
      // שליחת בקשת POST לשרת שלנו
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      
      alert('Registration successful! 🚀');
      console.log(response.data);
      
      // כאן בהמשך נעביר את המשתמש לדף הכניסה
       navigate('/'); 
      
    } catch (error) {
      // טיפול בשגיאות (למשל: משתמש כבר קיים)
      console.error(error);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  // 4. ה-HTML של הטופס
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          value={formData.username} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px' }}
        />
        
        <button type="submit" style={{ padding: '10px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sign Up
        </button>
      
      </form>
    </div>
  );
}

export default RegisterPage;