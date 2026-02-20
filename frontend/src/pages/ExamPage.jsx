import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/client';

export default function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const submitExam = useCallback(async (finalAnswers) => {
    if (submitting) return;
    setSubmitting(true);
    const userId = localStorage.getItem('user_id');
    const answerStr = Object.entries(finalAnswers).map(([k,v]) => `${k}:${v}`).join(',');
    try {
      const res = await API.post(`/api/attempts/submit?exam_id=${examId}&user_id=${userId}&answers=${encodeURIComponent(answerStr)}`);
      setResult(res.data);
    } catch { setResult({ score:0, total:questions.length, percentage:0 }); }
  }, [examId, questions.length, submitting]);

  useEffect(() => {
    API.get(`/api/exams/${examId}`).then(r => { setExam(r.data); setTimeLeft(r.data.time_limit * 60); });
    API.get(`/api/questions/${examId}`).then(r => setQuestions(r.data));
  }, [examId]);

  useEffect(() => {
    if (!timeLeft || result) return;
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { submitExam(answers); return 0; } return p-1; }), 1000);
    return () => clearInterval(t);
  }, [timeLeft, result, submitExam, answers]);

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (!exam || !questions.length) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'40px', marginBottom:'16px' }}>⏳</div>
        <p style={{ color:'#64748b' }}>Loading exam...</p>
      </div>
    </div>
  );

  if (result) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #0f172a, #1e293b)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ background:'white', borderRadius:'24px', padding:'clamp(24px, 5vw, 48px)', maxWidth:'480px', width:'100%', textAlign:'center', boxShadow:'0 25px 50px rgba(0,0,0,0.3)' }}>
        <div style={{ fontSize:'clamp(48px, 10vw, 72px)', marginBottom:'16px' }}>{result.percentage >= 60 ? '🎉' : '😔'}</div>
        <h2 style={{ margin:'0 0 8px', fontSize:'clamp(20px, 4vw, 28px)', fontWeight:'700', color:'#0f172a' }}>
          {result.percentage >= 60 ? 'Congratulations!' : 'Better Luck Next Time'}
        </h2>
        <p style={{ margin:'0 0 28px', color:'#64748b' }}>{exam.title}</p>
        <div style={{ background: result.percentage >= 60 ? '#f0fdf4' : '#fff5f5', borderRadius:'16px', padding:'24px', marginBottom:'24px' }}>
          <p style={{ margin:'0 0 4px', fontSize:'clamp(36px, 8vw, 56px)', fontWeight:'800', color: result.percentage >= 60 ? '#16a34a' : '#dc2626' }}>{result.percentage}%</p>
          <p style={{ margin:'0 0 8px', fontSize:'16px', color:'#475569' }}>{result.score}/{result.total} correct</p>
          <span style={{ padding:'6px 20px', borderRadius:'20px', fontSize:'14px', fontWeight:'700', background: result.percentage >= 60 ? '#16a34a' : '#dc2626', color:'white' }}>
            {result.percentage >= 60 ? '✅ PASS' : '❌ FAIL'}
          </span>
        </div>
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/student')} style={{ flex:1, minWidth:'120px', padding:'14px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'white', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'600', fontSize:'15px' }}>
            Back to Home
          </button>
          <button onClick={() => navigate('/student/history')} style={{ flex:1, minWidth:'120px', padding:'14px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'600', fontSize:'15px' }}>
            View History
          </button>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  const options = ['A','B','C','D'];

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:'white', borderBottom:'1px solid #e2e8f0', padding:'12px 16px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:0 }}>
            <h2 style={{ margin:0, fontSize:'clamp(14px, 2.5vw, 18px)', fontWeight:'700', color:'#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{exam.title}</h2>
            <p style={{ margin:0, fontSize:'12px', color:'#64748b' }}>Question {current+1} of {questions.length}</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
            <div style={{ padding:'8px 16px', borderRadius:'10px', background: timeLeft < 60 ? '#fee2e2' : '#f0fdf4', border:`1px solid ${timeLeft < 60 ? '#fecaca' : '#bbf7d0'}` }}>
              <span style={{ fontSize:'clamp(14px, 2.5vw, 18px)', fontWeight:'700', color: timeLeft < 60 ? '#dc2626' : '#16a34a', fontFamily:'monospace' }}>⏱ {fmt(timeLeft)}</span>
            </div>
            <button onClick={() => setShowNav(!showNav)} style={{ padding:'8px 12px', background:'#6366f1', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'500' }}>
              {showNav ? 'Hide' : 'Questions'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex:1, maxWidth:'900px', margin:'0 auto', width:'100%', padding:'16px', display:'flex', gap:'16px' }}>
        {/* Question panel */}
        <div style={{ flex:1, minWidth:0 }}>
          {/* Progress bar */}
          <div style={{ height:'4px', background:'#e2e8f0', borderRadius:'2px', marginBottom:'20px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${((current+1)/questions.length)*100}%`, background:'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius:'2px', transition:'width 0.3s' }} />
          </div>

          {/* Question */}
          <div style={{ background:'white', borderRadius:'16px', padding:'clamp(16px, 3vw, 24px)', marginBottom:'16px', border:'1px solid #e2e8f0' }}>
            <p style={{ margin:0, fontSize:'clamp(14px, 2.5vw, 17px)', fontWeight:'600', color:'#0f172a', lineHeight:'1.6' }}>
              <span style={{ color:'#6366f1', marginRight:'8px' }}>Q{current+1}.</span>{q.text}
            </p>
          </div>

          {/* Options */}
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }}>
            {options.map(opt => {
              const val = q[`option_${opt.toLowerCase()}`];
              const selected = answers[q.id] === opt;
              return (
                <button key={opt} onClick={() => setAnswers({...answers, [q.id]: opt})} style={{
                  padding:'clamp(12px, 2.5vw, 16px)', borderRadius:'12px', textAlign:'left',
                  border: selected ? '2px solid #6366f1' : '2px solid #e2e8f0',
                  background: selected ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)' : 'white',
                  cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'12px'
                }}>
                  <span style={{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: selected ? '#6366f1' : '#f1f5f9', color: selected ? 'white' : '#64748b', fontWeight:'700', fontSize:'13px', flexShrink:0 }}>{opt}</span>
                  <span style={{ fontSize:'clamp(13px, 2vw, 15px)', color: selected ? '#3730a3' : '#374151', fontWeight: selected ? '500' : '400' }}>{val}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            <button onClick={() => setCurrent(Math.max(0, current-1))} disabled={current===0} style={{ flex:1, minWidth:'100px', padding:'12px', background:'#f1f5f9', color:'#475569', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'600', opacity: current===0 ? 0.4 : 1, fontSize:'14px' }}>← Previous</button>
            {current < questions.length-1
              ? <button onClick={() => setCurrent(current+1)} style={{ flex:1, minWidth:'100px', padding:'12px', background:'#6366f1', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>Next →</button>
              : <button onClick={() => { if(window.confirm(`Submit exam? Answered ${Object.keys(answers).length}/${questions.length} questions.`)) submitExam(answers); }} style={{ flex:1, minWidth:'100px', padding:'12px', background:'linear-gradient(135deg, #10b981, #059669)', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>Submit ✓</button>
            }
          </div>
        </div>

        {/* Question navigator - desktop always visible, mobile toggleable */}
        {(showNav) && (
          <div style={{ width:'180px', flexShrink:0 }} className="question-nav">
            <div style={{ background:'white', borderRadius:'14px', border:'1px solid #e2e8f0', padding:'14px', position:'sticky', top:'80px' }}>
              <p style={{ margin:'0 0 10px', fontSize:'12px', fontWeight:'600', color:'#64748b', textTransform:'uppercase' }}>Questions</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'6px' }}>
                {questions.map((qq, i) => (
                  <button key={qq.id} onClick={() => { setCurrent(i); setShowNav(false); }} style={{
                    padding:'6px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600',
                    background: i===current ? '#6366f1' : answers[qq.id] ? '#dcfce7' : '#f1f5f9',
                    color: i===current ? 'white' : answers[qq.id] ? '#166534' : '#64748b'
                  }}>{i+1}</button>
                ))}
              </div>
              <div style={{ marginTop:'12px', fontSize:'11px', color:'#94a3b8' }}>
                <span style={{ display:'block' }}>✅ {Object.keys(answers).length} answered</span>
                <span style={{ display:'block' }}>⭕ {questions.length - Object.keys(answers).length} remaining</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 769px) {
          .question-nav { display: block !important; }
        }
      `}</style>
    </div>
  );
}
