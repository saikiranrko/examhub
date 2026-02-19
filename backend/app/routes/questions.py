from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from database import get_db
from app.models.models import Question

router = APIRouter()

@router.get("/{exam_id}")
def get_questions(exam_id: int, db: Session = Depends(get_db)):
    return db.query(Question).filter(Question.exam_id == exam_id).all()

@router.post("/")
def create_question(exam_id: int, text: str, option_a: str, option_b: str, option_c: str, option_d: str, correct_answer: str, db: Session = Depends(get_db)):
    q = Question(exam_id=exam_id, text=text, option_a=option_a, option_b=option_b, option_c=option_c, option_d=option_d, correct_answer=correct_answer.upper())
    db.add(q)
    db.commit()
    db.refresh(q)
    return q

@router.delete("/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)
    db.commit()
    return {"message": "Deleted"}
