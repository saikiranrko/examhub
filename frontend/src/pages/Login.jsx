import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/api/auth/login?email=${email}&password=${password}`);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('full_name', res.data.full_name);
      if (res.data.role === 'admin') navigate('/admin');
      else navigate('/student');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
      <div style={{background:'white', padding:'48px 40px', borderRadius:'20px', boxShadow:'0 20px 60px rgba(0,0,0,0.4)', width:'100%', maxWidth:'420px', margin:'0 20px'}}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <div style={{fontSize:'48px', marginBottom:'8px'}}>📝</div>
          <h1 style={{fontSize:'28px', fontWeight:'700', color:'#1a1a2e'}}>ExamHub</h1>
          <p style={{color:'#888', marginTop:'6px'}}>Online Exam Platform</p>
        </div>
        {error && <div style={{background:'#fff5f5', border:'1px solid #fed7d7', color:'#c53030', padding:'12px', borderRadius:'8px', marginBottom:'16px', fontSize:'14px', textAlign:'center'}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block', marginBottom:'6px', fontSize:'14px', fontWeight:'600', color:'#333'}}>Email</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'2px solid #eee', fontSize:'15px', outline:'none'}} onFocus={e => e.target.style.border='2px solid #667eea'} onBlur={e => e.target.style.border='2px solid #eee'} />
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block', marginBottom:'6px', fontSize:'14px', fontWeight:'600', color:'#333'}}>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'2px solid #eee', fontSize:'15px', outline:'none'}} onFocus={e => e.target.style.border='2px solid #667eea'} onBlur={e => e.target.style.border='2px solid #eee'} />
          </div>
          <button type="submit" style={{width:'100%', padding:'14px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'10px', fontSize:'16px', fontWeight:'700', cursor:'pointer'}}>
            Login →
          </button>
        </form>
        <p style={{textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#888'}}>
          New student? <Link to="/register" style={{color:'#667eea', fontWeight:'600'}}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
