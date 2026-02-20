import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { API.get('/api/auth/users').then(r => setUsers(r.data)); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/api/auth/users/${id}`);
    setUsers(users.filter(u => u.id !== id));
  };

  const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="admin" />
      <div className="main-content" style={{ marginLeft:'220px', flex:1, padding:'24px', minWidth:0, overflowX:'hidden' }}>
        <h1 style={{ margin:'0 0 4px', fontSize:'clamp(18px,3vw,24px)', fontWeight:'700', color:'#0f172a' }}>Users</h1>
        <p style={{ margin:'0 0 20px', color:'#64748b', fontSize:'14px' }}>{users.length} total users</p>
        <input placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', maxWidth:'360px', padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', marginBottom:'20px', boxSizing:'border-box' }} />
        <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'480px' }}>
              <thead>
                <tr style={{ background:'#f8fafc' }}>
                  {['User','Email','Role','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:'600', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ borderTop:'1px solid #f1f5f9' }}>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'13px', flexShrink:0 }}>
                          {u.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{ fontSize:'14px', fontWeight:'500', color:'#0f172a', whiteSpace:'nowrap' }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', fontSize:'13px', color:'#475569' }}>{u.email}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background: u.role==='admin' ? '#fef9c3' : '#e0e7ff', color: u.role==='admin' ? '#854d0e' : '#3730a3' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      {u.role !== 'admin' && (
                        <button onClick={() => deleteUser(u.id)} style={{ padding:'6px 12px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ padding:'40px', textAlign:'center', color:'#94a3b8' }}>No users found</td></tr>
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
