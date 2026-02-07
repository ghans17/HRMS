# HR Management System (HRMS)

A modern, full-stack Human Resource Management System designed to streamline employee data management and attendance tracking. This application provides a user-friendly interface for HR administrators to manage employee records, mark attendance, and view daily reports.

## 🚀 Features

-   **Dashboard**: Real-time overview of daily attendance with filtering by date, department, and status.
-   **Employee Management**: Add, update, view, and delete employee records.
-   **Attendance Tracking**:
    -   Mark attendance via a convenient modal.
    -   Searchable employee dropdown for quick selection.
    -   Prevent future date marking.
    -   Update existing attendance records (Upsert support).
-   **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS
-   **Routing**: React Router DOM
-   **State Management**: Context API (for refresh triggers)
-   **HTTP Client**: Axios
-   **Icons**: Lucide React

### Backend
-   **Framework**: FastAPI (Python)
-   **Database**: SQLite (via SQLAlchemy ORM)
-   **Data Validation**: Pydantic
-   **Server**: Uvicorn

## 🏃‍♂️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
-   Node.js (v14+ recommended)
-   Python (v3.8+)
-   Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HRMS
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (ensure you have a requirements.txt, if not: pip install fastapi uvicorn sqlalchemy pydantic alembic)
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```
The backend API will be available at `http://localhost:8000`.
API Documentation (Swagger UI): `http://localhost:8000/docs`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the React app.

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```
The application will run at `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
HRMS/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/      # API Routes
│   │   ├── core/     # Config & Database
│   │   ├── dao/      # Data Access Objects
│   │   ├── models/   # SQLAlchemy Models
│   │   ├── schemas/  # Pydantic Schemas
│   │   └── services/ # Business Logic
│   └── main.py       # Entry point
│
└── frontend/         # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Global State (Context API)
    │   ├── pages/      # Page views
    │   └── services/   # API service calls
```
