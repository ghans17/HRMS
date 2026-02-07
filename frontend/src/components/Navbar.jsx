import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AttendanceModal from './AttendanceModal';
import Button from './Button';

const Navbar = () => {
  const location = useLocation();
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-sky-700 text-white' : 'text-sky-100 hover:bg-sky-500 hover:text-white';
  };

  return (
    <nav className="bg-sky-600 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-xl tracking-wider">HRMS</span>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/employees"
                    className={`${isActive('/employees')} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                  >
                    Employees
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
               <Button onClick={() => setIsAttendanceModalOpen(true)} className="bg-sky-800 text-white hover:bg-sky-900 border-none">
                 Mark Attendance
               </Button>
            </div>
          </div>
        </div>
      </div>
      <AttendanceModal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
