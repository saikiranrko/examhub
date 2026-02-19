import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function StudentHome() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/exams/').then(r => setExams(r.data));
  }, []);

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="student" />
      <div style={{ marginLeft:'240px', flex:1, padding:'32px' }}>
        <div style={{ background:'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius:'16px', padding:'32px', marginBottom:'32px', color:'white' }}>
          <h1 style={{ margin:'0 0 8px', fontSize:'24px', fontWeight:'700' }}>Welcome back, {localStorage.getItem('full_name')} 👋</h1>
          <p style={{ margin:0, opacity:0.85, fontSize:'15px' }}>You have {exams.length} exam{exams.length !== 1 ? 's' : ''} available</p>
        </div>

        <h2 style={{ margin:'0 0 20px', fontSize:'18px', fontWeight:'600', color:'#0f172a' }}>Available Exams</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' }}>
          {exams.map(e => (
            <div key={e.id} style={{ background:'white', padding:'24px', borderRadius:'14px', border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                <h3 style={{ margin:0, fontSize:'16px', fontWeight:'600', color:'#0f172a', flex:1 }}>{e.title}</h3>
              </div>
              <p style={{ margin:'0 0 16px', fontSize:'13px', color:'#64748b', lineHeight:'1.5' }}>{e.description || 'No description provided'}</p>
              <div style={{ display:'flex', gap:'16px', marginBottom:'20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#64748b' }}>
                  <span>⏱</span><span>{e.time_limit} minutes</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#64748b' }}>
                  <span>❓</span><span>{e.question_count} questions</span>
                </div>
              </div>
              <button onClick={() => navigate(`/exam/${e.id}`)} style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'white', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
                Start Exam →
              </button>
            </div>
          ))}
          {exams.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px', color:'#94a3b8' }}>
              <div style={{ fontSize:'48px', marginBottom:'16px' }}>📭</div>
              <p style={{ fontSize:'16px', fontWeight:'500' }}>No exams available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
