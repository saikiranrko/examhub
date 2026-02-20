import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const SidebarContent = () => (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ padding:'24px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize:'22px', marginBottom:'4px' }}>📝</div>
        <h2 style={{ margin:0, fontSize:'18px', fontWeight:'700', color:'white', letterSpacing:'-0.5px' }}>ExamHub</h2>
        <span style={{ fontSize:'10px', color:'#64748b', textTransform:'uppercase', letterSpacing:'1px' }}>{role === 'admin' ? 'Admin Panel' : 'Student Portal'}</span>
      </div>
      <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
        {links.map(l => (
          <button key={l.path} onClick={() => { navigate(l.path); setMobileOpen(false); }} style={{
            width:'100%', padding:'11px 14px', marginBottom:'4px',
            display:'flex', alignItems:'center', gap:'12px',
            background: location.pathname === l.path ? 'rgba(99,102,241,0.2)' : 'transparent',
            color: location.pathname === l.path ? '#818cf8' : '#94a3b8',
            border: location.pathname === l.path ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            borderRadius:'8px', cursor:'pointer', textAlign:'left',
            fontSize:'14px', fontWeight:'500', transition:'all 0.2s'
          }}>
            <span style={{ fontSize:'16px' }}>{l.icon}</span>{l.label}
          </button>
        ))}
      </nav>
      <div style={{ padding:'12px 10px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding:'10px 12px', background:'rgba(255,255,255,0.05)', borderRadius:'8px', marginBottom:'8px' }}>
          <p style={{ margin:0, fontSize:'13px', fontWeight:'600', color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{localStorage.getItem('full_name') || 'User'}</p>
          <p style={{ margin:0, fontSize:'11px', color:'#64748b', marginTop:'2px', textTransform:'capitalize' }}>{role}</p>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{
          width:'100%', padding:'10px', background:'rgba(239,68,68,0.1)',
          color:'#f87171', border:'1px solid rgba(239,68,68,0.2)',
          borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'500'
        }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(!mobileOpen)} style={{
        display:'none', position:'fixed', top:'12px', left:'12px', zIndex:1001,
        background:'#0f172a', border:'none', borderRadius:'8px',
        padding:'10px', cursor:'pointer', color:'white', fontSize:'20px',
        boxShadow:'0 2px 8px rgba(0,0,0,0.3)',
        ['@media (max-width: 768px)'] : { display:'block' }
      }} className="hamburger">☰</button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
          zIndex:999, display:'none'
        }} className="mobile-overlay" />
      )}

      {/* Sidebar */}
      <div className="sidebar" style={{
        width:'220px', background:'#0f172a', color:'white',
        height:'100vh', position:'fixed', left:0, top:0, zIndex:1000,
        transition:'transform 0.3s ease'
      }}>
        <SidebarContent />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hamburger { display:block !important; }
          .mobile-overlay { display:block !important; }
          .sidebar {
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
          }
        }
      `}</style>
    </>
  );
}
