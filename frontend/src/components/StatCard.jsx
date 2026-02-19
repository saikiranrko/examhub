export default function StatCard({ icon, label, value, color = '#6366f1', sub }) {
  return (
    <div style={{ background:'white', padding:'24px', borderRadius:'14px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:'1px solid #f1f5f9' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <p style={{ margin:'0 0 8px', fontSize:'13px', color:'#64748b', fontWeight:'500' }}>{label}</p>
          <p style={{ margin:0, fontSize:'32px', fontWeight:'700', color:'#0f172a', letterSpacing:'-1px' }}>{value}</p>
          {sub && <p style={{ margin:'4px 0 0', fontSize:'12px', color:'#94a3b8' }}>{sub}</p>}
        </div>
        <div style={{ fontSize:'32px', background:`${color}15`, padding:'12px', borderRadius:'12px' }}>{icon}</div>
      </div>
    </div>
  );
}
