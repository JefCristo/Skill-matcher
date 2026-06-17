import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ token, setToken }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const skillsRes = await api.get('/skills/my-skills');
      setSkills(skillsRes.data);

      const matchesRes = await api.get('/matches');
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert('Session expired. Please login again.');
        setToken(null);
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      await api.post(`/skills/add?skillName=${newSkill}`);
      setNewSkill('');
      fetchData();
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Remove this skill?')) return;

    try {
      await api.delete(`/skills/delete/${skillId}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Add New Skill</h3>
        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., Java, React, Python"
            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Skill
          </button>
        </form>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>My Skills</h3>
        {skills.length === 0 ? (
          <p>You haven't added any skills yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {skills.map((skill) => (
              <li key={skill.id} style={{ background: '#f0f0f0', padding: '8px 12px', marginBottom: '5px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginRight: '5px' }}>
                <span>{skill.name}</span>
                <button 
                  onClick={() => handleDeleteSkill(skill.id)}
                  style={{ 
                    background: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    padding: '2px 8px', 
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h3>Your Hackathon Matches</h3>
        {matches.length === 0 ? (
          <p>No matches found. Try adding more skills or register another user with different skills.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {matches.map((user) => (
              <li key={user.id} style={{ background: '#e9f7fe', padding: '12px 16px', marginBottom: '10px', borderRadius: '8px' }}>
                <strong>{user.name}</strong> ({user.role}) - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;