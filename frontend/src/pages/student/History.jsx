import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function StudentHistory() {
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (userId) API.get(`/api/attempts/history/${userId}`).then(r => setHistory(r.data));
  }, []);

  const avgScore = history.length > 0 ? Math.round(history.reduce((s, a) => s + a.percentage, 0) / history.length) : 0;
  const passed = history.filter(a => a.percentage >= 60).length;

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="student" />
      <div style={{ marginLeft:'240px', flex:1, padding:'32px' }}>
        <h1 style={{ margin:'0 0 4px', fontSize:'24px', fontWeight:'700', color:'#0f172a' }}>My Exam History</h1>
        <p style={{ margin:'0 0 28px', color:'#64748b', fontSize:'14px' }}>{history.length} attempts · {passed} passed · {avgScore}% avg score</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'28px' }}>
          {[
            { label:'Exams Taken', value:history.length, color:'#6366f1' },
            { label:'Passed', value:passed, color:'#10b981' },
            { label:'Avg Score', value:`${avgScore}%`, color:'#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background:'white', padding:'20px', borderRadius:'12px', border:'1px solid #e2e8f0' }}>
              <p style={{ margin:'0 0 6px', fontSize:'13px', color:'#64748b' }}>{s.label}</p>
              <p style={{ margin:0, fontSize:'28px', fontWeight:'700', color:s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {history.map(a => (
            <div key={a.id} style={{ background:'white', padding:'20px 24px', borderRadius:'12px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ margin:'0 0 4px', fontWeight:'600', color:'#0f172a', fontSize:'15px' }}>{a.exam_title}</p>
                <p style={{ margin:0, fontSize:'13px', color:'#94a3b8' }}>{new Date(a.completed_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ textAlign:'right' }}>
                  <p style={{ margin:'0 0 4px', fontSize:'13px', color:'#64748b' }}>Score</p>
                  <p style={{ margin:0, fontWeight:'700', color:'#0f172a', fontSize:'16px' }}>{a.score}/{a.total}</p>
                </div>
                <div style={{ textAlign:'center', background: a.percentage >= 60 ? '#dcfce7' : '#fee2e2', padding:'10px 16px', borderRadius:'10px', minWidth:'70px' }}>
                  <p style={{ margin:'0 0 2px', fontSize:'18px', fontWeight:'700', color: a.percentage >= 60 ? '#166534' : '#991b1b' }}>{a.percentage}%</p>
                  <p style={{ margin:0, fontSize:'11px', fontWeight:'600', color: a.percentage >= 60 ? '#166534' : '#991b1b' }}>{a.percentage >= 60 ? 'PASS' : 'FAIL'}</p>
                </div>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px', color:'#94a3b8', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'48px', marginBottom:'16px' }}>📭</div>
              <p style={{ fontSize:'16px', fontWeight:'500' }}>No exam history yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
