from fastapi import FastAPI
from app.core.logger import log_event
from app.api.v1.employee_router import router as employee_router
from app.api.v1.attendance_router import router as attendance_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HRMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_router, prefix="/api/v1")
app.include_router(attendance_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
