import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/client';

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', time_limit:30 });
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qForm, setQForm] = useState({ text:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_answer:'A' });
  const [loading, setLoading] = useState(false);

  const fetchExams = () => API.get('/api/exams/').then(r => setExams(r.data));
  useEffect(() => { fetchExams(); }, []);

  const fetchQuestions = (examId) => API.get(`/api/questions/${examId}`).then(r => setQuestions(r.data));

  const saveExam = async () => {
    setLoading(true);
    try {
      if (editing) {
        await API.put(`/api/exams/${editing}`, form);
      } else {
        await API.post(`/api/exams/?title=${encodeURIComponent(form.title)}&description=${encodeURIComponent(form.description)}&time_limit=${form.time_limit}`);
      }
      fetchExams(); setShowForm(false); setEditing(null); setForm({ title:'', description:'', time_limit:30 });
    } finally { setLoading(false); }
  };

  const deleteExam = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    await API.delete(`/api/exams/${id}`);
    fetchExams();
    if (selectedExam?.id === id) setSelectedExam(null);
  };

  const addQuestion = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ ...qForm, exam_id: selectedExam.id });
      await API.post(`/api/questions/?${p}`);
      fetchQuestions(selectedExam.id);
      setQForm({ text:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_answer:'A' });
    } finally { setLoading(false); }
  };

  const deleteQuestion = async (qId) => {
    await API.delete(`/api/questions/${qId}`);
    fetchQuestions(selectedExam.id);
  };

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="admin" />
      <div className="main-content" style={{ marginLeft:'220px', flex:1, padding:'24px', minWidth:0, overflowX:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ margin:'0 0 4px', fontSize:'clamp(18px,3vw,24px)', fontWeight:'700', color:'#0f172a' }}>Exams</h1>
            <p style={{ margin:0, color:'#64748b', fontSize:'14px' }}>{exams.length} total exams</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title:'', description:'', time_limit:30 }); }} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'600', fontSize:'14px', whiteSpace:'nowrap' }}>
            + New Exam
          </button>
        </div>

        {/* Exam Form Modal */}
        {showForm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
            <div style={{ background:'white', borderRadius:'16px', padding:'24px', width:'100%', maxWidth:'480px' }}>
              <h3 style={{ margin:'0 0 20px', fontSize:'18px', fontWeight:'700', color:'#0f172a' }}>{editing ? 'Edit Exam' : 'New Exam'}</h3>
              {[
                { label:'Title', key:'title', type:'text' },
                { label:'Description', key:'description', type:'text' },
                { label:'Time Limit (minutes)', key:'time_limit', type:'number' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom:'14px' }}>
                  <label style={{ display:'block', marginBottom:'6px', fontSize:'13px', fontWeight:'500', color:'#374151' }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]: f.type==='number' ? parseInt(e.target.value) : e.target.value})}
                    style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box' }} />
                </div>
              ))}
              <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                <button onClick={() => setShowForm(false)} style={{ flex:1, padding:'11px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:'600' }}>Cancel</button>
                <button onClick={saveExam} disabled={loading} style={{ flex:1, padding:'11px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', border:'none', borderRadius:'9px', cursor:'pointer', fontWeight:'600' }}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns: selectedExam ? '1fr' : 'repeat(auto-fill, minmax(280px,1fr))', gap:'16px', marginBottom:'24px' }}>
          {!selectedExam && exams.map(e => (
            <div key={e.id} style={{ background:'white', padding:'20px', borderRadius:'14px', border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                <h3 style={{ margin:0, fontSize:'15px', fontWeight:'600', color:'#0f172a', flex:1, marginRight:'8px' }}>{e.title}</h3>
                <span style={{ padding:'3px 10px', background:'#dcfce7', color:'#166534', borderRadius:'20px', fontSize:'11px', fontWeight:'600', whiteSpace:'nowrap' }}>Active</span>
              </div>
              <p style={{ margin:'0 0 12px', fontSize:'13px', color:'#64748b' }}>{e.description || 'No description'}</p>
              <div style={{ display:'flex', gap:'12px', marginBottom:'14px', fontSize:'12px', color:'#64748b' }}>
                <span>⏱ {e.time_limit} mins</span>
                <span>❓ {e.question_count || 0} questions</span>
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <button onClick={() => { setSelectedExam(e); fetchQuestions(e.id); }} style={{ flex:1, minWidth:'80px', padding:'9px', background:'#eef2ff', color:'#6366f1', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>Questions</button>
                <button onClick={() => { setEditing(e.id); setForm({ title:e.title, description:e.description||'', time_limit:e.time_limit }); setShowForm(true); }} style={{ flex:1, minWidth:'80px', padding:'9px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>Edit</button>
                <button onClick={() => deleteExam(e.id)} style={{ padding:'9px 12px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* Questions Panel */}
        {selectedExam && (
          <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
              <div>
                <h2 style={{ margin:0, fontSize:'16px', fontWeight:'700', color:'#0f172a' }}>{selectedExam.title} — Questions</h2>
                <p style={{ margin:0, fontSize:'13px', color:'#64748b' }}>{questions.length} questions</p>
              </div>
              <button onClick={() => setSelectedExam(null)} style={{ padding:'8px 16px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' }}>← Back to Exams</button>
            </div>

            {/* Add Question Form */}
            <div style={{ padding:'20px', borderBottom:'1px solid #f1f5f9', background:'#f8fafc' }}>
              <h3 style={{ margin:'0 0 14px', fontSize:'14px', fontWeight:'600', color:'#374151' }}>Add Question</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'10px' }}>
                <input placeholder="Question text" value={qForm.text} onChange={e => setQForm({...qForm, text:e.target.value})}
                  style={{ padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'14px' }} />
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:'10px' }}>
                  {['a','b','c','d'].map(opt => (
                    <input key={opt} placeholder={`Option ${opt.toUpperCase()}`} value={qForm[`option_${opt}`]} onChange={e => setQForm({...qForm, [`option_${opt}`]:e.target.value})}
                      style={{ padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'14px' }} />
                  ))}
                </div>
                <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
                  <select value={qForm.correct_answer} onChange={e => setQForm({...qForm, correct_answer:e.target.value})}
                    style={{ padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:'8px', fontSize:'14px', flex:1, minWidth:'140px' }}>
                    {['A','B','C','D'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <button onClick={addQuestion} disabled={loading} style={{ flex:1, minWidth:'120px', padding:'10px 20px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
                    {loading ? 'Adding...' : '+ Add Question'}
                  </button>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div style={{ padding:'16px 20px' }}>
              {questions.map((q, i) => (
                <div key={q.id} style={{ padding:'14px', borderRadius:'10px', border:'1px solid #f1f5f9', marginBottom:'10px', background:'#fafafa' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
                    <p style={{ margin:'0 0 10px', fontSize:'14px', fontWeight:'600', color:'#0f172a', flex:1 }}><span style={{ color:'#6366f1' }}>Q{i+1}.</span> {q.text}</p>
                    <button onClick={() => deleteQuestion(q.id)} style={{ padding:'6px 10px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px', flexShrink:0 }}>🗑</button>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:'6px' }}>
                    {['A','B','C','D'].map(opt => (
                      <div key={opt} style={{ padding:'6px 10px', borderRadius:'6px', fontSize:'13px', background: q.correct_answer===opt ? '#dcfce7' : '#f1f5f9', color: q.correct_answer===opt ? '#166534' : '#475569', fontWeight: q.correct_answer===opt ? '600' : '400' }}>
                        {opt}. {q[`option_${opt.toLowerCase()}`]} {q.correct_answer===opt && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {questions.length === 0 && <p style={{ textAlign:'center', color:'#94a3b8', padding:'24px' }}>No questions yet. Add your first question above!</p>}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding: 16px !important; padding-top: 60px !important; }
        }
      `}</style>
    </div>
  );
}
