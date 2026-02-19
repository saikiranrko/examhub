import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import API from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentAttempts, setRecentAttempts] = useState([]);

  useEffect(() => {
    API.get('/api/exams/stats/overview').then(r => setStats(r.data));
    API.get('/api/attempts/all').then(r => setRecentAttempts(r.data.slice(0, 8)));
  }, []);

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="admin" />
      <div style={{ marginLeft:'240px', flex:1, padding:'32px' }}>
        <h1 style={{ margin:'0 0 4px', fontSize:'24px', fontWeight:'700', color:'#0f172a' }}>Dashboard</h1>
        <p style={{ margin:'0 0 28px', color:'#64748b', fontSize:'14px' }}>Welcome back, {localStorage.getItem('full_name')} 👋</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom:'32px' }}>
          <StatCard icon="📋" label="Total Exams" value={stats.total_exams || 0} color="#6366f1" />
          <StatCard icon="👥" label="Total Students" value={stats.total_students || 0} color="#06b6d4" />
          <StatCard icon="📝" label="Total Attempts" value={stats.total_attempts || 0} color="#10b981" />
          <StatCard icon="⭐" label="Avg Score" value={`${stats.avg_score || 0}%`} color="#f59e0b" />
        </div>

        <div style={{ background:'white', borderRadius:'14px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #f1f5f9', overflow:'hidden' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9' }}>
            <h2 style={{ margin:0, fontSize:'16px', fontWeight:'600', color:'#0f172a' }}>Recent Exam Attempts</h2>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Student','Exam','Score','Result','Date'].map(h => (
                  <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAttempts.map(a => (
                <tr key={a.id} style={{ borderTop:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'14px 20px', fontSize:'14px', fontWeight:'500', color:'#0f172a' }}>{a.user_name}</td>
                  <td style={{ padding:'14px 20px', fontSize:'14px', color:'#475569' }}>{a.exam_title}</td>
                  <td style={{ padding:'14px 20px', fontSize:'14px', color:'#475569' }}>{a.score}/{a.total}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <span style={{ padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background: a.percentage >= 60 ? '#dcfce7' : '#fee2e2', color: a.percentage >= 60 ? '#166534' : '#991b1b' }}>
                      {a.percentage}% {a.percentage >= 60 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:'13px', color:'#94a3b8' }}>{new Date(a.completed_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentAttempts.length === 0 && (
                <tr><td colSpan={5} style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>No attempts yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
