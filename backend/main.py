from fastapi import FastAPI
from app.core.logger import log_event

app = FastAPI(title="HRMS API")

@app.get("/")
def read_root():
    log_event("Root endpoint accessed", "info")
    return {"message": "Welcome to HRMS API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
