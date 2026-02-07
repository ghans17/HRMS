import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeList from './pages/EmployeeList';
import AttendanceReport from './pages/AttendanceReport';
import './App.css';

import { RefreshProvider } from './context/RefreshContext';

function App() {
  return (
    <RefreshProvider>
      <Router>
        <div className="min-h-screen bg-sky-50 flex flex-col">
          <Navbar />
          <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<AttendanceReport />} />
              <Route path="/employees" element={<EmployeeList />} />
            </Routes>
          </main>
        </div>
      </Router>
    </RefreshProvider>
  );
}

export default App;
