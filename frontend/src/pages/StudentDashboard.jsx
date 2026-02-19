import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/exams/').then(r => setExams(r.data));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>📝 ExamHub</h2>
        <p style={styles.role}>Student Portal</p>
        <button style={styles.logout} onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
      </div>
      <div style={styles.main}>
        <h2>Available Exams</h2>
        <div style={styles.grid}>
          {exams.map(e => (
            <div key={e.id} style={styles.card}>
              <h3>{e.title}</h3>
              <p style={{color:'#888', fontSize:'13px'}}>{e.description}</p>
              <p style={{color:'#667eea', fontSize:'13px'}}>⏱ {e.time_limit} minutes</p>
              <button style={styles.btn} onClick={() => navigate(`/exam/${e.id}`)}>Start Exam</button>
            </div>
          ))}
          {exams.length === 0 && <p style={{color:'#888'}}>No exams available yet.</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', height:'100vh', fontFamily:'sans-serif' },
  sidebar: { width:'220px', background:'linear-gradient(180deg, #1a1a2e, #16213e)', color:'white', padding:'24px', display:'flex', flexDirection:'column' },
  logo: { marginBottom:'8px' },
  role: { color:'#aaa', fontSize:'13px', marginBottom:'auto' },
  logout: { padding:'10px', background:'rgba(255,255,255,0.1)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
  main: { flex:1, padding:'32px', background:'#f5f7fa', overflowY:'auto' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px' },
  card: { background:'white', padding:'24px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  btn: { width:'100%', marginTop:'12px', padding:'10px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' }
};
