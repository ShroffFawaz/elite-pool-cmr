import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const logo = "/favicon.png";

const LoginPage = () => {
  const { setUser, toast } = useAppContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('ceo');

  const doLogin = async () => {
    if (!username || !password) { toast('Please enter all fields', 'error'); return; }
    
    try {
      // 1. Get Token
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const tokenRes = await axios.post('/token', formData);
      const token = tokenRes.data.access_token;
      
      // Save token for future requests
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 2. Get User Info
      const meRes = await axios.get('/user/view'); // In a real app we'd use /users/me
      const myUser = meRes.data.find(u => u.username === username);

      if (!myUser) throw new Error("User profile not found");

      const userData = { 
        role: myUser.role, 
        name: myUser.full_name || myUser.username, 
        username: myUser.username,
        avatar: (myUser.full_name || myUser.username).charAt(0).toUpperCase() 
      };

      setUser(userData);
      toast(`Welcome back, ${userData.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Authentication failed';
      toast(typeof msg === 'string' ? msg : 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Visual Side */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 30%, rgba(56,189,248,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(45,212,191,0.05) 0%, transparent 50%)', zIndex: 0 }}></div>
        
        <div style={{ zIndex: 1, maxWidth: '500px' }}>
          <div className="logo-icon" style={{ width: '64px', height: '64px', marginBottom: '32px', boxShadow: '0 8px 32px rgba(56,189,248,0.3)', overflow: 'hidden', background: 'none' }}>
            <img src={logo} alt="Elite Pool Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1, marginBottom: '24px' }}>Build Excellence, <br/><span style={{ color: 'var(--sky)' }}>One Pool at a Time.</span></h1>
          <p style={{ fontSize: '18px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '40px' }}>The intelligent operations platform for Elite Pool Builders. Manage leads, track construction, and scale your business effortlessly.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--sky)', marginBottom: '12px' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
              <div style={{ fontWeight: 700 }}>Lead Tracking</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>End-to-end sales management</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--sky)', marginBottom: '12px' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3Z"/><path d="M5 21V10.85"/><path d="M19 21V10.85"/><path d="M9 21V14"/><path d="M15 21V14"/></svg></div>
              <div style={{ fontWeight: 700 }}>Site Ops</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Real-time construction logs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ width: '500px', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Team Sign In</h2>
          <p style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '40px' }}>Enter your credentials to access the workspace</p>

          <div className="fg">
            <label className="fl">Access Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {['ceo', 'admin', 'partner', 'customer_support'].map(r => (
                <button 
                  key={r} 
                  onClick={() => setRole(r)} 
                  style={{ 
                    padding: '12px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', transition: '0.2s', 
                    border: '1px solid', 
                    borderColor: role === r ? 'var(--sky)' : 'var(--border)', 
                    background: role === r ? 'rgba(56,189,248,0.1)' : 'transparent', 
                    color: role === r ? 'var(--sky)' : 'var(--text3)' 
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="fg">
            <label className="fl">Username</label>
            <input className="fi" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          </div>

          <div className="fg">
            <label className="fl">Password</label>
            <input className="fi" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} placeholder="••••••••" />
          </div>

          <button className="btn btn-sky" style={{ width: '100%', padding: '16px', marginTop: '12px', fontSize: '15px' }} onClick={doLogin}>Access Dashboard</button>
          
          <div style={{ marginTop: '32px', padding: '16px', borderRadius: '12px', background: 'var(--bg3)', fontSize: '12px', textAlign: 'center', color: 'var(--text3)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px', color: 'var(--sky)' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Secure Login Active • Use your registered team credentials
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
