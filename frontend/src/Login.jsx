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
        url = 'https://skill-matcher-s8li.onrender.com/api/register';
        payload = { email, password, name, role };
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
    <div className="app-container animate-in">
      <div className="card">
        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {isLogin ? 'Sign in to find your hackathon team' : 'Join the community and get matched'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="input-group">
                <label>Your Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  placeholder="e.g., Backend, Frontend, DevOps"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="toggle-container">
          {isLogin ? "Don't have an account?" : 'Already a member?'}
          <button
            className="btn-secondary"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
