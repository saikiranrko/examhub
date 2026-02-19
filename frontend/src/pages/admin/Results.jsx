import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function AdminResults() {
  const [attempts, setAttempts] = useState([]);
  const [exams, setExams] = useState([]);
  const [filterExam, setFilterExam] = useState('all');

  useEffect(() => {
    API.get('/api/attempts/all').then(r => setAttempts(r.data));
    API.get('/api/exams/all').then(r => setExams(r.data));
  }, []);

  const filtered = filterExam === 'all' ? attempts : attempts.filter(a => a.exam_title === exams.find(e => e.id == filterExam)?.title);
  const passRate = filtered.length > 0 ? Math.round(filtered.filter(a => a.percentage >= 60).length / filtered.length * 100) : 0;
  const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((s, a) => s + a.percentage, 0) / filtered.length) : 0;

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="admin" />
      <div style={{ marginLeft:'240px', flex:1, padding:'32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
          <div>
            <h1 style={{ margin:'0 0 4px', fontSize:'24px', fontWeight:'700', color:'#0f172a' }}>Results & Analytics</h1>
            <p style={{ margin:0, color:'#64748b', fontSize:'14px' }}>{filtered.length} attempts · {passRate}% pass rate · {avgScore}% avg score</p>
          </div>
          <select value={filterExam} onChange={e => setFilterExam(e.target.value)} style={{ padding:'10px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:'14px', outline:'none' }}>
            <option value="all">All Exams</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'16px', marginBottom:'28px' }}>
          {[
            { label:'Total Attempts', value:filtered.length, color:'#6366f1' },
            { label:'Pass Rate', value:`${passRate}%`, color:'#10b981' },
            { label:'Avg Score', value:`${avgScore}%`, color:'#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background:'white', padding:'20px', borderRadius:'12px', border:'1px solid #e2e8f0' }}>
              <p style={{ margin:'0 0 6px', fontSize:'13px', color:'#64748b' }}>{s.label}</p>
              <p style={{ margin:0, fontSize:'28px', fontWeight:'700', color:s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                {['Student','Exam','Score','Percentage','Result','Date'].map(h => (
                  <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'14px 20px', fontWeight:'500', color:'#0f172a', fontSize:'14px' }}>{a.user_name}</td>
                  <td style={{ padding:'14px 20px', color:'#475569', fontSize:'14px' }}>{a.exam_title}</td>
                  <td style={{ padding:'14px 20px', color:'#475569', fontSize:'14px' }}>{a.score}/{a.total}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <div style={{ flex:1, height:'6px', background:'#f1f5f9', borderRadius:'3px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${a.percentage}%`, background: a.percentage >= 60 ? '#10b981' : '#ef4444', borderRadius:'3px' }} />
                      </div>
                      <span style={{ fontSize:'13px', fontWeight:'600', color:'#475569', minWidth:'36px' }}>{a.percentage}%</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 20px' }}>
                    <span style={{ padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background: a.percentage >= 60 ? '#dcfce7' : '#fee2e2', color: a.percentage >= 60 ? '#166534' : '#991b1b' }}>
                      {a.percentage >= 60 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:'13px', color:'#94a3b8' }}>{new Date(a.completed_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding:'48px', textAlign:'center', color:'#94a3b8' }}>No results yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
