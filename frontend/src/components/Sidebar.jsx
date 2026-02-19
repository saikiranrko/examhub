import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const adminLinks = [
    { path:'/admin', icon:'📊', label:'Dashboard' },
    { path:'/admin/exams', icon:'📋', label:'Exams' },
    { path:'/admin/users', icon:'👥', label:'Users' },
    { path:'/admin/results', icon:'📈', label:'Results' },
  ];
  const studentLinks = [
    { path:'/student', icon:'🏠', label:'Home' },
    { path:'/student/history', icon:'📜', label:'My History' },
  ];
  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div style={{ width:'240px', background:'#0f172a', color:'white', padding:'0', display:'flex', flexDirection:'column', height:'100vh', position:'fixed', left:0, top:0 }}>
      <div style={{ padding:'28px 24px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:'24px', marginBottom:'4px' }}>📝</div>
        <h2 style={{ margin:0, fontSize:'20px', fontWeight:'700', letterSpacing:'-0.5px' }}>ExamHub</h2>
        <span style={{ fontSize:'11px', color:'#64748b', textTransform:'uppercase', letterSpacing:'1px' }}>{role === 'admin' ? 'Admin Panel' : 'Student Portal'}</span>
      </div>
      <nav style={{ flex:1, padding:'16px 12px' }}>
        {links.map(l => (
          <button key={l.path} onClick={() => navigate(l.path)} style={{
            width:'100%', padding:'11px 14px', marginBottom:'4px', display:'flex', alignItems:'center', gap:'12px',
            background: location.pathname === l.path ? 'rgba(99,102,241,0.2)' : 'transparent',
            color: location.pathname === l.path ? '#818cf8' : '#94a3b8',
            border: location.pathname === l.path ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            borderRadius:'8px', cursor:'pointer', textAlign:'left', fontSize:'14px', fontWeight:'500', transition:'all 0.2s'
          }}>
            <span>{l.icon}</span>{l.label}
          </button>
        ))}
      </nav>
      <div style={{ padding:'16px 12px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding:'12px 14px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', marginBottom:'10px' }}>
          <p style={{ margin:0, fontSize:'13px', fontWeight:'600', color:'white' }}>{localStorage.getItem('full_name') || 'User'}</p>
          <p style={{ margin:0, fontSize:'11px', color:'#64748b', marginTop:'2px', textTransform:'capitalize' }}>{role}</p>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ width:'100%', padding:'10px', background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
