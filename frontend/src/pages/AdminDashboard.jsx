import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function AdminDashboard() {
  const [tab, setTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('A');
  const navigate = useNavigate();

  const fetchExams = () => API.get('/api/exams/').then(r => setExams(r.data));
  const fetchUsers = () => API.get('/api/auth/users').then(r => setUsers(r.data));

  useEffect(() => { fetchExams(); fetchUsers(); }, []);

  const fetchQuestions = (examId) => {
    API.get(`/api/questions/${examId}`).then(r => setQuestions(r.data));
    setSelectedExam(examId);
  };

  const createExam = async (e) => {
    e.preventDefault();
    await API.post(`/api/exams/?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&time_limit=${timeLimit}`);
    setTitle(''); setDescription(''); setTimeLimit(30);
    fetchExams();
  };

  const deleteExam = async (examId) => {
    if (!window.confirm('Delete this exam?')) return;
    await API.delete(`/api/exams/${examId}`);
    if (selectedExam === examId) { setSelectedExam(null); setQuestions([]); }
    fetchExams();
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/api/auth/users/${userId}`);
    fetchUsers();
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    await API.post(`/api/questions/?exam_id=${selectedExam}&text=${encodeURIComponent(qText)}&option_a=${encodeURIComponent(optA)}&option_b=${encodeURIComponent(optB)}&option_c=${encodeURIComponent(optC)}&option_d=${encodeURIComponent(optD)}&correct_answer=${correct}`);
    setQText(''); setOptA(''); setOptB(''); setOptC(''); setOptD('');
    fetchQuestions(selectedExam);
  };

  const deleteQuestion = async (qId) => {
    await API.delete(`/api/questions/${qId}`);
    fetchQuestions(selectedExam);
  };

  const navItems = [
    { id:'exams', label:'📋 Exams' },
    { id:'users', label:'👥 Users' },
  ];

  return (
    <div style={{display:'flex', height:'100vh', fontFamily:'sans-serif'}}>
      <div style={{width:'220px', background:'linear-gradient(180deg, #1a1a2e, #16213e)', color:'white', padding:'24px', display:'flex', flexDirection:'column'}}>
        <h2 style={{marginBottom:'4px'}}>📝 ExamHub</h2>
        <p style={{color:'#aaa', fontSize:'12px', marginBottom:'32px'}}>Admin Panel</p>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{padding:'10px 14px', marginBottom:'8px', background: tab===n.id ? 'rgba(102,126,234,0.4)' : 'rgba(255,255,255,0.05)', color:'white', border: tab===n.id ? '1px solid #667eea' : '1px solid transparent', borderRadius:'8px', cursor:'pointer', textAlign:'left', fontSize:'14px'}}>
            {n.label}
          </button>
        ))}
        <button style={{marginTop:'auto', padding:'10px', background:'rgba(255,255,255,0.1)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer'}} onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
      </div>

      <div style={{flex:1, padding:'32px', background:'#f5f7fa', overflowY:'auto'}}>

        {tab === 'exams' && (
          <>
            <h2 style={{marginBottom:'24px'}}>📋 Manage Exams</h2>
            <form onSubmit={createExam} style={{display:'flex', gap:'12px', marginBottom:'28px', flexWrap:'wrap', background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <input style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', flex:2, minWidth:'150px'}} placeholder="Exam title" value={title} onChange={e => setTitle(e.target.value)} required />
              <input style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', flex:2, minWidth:'150px'}} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              <input style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', width:'80px'}} type="number" placeholder="Mins" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} />
              <button style={{padding:'10px 20px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}} type="submit">+ Create</button>
            </form>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'16px', marginBottom:'32px'}}>
              {exams.map(e => (
                <div key={e.id} style={{background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', border: selectedExam===e.id ? '2px solid #667eea' : '2px solid transparent'}}>
                  <h3 style={{marginBottom:'8px'}}>{e.title}</h3>
                  <p style={{color:'#888', fontSize:'13px', marginBottom:'4px'}}>{e.description}</p>
                  <p style={{color:'#667eea', fontSize:'13px', marginBottom:'16px'}}>⏱ {e.time_limit} mins</p>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button style={{flex:1, padding:'8px', background:'#667eea', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px'}} onClick={() => fetchQuestions(e.id)}>Questions</button>
                    <button style={{padding:'8px 12px', background:'#fff5f5', color:'#e53e3e', border:'1px solid #fed7d7', borderRadius:'6px', cursor:'pointer', fontSize:'13px'}} onClick={() => deleteExam(e.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>

            {selectedExam && (
              <>
                <h3 style={{marginBottom:'16px'}}>Add Question to Exam #{selectedExam}</h3>
                <form onSubmit={addQuestion} style={{background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', marginBottom:'24px'}}>
                  <input style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', marginBottom:'12px', boxSizing:'border-box'}} placeholder="Question text" value={qText} onChange={e => setQText(e.target.value)} required />
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px'}}>
                    <input style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px'}} placeholder="Option A" value={optA} onChange={e => setOptA(e.target.value)} required />
                    <input style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px'}} placeholder="Option B" value={optB} onChange={e => setOptB(e.target.value)} required />
                    <input style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px'}} placeholder="Option C" value={optC} onChange={e => setOptC(e.target.value)} required />
                    <input style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px'}} placeholder="Option D" value={optD} onChange={e => setOptD(e.target.value)} required />
                  </div>
                  <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                    <select style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px'}} value={correct} onChange={e => setCorrect(e.target.value)}>
                      <option>A</option><option>B</option><option>C</option><option>D</option>
                    </select>
                    <button style={{padding:'10px 20px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}} type="submit">+ Add Question</button>
                  </div>
                </form>

                <h4 style={{marginBottom:'12px'}}>Questions ({questions.length})</h4>
                {questions.map((q, i) => (
                  <div key={q.id} style={{background:'white', padding:'16px', borderRadius:'10px', marginBottom:'10px', boxShadow:'0 2px 6px rgba(0,0,0,0.04)', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                      <p style={{fontWeight:'600', marginBottom:'6px'}}>Q{i+1}: {q.text}</p>
                      <p style={{color:'#666', fontSize:'13px'}}>A: {q.option_a} | B: {q.option_b} | C: {q.option_c} | D: {q.option_d}</p>
                      <p style={{color:'green', fontSize:'13px', marginTop:'4px'}}>✅ Correct: {q.correct_answer}</p>
                    </div>
                    <button style={{padding:'6px 10px', background:'#fff5f5', color:'#e53e3e', border:'1px solid #fed7d7', borderRadius:'6px', cursor:'pointer'}} onClick={() => deleteQuestion(q.id)}>🗑</button>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {tab === 'users' && (
          <>
            <h2 style={{marginBottom:'24px'}}>👥 Manage Users</h2>
            <div style={{background:'white', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white'}}>
                    <th style={{padding:'14px 16px', textAlign:'left'}}>Name</th>
                    <th style={{padding:'14px 16px', textAlign:'left'}}>Email</th>
                    <th style={{padding:'14px 16px', textAlign:'left'}}>Role</th>
                    <th style={{padding:'14px 16px', textAlign:'left'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                      <td style={{padding:'14px 16px'}}>{u.full_name}</td>
                      <td style={{padding:'14px 16px', color:'#666'}}>{u.email}</td>
                      <td style={{padding:'14px 16px'}}>
                        <span style={{padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', background: u.role==='admin' ? '#fef3c7' : '#e8f0fe', color: u.role==='admin' ? '#d97706' : '#1a73e8'}}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{padding:'14px 16px'}}>
                        {u.role !== 'admin' && (
                          <button style={{padding:'6px 12px', background:'#fff5f5', color:'#e53e3e', border:'1px solid #fed7d7', borderRadius:'6px', cursor:'pointer', fontSize:'13px'}} onClick={() => deleteUser(u.id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
