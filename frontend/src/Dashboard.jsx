import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard({ token, setToken }) {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: 'https://skill-matcher-s8li.onrender.com/api',
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
    return (
      <div className="app-container animate-in" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="app-container animate-in">
      <div className="card">
        {/* Header */}
        <div className="dashboard-header">
          <h1>My Team</h1>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Add Skill */}
        <div className="skill-section">
          <h3>Add Skill</h3>
          <form onSubmit={handleAddSkill} className="input-row">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., Java, React, Python"
            />
            <button type="submit" className="btn-primary">
              Add
            </button>
          </form>
        </div>

        {/* My Skills */}
        <div className="skill-section">
          <h3>My Skills</h3>
          {skills.length === 0 ? (
            <p className="empty-state">You haven't added any skills yet.</p>
          ) : (
            <div className="skill-tags">
              {skills.map((skill) => (
                <span key={skill.id} className="skill-tag">
                  {skill.name}
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteSkill(skill.id)}
                    aria-label="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Matches */}
        <div>
          <h3>Your Hackathon Matches</h3>
          {matches.length === 0 ? (
            <p className="empty-state">
              No matches yet. Add more skills or register another user with different skills to see matches.
            </p>
          ) : (
            <div className="match-list">
              {matches.map((user) => (
                <div key={user.id} className="match-item">
                  <div>
                    <div className="match-name">{user.name}</div>
                    <div className="match-role">{user.role}</div>
                    <div className="match-email">{user.email}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--primary)' }}>Match</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
