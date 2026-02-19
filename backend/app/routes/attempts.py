from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database import get_db
from app.models.models import ExamAttempt, Question, User, Exam

router = APIRouter()

@router.post("/submit")
def submit_exam(exam_id: int, user_id: int, answers: str, db: Session = Depends(get_db)):
    questions = db.query(Question).filter(Question.exam_id == exam_id).all()
    answer_map = {}
    for pair in answers.split(","):
        if ":" in pair:
            qid, ans = pair.split(":")
            answer_map[int(qid)] = ans.upper()
    score = sum(1 for q in questions if answer_map.get(q.id) == q.correct_answer)
    attempt = ExamAttempt(user_id=user_id, exam_id=exam_id, score=score, total_questions=len(questions))
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    correct_answers = {q.id: q.correct_answer for q in questions}
    return {
        "score": score,
        "total": len(questions),
        "percentage": round(score/len(questions)*100 if questions else 0),
        "correct_answers": correct_answers,
        "answer_map": answer_map
    }

@router.get("/leaderboard/{exam_id}")
def get_leaderboard(exam_id: int, db: Session = Depends(get_db)):
    attempts = db.query(ExamAttempt).filter(ExamAttempt.exam_id == exam_id).order_by(ExamAttempt.score.desc()).limit(10).all()
    result = []
    for i, a in enumerate(attempts):
        user = db.query(User).filter(User.id == a.user_id).first()
        result.append({
            "rank": i+1,
            "user_id": a.user_id,
            "full_name": user.full_name if user else "Unknown",
            "score": a.score,
            "total": a.total_questions,
            "percentage": round(a.score/a.total_questions*100 if a.total_questions else 0),
            "completed_at": a.completed_at
        })
    return result

@router.get("/history/{user_id}")
def get_history(user_id: int, db: Session = Depends(get_db)):
    attempts = db.query(ExamAttempt).filter(ExamAttempt.user_id == user_id).order_by(ExamAttempt.completed_at.desc()).all()
    result = []
    for a in attempts:
        exam = db.query(Exam).filter(Exam.id == a.exam_id).first()
        result.append({
            "id": a.id,
            "exam_title": exam.title if exam else "Unknown",
            "score": a.score,
            "total": a.total_questions,
            "percentage": round(a.score/a.total_questions*100 if a.total_questions else 0),
            "completed_at": a.completed_at
        })
    return result

@router.get("/all")
def get_all_attempts(db: Session = Depends(get_db)):
    attempts = db.query(ExamAttempt).order_by(ExamAttempt.completed_at.desc()).all()
    result = []
    for a in attempts:
        user = db.query(User).filter(User.id == a.user_id).first()
        exam = db.query(Exam).filter(Exam.id == a.exam_id).first()
        result.append({
            "id": a.id,
            "user_name": user.full_name if user else "Unknown",
            "exam_title": exam.title if exam else "Unknown",
            "score": a.score,
            "total": a.total_questions,
            "percentage": round(a.score/a.total_questions*100 if a.total_questions else 0),
            "completed_at": a.completed_at
        })
    return result
