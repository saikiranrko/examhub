import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function Register() {
  const [form, setForm] = useState({ full_name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await API.post(`/api/auth/register?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}&full_name=${encodeURIComponent(form.full_name)}&role=student`);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ background:'white', borderRadius:'20px', padding:'clamp(24px, 5vw, 40px)', width:'100%', maxWidth:'420px', boxShadow:'0 25px 50px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>🎓</div>
          <h1 style={{ margin:'0 0 6px', fontSize:'clamp(22px, 4vw, 28px)', fontWeight:'700', color:'#0f172a' }}>Create Account</h1>
          <p style={{ margin:0, color:'#64748b', fontSize:'14px' }}>Join ExamHub as a student</p>
        </div>
        {error && <div style={{ background:'#fee2e2', color:'#991b1b', padding:'12px', borderRadius:'10px', marginBottom:'16px', fontSize:'14px', textAlign:'center' }}>{error}</div>}
        {success && <div style={{ background:'#dcfce7', color:'#166534', padding:'12px', borderRadius:'10px', marginBottom:'16px', fontSize:'14px', textAlign:'center' }}>✅ Account created! Redirecting...</div>}
        <form onSubmit={handleRegister}>
          {[
            { label:'Full Name', key:'full_name', type:'text', placeholder:'Enter your full name' },
            { label:'Email', key:'email', type:'email', placeholder:'Enter your email' },
            { label:'Password', key:'password', type:'password', placeholder:'Create a password' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', marginBottom:'6px', fontSize:'14px', fontWeight:'500', color:'#374151' }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]:e.target.value})} required placeholder={f.placeholder}
                style={{ width:'100%', padding:'12px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:'16px', outline:'none', boxSizing:'border-box' }}
                onFocus={e => e.target.style.borderColor='#6366f1'}
                onBlur={e => e.target.style.borderColor='#e2e8f0'}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'600', cursor:'pointer', marginTop:'8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#64748b' }}>
          Already have an account? <span onClick={() => navigate('/')} style={{ color:'#6366f1', fontWeight:'600', cursor:'pointer' }}>Login</span>
        </p>
      </div>
    </div>
  );
}
