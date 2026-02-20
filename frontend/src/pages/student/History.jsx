import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function StudentHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    API.get(`/api/attempts/history/${userId}`)
      .then(r => setAttempts(r.data))
      .catch(e => console.error('History error:', e))
      .finally(() => setLoading(false));
  }, []);

  const avgScore = attempts.length ? Math.round(attempts.reduce((s,a) => s + a.percentage, 0) / attempts.length) : 0;
  const passed = attempts.filter(a => a.percentage >= 60).length;

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="student" />
      <div className="main-content" style={{ marginLeft:'220px', flex:1, padding:'24px', minWidth:0, overflowX:'hidden' }}>
        <h1 style={{ margin:'0 0 4px', fontSize:'clamp(18px,3vw,24px)', fontWeight:'700', color:'#0f172a' }}>My History</h1>
        <p style={{ margin:'0 0 20px', color:'#64748b', fontSize:'14px' }}>Your exam results</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Total Taken', value:attempts.length, icon:'📝', color:'#6366f1' },
            { label:'Passed', value:passed, icon:'✅', color:'#10b981' },
            { label:'Failed', value:attempts.length-passed, icon:'❌', color:'#ef4444' },
            { label:'Avg Score', value:`${avgScore}%`, icon:'⭐', color:'#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background:'white', padding:'16px', borderRadius:'12px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'22px', marginBottom:'8px' }}>{s.icon}</div>
              <p style={{ margin:'0 0 4px', fontSize:'clamp(18px,3vw,24px)', fontWeight:'700', color:s.color }}>{s.value}</p>
              <p style={{ margin:0, fontSize:'12px', color:'#64748b' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'48px', color:'#94a3b8' }}>
            <div style={{ fontSize:'32px', marginBottom:'12px' }}>⏳</div>
            <p>Loading history...</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {attempts.map(a => (
              <div key={a.id} style={{ background:'white', padding:'clamp(14px,3vw,20px)', borderRadius:'14px', border:'1px solid #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:'150px' }}>
                  <h3 style={{ margin:'0 0 4px', fontSize:'15px', fontWeight:'600', color:'#0f172a' }}>{a.exam_title}</h3>
                  <p style={{ margin:0, fontSize:'12px', color:'#94a3b8' }}>{new Date(a.completed_at).toLocaleDateString()}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'14px', flexWrap:'wrap' }}>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ margin:0, fontSize:'20px', fontWeight:'800', color: a.percentage>=60 ? '#16a34a' : '#dc2626' }}>{a.percentage}%</p>
                    <p style={{ margin:0, fontSize:'11px', color:'#94a3b8' }}>{a.score}/{a.total}</p>
                  </div>
                  <span style={{ padding:'6px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', background: a.percentage>=60 ? '#dcfce7' : '#fee2e2', color: a.percentage>=60 ? '#166534' : '#991b1b', whiteSpace:'nowrap' }}>
                    {a.percentage>=60 ? '✅ PASS' : '❌ FAIL'}
                  </span>
                </div>
              </div>
            ))}
            {attempts.length === 0 && (
              <div style={{ textAlign:'center', padding:'48px', background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', color:'#94a3b8' }}>
                <div style={{ fontSize:'40px', marginBottom:'12px' }}>📭</div>
                <p style={{ fontSize:'15px', fontWeight:'500' }}>No exams taken yet</p>
                <p style={{ fontSize:'13px', marginTop:'8px' }}>Go to Home to take your first exam!</p>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding: 16px !important; padding-top: 60px !important; }
        }
      `}</style>
    </div>
  );
}
