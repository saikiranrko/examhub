import { useState, useEffect } from 'react';
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
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    API.get(`/api/exams/${examId}`).then(r => {
      setExam(r.data);
      setTimeLeft(r.data.time_limit * 60);
    });
    API.get(`/api/questions/${examId}`).then(r => setQuestions(r.data));
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    const answerStr = Object.entries(answers).map(([qid, ans]) => `${qid}:${ans}`).join(',');
    const userId = localStorage.getItem('user_id') || 1;
    const res = await API.post(`/api/attempts/submit?exam_id=${examId}&user_id=${userId}&answers=${encodeURIComponent(answerStr)}`);
    setResult(res.data);
  };

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (result) return (
    <div style={styles.resultContainer}>
      <div style={styles.resultCard}>
        <h1>🎉 Exam Complete!</h1>
        <div style={styles.score}>
          <p style={styles.scoreNum}>{result.percentage}%</p>
          <p style={styles.scoreDetail}>{result.score} / {result.total} correct</p>
        </div>
        <p style={{color: result.percentage >= 60 ? 'green' : 'red', fontSize:'20px', fontWeight:'bold'}}>
          {result.percentage >= 60 ? '✅ PASSED' : '❌ FAILED'}
        </p>
        <button style={styles.btn} onClick={() => navigate('/student')}>Back to Dashboard</button>
      </div>
    </div>
  );

  if (!exam || questions.length === 0) return <div style={{padding:'40px'}}>Loading exam...</div>;

  const q = questions[current];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>{exam.title}</h2>
        <div style={{...styles.timer, color: timeLeft < 60 ? 'red' : 'white'}}>
          ⏱ {formatTime(timeLeft)}
        </div>
        <p style={{color:'white'}}>Question {current+1} of {questions.length}</p>
      </div>
      <div style={styles.body}>
        <div style={styles.qcard}>
          <h3 style={styles.qtext}>Q{current+1}. {q.text}</h3>
          <div style={styles.options}>
            {['A','B','C','D'].map(opt => (
              <button
                key={opt}
                style={{...styles.option, background: answers[q.id] === opt ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white', color: answers[q.id] === opt ? 'white' : '#333'}}
                onClick={() => setAnswers({...answers, [q.id]: opt})}
              >
                <strong>{opt}.</strong> {q[`option_${opt.toLowerCase()}`]}
              </button>
            ))}
          </div>
          <div style={styles.nav}>
            <button style={styles.navBtn} onClick={() => setCurrent(c => Math.max(0, c-1))} disabled={current===0}>← Previous</button>
            {current < questions.length-1
              ? <button style={styles.navBtn} onClick={() => setCurrent(c => c+1)}>Next →</button>
              : <button style={{...styles.navBtn, background:'green'}} onClick={handleSubmit}>Submit Exam ✅</button>
            }
          </div>
        </div>
        <div style={styles.qlist}>
          <h4>Questions</h4>
          {questions.map((q, i) => (
            <button key={q.id} style={{...styles.qnum, background: answers[q.id] ? '#667eea' : current===i ? '#eee' : 'white', color: answers[q.id] ? 'white' : '#333'}} onClick={() => setCurrent(i)}>
              {i+1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', flexDirection:'column', height:'100vh', fontFamily:'sans-serif' },
  header: { background:'linear-gradient(135deg, #1a1a2e, #16213e)', color:'white', padding:'16px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  timer: { fontSize:'28px', fontWeight:'bold', background:'rgba(255,255,255,0.1)', padding:'8px 20px', borderRadius:'8px' },
  body: { display:'flex', flex:1, padding:'32px', gap:'24px', background:'#f5f7fa', overflowY:'auto' },
  qcard: { flex:1, background:'white', padding:'32px', borderRadius:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  qtext: { fontSize:'20px', marginBottom:'24px' },
  options: { display:'flex', flexDirection:'column', gap:'12px', marginBottom:'32px' },
  option: { padding:'14px 20px', borderRadius:'10px', border:'2px solid #eee', cursor:'pointer', textAlign:'left', fontSize:'15px', transition:'all 0.2s' },
  nav: { display:'flex', justifyContent:'space-between' },
  navBtn: { padding:'10px 24px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
  qlist: { width:'160px', background:'white', padding:'20px', borderRadius:'16px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', gap:'8px' },
  qnum: { padding:'8px', borderRadius:'8px', border:'1px solid #eee', cursor:'pointer', fontWeight:'bold' },
  resultContainer: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'linear-gradient(135deg, #1a1a2e, #16213e)' },
  resultCard: { background:'white', padding:'48px', borderRadius:'20px', textAlign:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' },
  score: { margin:'24px 0' },
  scoreNum: { fontSize:'72px', fontWeight:'bold', color:'#667eea', margin:0 },
  scoreDetail: { fontSize:'20px', color:'#888' },
  btn: { marginTop:'24px', padding:'12px 32px', background:'linear-gradient(135deg, #667eea, #764ba2)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'16px' }
};
