import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ToastContainer, { useToast } from '../../components/Toast';
import API from '../../api/client';

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', time_limit:30 });
  const [qForm, setQForm] = useState({ text:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_answer:'A' });
  const { toasts, success, error } = useToast();

  const fetchExams = () => API.get('/api/exams/all').then(r => setExams(r.data));
  useEffect(() => { fetchExams(); }, []);

  const fetchQuestions = (examId) => {
    API.get(`/api/questions/${examId}`).then(r => setQuestions(r.data));
    setSelectedExam(examId);
  };

  const saveExam = async (e) => {
    e.preventDefault();
    try {
      if (editExam) {
        await API.put(`/api/exams/${editExam.id}?title=${encodeURIComponent(form.title)}&description=${encodeURIComponent(form.description)}&time_limit=${form.time_limit}`);
        success('Exam updated!');
      } else {
        await API.post(`/api/exams/?title=${encodeURIComponent(form.title)}&description=${encodeURIComponent(form.description)}&time_limit=${form.time_limit}`);
        success('Exam created!');
      }
      setForm({ title:'', description:'', time_limit:30 });
      setShowForm(false); setEditExam(null);
      fetchExams();
    } catch { error('Failed to save exam'); }
  };

  const deleteExam = async (id) => {
    if (!window.confirm('Delete this exam and all its questions?')) return;
    await API.delete(`/api/exams/${id}`);
    success('Exam deleted');
    if (selectedExam === id) { setSelectedExam(null); setQuestions([]); }
    fetchExams();
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/api/questions/?exam_id=${selectedExam}&text=${encodeURIComponent(qForm.text)}&option_a=${encodeURIComponent(qForm.option_a)}&option_b=${encodeURIComponent(qForm.option_b)}&option_c=${encodeURIComponent(qForm.option_c)}&option_d=${encodeURIComponent(qForm.option_d)}&correct_answer=${qForm.correct_answer}`);
      setQForm({ text:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_answer:'A' });
      success('Question added!');
      fetchQuestions(selectedExam);
    } catch { error('Failed to add question'); }
  };

  const deleteQuestion = async (qId) => {
    await API.delete(`/api/questions/${qId}`);
    success('Question deleted');
    fetchQuestions(selectedExam);
  };

  const inp = { padding:'10px 14px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'14px', width:'100%', boxSizing:'border-box', outline:'none' };

  return (
    <div style={{ display:'flex', background:'#f8fafc', minHeight:'100vh' }}>
      <Sidebar role="admin" />
      <ToastContainer toasts={toasts} />
      <div style={{ marginLeft:'240px', flex:1, padding:'32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
          <div>
            <h1 style={{ margin:'0 0 4px', fontSize:'24px', fontWeight:'700', color:'#0f172a' }}>Exams</h1>
            <p style={{ margin:0, color:'#64748b', fontSize:'14px' }}>{exams.length} exams total</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditExam(null); setForm({ title:'', description:'', time_limit:30 }); }} style={{ padding:'10px 20px', background:'#6366f1', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
            + New Exam
          </button>
        </div>

        {showForm && (
          <div style={{ background:'white', padding:'24px', borderRadius:'14px', border:'1px solid #e2e8f0', marginBottom:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin:'0 0 20px', color:'#0f172a' }}>{editExam ? 'Edit Exam' : 'Create New Exam'}</h3>
            <form onSubmit={saveExam}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr', gap:'12px', marginBottom:'16px' }}>
                <input style={inp} placeholder="Exam title *" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required />
                <input style={inp} placeholder="Description" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
                <input style={inp} type="number" placeholder="Minutes" value={form.time_limit} onChange={e => setForm({...form, time_limit:e.target.value})} />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="submit" style={{ padding:'10px 24px', background:'#6366f1', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' }}>Save Exam</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding:'10px 24px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:'8px', cursor:'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px', marginBottom:'32px' }}>
          {exams.map(e => (
            <div key={e.id} style={{ background:'white', padding:'20px', borderRadius:'14px', border: selectedExam===e.id ? '2px solid #6366f1' : '1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                <h3 style={{ margin:0, fontSize:'15px', fontWeight:'600', color:'#0f172a' }}>{e.title}</h3>
                <span style={{ padding:'3px 8px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', background: e.is_active ? '#dcfce7' : '#fee2e2', color: e.is_active ? '#166534' : '#991b1b' }}>
                  {e.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p style={{ margin:'0 0 12px', fontSize:'13px', color:'#64748b' }}>{e.description || 'No description'}</p>
              <div style={{ display:'flex', gap:'12px', fontSize:'12px', color:'#94a3b8', marginBottom:'16px' }}>
                <span>⏱ {e.time_limit} mins</span>
                <span>❓ {e.question_count} questions</span>
                <span>👤 {e.attempt_count} attempts</span>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={() => fetchQuestions(e.id)} style={{ flex:1, padding:'8px', background:'#6366f1', color:'white', border:'none', borderRadius:'7px', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>Manage Questions</button>
                <button onClick={() => { setEditExam(e); setForm({ title:e.title, description:e.description, time_limit:e.time_limit }); setShowForm(true); }} style={{ padding:'8px 12px', background:'#f8fafc', color:'#475569', border:'1px solid #e2e8f0', borderRadius:'7px', cursor:'pointer', fontSize:'13px' }}>✏️</button>
                <button onClick={() => deleteExam(e.id)} style={{ padding:'8px 12px', background:'#fff5f5', color:'#ef4444', border:'1px solid #fecaca', borderRadius:'7px', cursor:'pointer', fontSize:'13px' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>

        {selectedExam && (
          <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9', background:'#f8fafc' }}>
              <h3 style={{ margin:0, fontSize:'16px', fontWeight:'600', color:'#0f172a' }}>
                Questions for: {exams.find(e => e.id === selectedExam)?.title} ({questions.length})
              </h3>
            </div>
            <div style={{ padding:'24px' }}>
              <form onSubmit={addQuestion} style={{ background:'#f8fafc', padding:'20px', borderRadius:'12px', marginBottom:'20px', border:'1px solid #e2e8f0' }}>
                <h4 style={{ margin:'0 0 16px', color:'#0f172a' }}>Add New Question</h4>
                <textarea style={{ ...inp, resize:'vertical', marginBottom:'12px', minHeight:'60px' }} placeholder="Question text *" value={qForm.text} onChange={e => setQForm({...qForm, text:e.target.value})} required />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                  {['a','b','c','d'].map(opt => (
                    <input key={opt} style={inp} placeholder={`Option ${opt.toUpperCase()} *`} value={qForm[`option_${opt}`]} onChange={e => setQForm({...qForm, [`option_${opt}`]:e.target.value})} required />
                  ))}
                </div>
                <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <label style={{ fontSize:'14px', fontWeight:'500', color:'#475569' }}>Correct Answer:</label>
                    <select style={{ ...inp, width:'auto' }} value={qForm.correct_answer} onChange={e => setQForm({...qForm, correct_answer:e.target.value})}>
                      <option>A</option><option>B</option><option>C</option><option>D</option>
                    </select>
                  </div>
                  <button type="submit" style={{ padding:'10px 20px', background:'#6366f1', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' }}>+ Add Question</button>
                </div>
              </form>

              {questions.map((q, i) => (
                <div key={q.id} style={{ padding:'16px', borderRadius:'10px', border:'1px solid #e2e8f0', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:'0 0 8px', fontWeight:'600', color:'#0f172a', fontSize:'14px' }}>Q{i+1}. {q.text}</p>
                    <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
                      {['a','b','c','d'].map(opt => (
                        <span key={opt} style={{ fontSize:'13px', color: q.correct_answer === opt.toUpperCase() ? '#16a34a' : '#64748b', fontWeight: q.correct_answer === opt.toUpperCase() ? '700' : '400' }}>
                          {q.correct_answer === opt.toUpperCase() ? '✅' : '○'} {opt.toUpperCase()}: {q[`option_${opt}`]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => deleteQuestion(q.id)} style={{ padding:'6px 10px', background:'#fff5f5', color:'#ef4444', border:'1px solid #fecaca', borderRadius:'6px', cursor:'pointer', fontSize:'12px', marginLeft:'12px' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
