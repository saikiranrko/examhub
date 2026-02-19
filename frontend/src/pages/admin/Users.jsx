import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ToastContainer, { useToast } from '../../components/Toast';
import API from '../../api/client';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const { toasts, success, error } = useToast();

  const fetchUsers = () => API.get('/api/auth/users').then(r => setUsers(r.data));
  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/api/auth/users/${id}`);
      success('User deleted');
      fetchUsers();
    } catch { error('Failed to delete'); }
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="admin" />
      <ToastContainer toasts={toasts} />
      <div style={{ marginLeft:'240px', flex:1, padding:'32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
          <div>
            <h1 style={{ margin:'0 0 4px', fontSize:'24px', fontWeight:'700', color:'#0f172a' }}>Users</h1>
            <p style={{ margin:0, color:'#64748b', fontSize:'14px' }}>{users.length} total users</p>
          </div>
          <input placeholder="🔍 Search users..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding:'10px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', fontSize:'14px', width:'240px', outline:'none' }} />
        </div>

        <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                {['#','Name','Email','Role','Actions'].map(h => (
                  <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                  <td style={{ padding:'14px 20px', fontSize:'14px', color:'#94a3b8' }}>{i+1}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'14px' }}>
                        {u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight:'500', color:'#0f172a', fontSize:'14px' }}>{u.full_name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:'14px', color:'#64748b' }}>{u.email}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <span style={{ padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background: u.role==='admin' ? '#fef3c7' : '#e8f0fe', color: u.role==='admin' ? '#d97706' : '#1d4ed8' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding:'14px 20px' }}>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} style={{ padding:'6px 14px', background:'#fff5f5', color:'#ef4444', border:'1px solid #fecaca', borderRadius:'7px', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding:'48px', textAlign:'center', color:'#94a3b8' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
