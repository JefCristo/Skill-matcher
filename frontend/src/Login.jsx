import { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      let url;
      let payload;

      if (isLogin) {
        url = 'https://skill-matcher-s8li.onrender.com/api/login';
        payload = { email, password };
      } else {
        url = 'https://skill-matcher-s8li.onrender.com/api/register';        payload = { email, password, name, role };
      }

      const response = await axios.post(url, payload);

      if (isLogin) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        setMessage('Login successful!');
      } else {
        setMessage('Registration successful! Please login.');
        setEmail('');
        setPassword('');
        setName('');
        setRole('');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.response?.data || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {!isLogin && (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Role (e.g., Backend, Frontend):</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </>
        )}

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '10px', textAlign: 'center' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginLeft: '5px' }}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>

      {message && <p style={{ marginTop: '10px', textAlign: 'center', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default Login;