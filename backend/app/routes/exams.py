from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database import get_db
from app.models.models import Exam, Question, ExamAttempt

router = APIRouter()

@router.get("/")
def get_exams(db: Session = Depends(get_db)):
    exams = db.query(Exam).filter(Exam.is_active == True).all()
    result = []
    for e in exams:
        q_count = db.query(Question).filter(Question.exam_id == e.id).count()
        attempts = db.query(ExamAttempt).filter(ExamAttempt.exam_id == e.id).count()
        result.append({
            "id": e.id, "title": e.title, "description": e.description,
            "time_limit": e.time_limit, "is_active": e.is_active,
            "created_at": e.created_at, "question_count": q_count,
            "attempt_count": attempts
        })
    return result

@router.get("/all")
def get_all_exams(db: Session = Depends(get_db)):
    exams = db.query(Exam).all()
    result = []
    for e in exams:
        q_count = db.query(Question).filter(Question.exam_id == e.id).count()
        attempts = db.query(ExamAttempt).filter(ExamAttempt.exam_id == e.id).count()
        result.append({
            "id": e.id, "title": e.title, "description": e.description,
            "time_limit": e.time_limit, "is_active": e.is_active,
            "created_at": e.created_at, "question_count": q_count,
            "attempt_count": attempts
        })
    return result

@router.post("/")
def create_exam(title: str, description: str = "", time_limit: int = 30, db: Session = Depends(get_db)):
    exam = Exam(title=title, description=description, time_limit=time_limit)
    db.add(exam)
    db.commit()
    db.refresh(exam)
    return exam

@router.put("/{exam_id}")
def update_exam(exam_id: int, title: str, description: str = "", time_limit: int = 30, is_active: bool = True, db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    exam.title = title
    exam.description = description
    exam.time_limit = time_limit
    exam.is_active = is_active
    db.commit()
    db.refresh(exam)
    return exam

@router.get("/{exam_id}")
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.delete("/{exam_id}")
def delete_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    db.query(ExamAttempt).filter(ExamAttempt.exam_id == exam_id).delete()
    db.query(Question).filter(Question.exam_id == exam_id).delete()
    db.delete(exam)
    db.commit()
    return {"message": "Deleted"}

@router.get("/stats/overview")
def get_stats(db: Session = Depends(get_db)):
    from app.models.models import User
    total_exams = db.query(Exam).count()
    total_students = db.query(User).filter(User.role == "student").count()
    total_attempts = db.query(ExamAttempt).count()
    attempts = db.query(ExamAttempt).all()
    avg_score = round(sum(a.score/a.total_questions*100 for a in attempts if a.total_questions > 0) / len(attempts), 1) if attempts else 0
    return {
        "total_exams": total_exams,
        "total_students": total_students,
        "total_attempts": total_attempts,
        "avg_score": avg_score
    }
