import { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return <Dashboard token={token} setToken={setToken} />;
}

export default App;