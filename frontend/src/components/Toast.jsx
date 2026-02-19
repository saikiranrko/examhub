import { useState, useEffect } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  return { toasts, success: m => addToast(m, 'success'), error: m => addToast(m, 'error'), info: m => addToast(m, 'info') };
}

export default function ToastContainer({ toasts }) {
  return (
    <div style={{ position:'fixed', top:'20px', right:'20px', zIndex:9999, display:'flex', flexDirection:'column', gap:'8px' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding:'12px 20px', borderRadius:'10px', color:'white', fontSize:'14px', fontWeight:'500',
          background: t.type==='success' ? '#22c55e' : t.type==='error' ? '#ef4444' : '#3b82f6',
          boxShadow:'0 4px 12px rgba(0,0,0,0.2)', animation:'slideIn 0.3s ease'
        }}>
          {t.type==='success' ? '✅' : t.type==='error' ? '❌' : 'ℹ️'} {t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform:translateX(100px); opacity:0 } to { transform:translateX(0); opacity:1 } }`}</style>
    </div>
  );
}
