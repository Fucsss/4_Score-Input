from fastapi import FastAPI

app = FastAPI()

@app.get("/admin/")
def admin_panel():
    return {"message": "This is the admin panel"}

@app.get("/student/")
def student_page():
    return {"message": "This is the student page"}
