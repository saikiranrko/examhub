import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/client';

export default function Register() {
  const [form, setForm] = useState({ email:'', password:'', full_name:'' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/api/auth/register?email=${form.email}&password=${form.password}&full_name=${encodeURIComponent(form.full_name)}&role=student`);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
      <div style={{background:'white', padding:'48px 40px', borderRadius:'20px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)', width:'100%', maxWidth:'420px', margin:'0 20px'}}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <div style={{fontSize:'48px', marginBottom:'8px'}}>📝</div>
          <h1 style={{fontSize:'28px', fontWeight:'700', color:'#1a1a2e'}}>Create Account</h1>
          <p style={{color:'#888', marginTop:'6px'}}>Join ExamHub as a student</p>
        </div>

        {error && <div style={{background:'#fff5f5', border:'1px solid #fed7d7', color:'#c53030', padding:'12px', borderRadius:'8px', marginBottom:'16px', fontSize:'14px', textAlign:'center'}}>{error}</div>}
        {success && <div style={{background:'#f0fff4', border:'1px solid #9ae6b4', color:'#276749', padding:'12px', borderRadius:'8px', marginBottom:'16px', fontSize:'14px', textAlign:'center'}}>{success}</div>}

        <form onSubmit={handleRegister}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', marginBottom:'6px', fontSize:'14px', fontWeight:'600', color:'#333'}}>Full Name</label>
            <input type="text" placeholder="Enter your full name" value={form.full_name} onChange={e => setForm({...form, full_name:e.target.value})} required style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'2px solid #eee', fontSize:'15px', outline:'none'}} />
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', marginBottom:'6px', fontSize:'14px', fontWeight:'600', color:'#333'}}>Email</label>
            <input type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'2px solid #eee', fontSize:'15px', outline:'none'}} />
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block', marginBottom:'6px', fontSize:'14px', fontWeight:'600', color:'#333'}}>Password</label>
            <input type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'2px solid #eee', fontSize:'15px', outline:'none'}} />
          </div>
          <button type="submit" style={{width:'100%', padding:'14px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'700', cursor:'pointer'}}>
            Create Account →
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#888'}}>
          Already have an account? <Link to="/" style={{color:'#667eea', fontWeight:'600'}}>Login</Link>
        </p>
      </div>
    </div>
  );
}
