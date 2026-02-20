import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function AdminResults() {
  const [attempts, setAttempts] = useState([]);
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/api/attempts/all').then(r => setAttempts(r.data));
    API.get('/api/exams/').then(r => setExams(r.data));
  }, []);

  const filtered = filter === 'all' ? attempts : attempts.filter(a => a.exam_id === parseInt(filter));
  const avgScore = filtered.length ? Math.round(filtered.reduce((s,a) => s + a.percentage, 0) / filtered.length) : 0;
  const passRate = filtered.length ? Math.round(filtered.filter(a => a.percentage >= 60).length / filtered.length * 100) : 0;

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="admin" />
      <div className="main-content" style={{ marginLeft:'220px', flex:1, padding:'24px', minWidth:0, overflowX:'hidden' }}>
        <h1 style={{ margin:'0 0 4px', fontSize:'clamp(18px,3vw,24px)', fontWeight:'700', color:'#0f172a' }}>Results</h1>
        <p style={{ margin:'0 0 20px', color:'#64748b', fontSize:'14px' }}>Exam performance analytics</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:'14px', marginBottom:'24px' }}>
          {[
            { label:'Total Attempts', value:filtered.length, color:'#6366f1', icon:'📝' },
            { label:'Average Score', value:`${avgScore}%`, color:'#10b981', icon:'⭐' },
            { label:'Pass Rate', value:`${passRate}%`, color:'#f59e0b', icon:'✅' },
            { label:'Failed', value:`${100-passRate}%`, color:'#ef4444', icon:'❌' },
          ].map(s => (
            <div key={s.label} style={{ background:'white', padding:'16px', borderRadius:'12px', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'22px', marginBottom:'8px' }}>{s.icon}</div>
              <p style={{ margin:'0 0 4px', fontSize:'clamp(18px,3vw,24px)', fontWeight:'700', color:s.color }}>{s.value}</p>
              <p style={{ margin:0, fontSize:'12px', color:'#64748b' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', flexWrap:'wrap', gap:'12px' }}>
          <h2 style={{ margin:0, fontSize:'16px', fontWeight:'600', color:'#0f172a' }}>Attempt Details</h2>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding:'9px 14px', border:'1px solid #e2e8f0', borderRadius:'9px', fontSize:'14px', background:'white' }}>
            <option value="all">All Exams</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
              <thead>
                <tr style={{ background:'#f8fafc' }}>
                  {['Student','Exam','Score','Result','Date'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:'600', color:'#64748b', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderTop:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'12px 16px', fontSize:'14px', fontWeight:'500', color:'#0f172a', whiteSpace:'nowrap' }}>{a.user_name}</td>
                    <td style={{ padding:'12px 16px', fontSize:'13px', color:'#475569', whiteSpace:'nowrap' }}>{a.exam_title}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ flex:1, height:'6px', background:'#f1f5f9', borderRadius:'3px', minWidth:'60px', overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${a.percentage}%`, background: a.percentage>=60 ? '#10b981' : '#ef4444', borderRadius:'3px' }} />
                        </div>
                        <span style={{ fontSize:'13px', fontWeight:'600', color:'#0f172a', whiteSpace:'nowrap' }}>{a.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background: a.percentage>=60 ? '#dcfce7' : '#fee2e2', color: a.percentage>=60 ? '#166534' : '#991b1b', whiteSpace:'nowrap' }}>
                        {a.percentage>=60 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:'13px', color:'#94a3b8', whiteSpace:'nowrap' }}>{new Date(a.completed_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>No results yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
