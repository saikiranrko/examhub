from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from app.routes import auth, exams, questions, attempts

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ExamHub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(exams.router, prefix="/api/exams", tags=["Exams"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])
app.include_router(attempts.router, prefix="/api/attempts", tags=["Attempts"])

@app.get("/")
def root():
    return {"status": "ExamHub API running"}
