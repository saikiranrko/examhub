import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function StudentHome() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { API.get('/api/exams/').then(r => setExams(r.data)); }, []);

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="student" />
      <div className="main-content" style={{ marginLeft:'220px', flex:1, padding:'24px', minWidth:0 }}>
        <div style={{ background:'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius:'16px', padding:'clamp(20px, 4vw, 32px)', marginBottom:'28px', color:'white' }}>
          <h1 style={{ margin:'0 0 8px', fontSize:'clamp(18px, 3vw, 24px)', fontWeight:'700' }}>Welcome back, {localStorage.getItem('full_name')} 👋</h1>
          <p style={{ margin:0, opacity:0.85, fontSize:'14px' }}>{exams.length} exam{exams.length !== 1 ? 's' : ''} available</p>
        </div>
        <h2 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:'600', color:'#0f172a' }}>Available Exams</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'16px' }}>
          {exams.map(e => (
            <div key={e.id} style={{ background:'white', padding:'20px', borderRadius:'14px', border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column' }}>
              <h3 style={{ margin:'0 0 8px', fontSize:'15px', fontWeight:'600', color:'#0f172a' }}>{e.title}</h3>
              <p style={{ margin:'0 0 12px', fontSize:'13px', color:'#64748b', lineHeight:'1.5', flex:1 }}>{e.description || 'No description'}</p>
              <div style={{ display:'flex', gap:'12px', marginBottom:'16px', flexWrap:'wrap' }}>
                <span style={{ fontSize:'12px', color:'#64748b' }}>⏱ {e.time_limit} mins</span>
                <span style={{ fontSize:'12px', color:'#64748b' }}>❓ {e.question_count} questions</span>
              </div>
              <button onClick={() => navigate(`/exam/${e.id}`)} style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'white', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
                Start Exam →
              </button>
            </div>
          ))}
          {exams.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px', color:'#94a3b8', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
              <p style={{ fontSize:'15px', fontWeight:'500' }}>No exams available yet</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding: 16px !important; padding-top: 60px !important; }
        }
      `}</style>
    </div>
  );
}
