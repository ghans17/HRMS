import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import employeeService from '../services/employeeService';
import attendanceService from '../services/attendanceService';
import { useRefresh } from '../context/RefreshContext';
import { ChevronDown, X } from 'lucide-react';

const AttendanceModal = ({ isOpen, onClose }) => {
  const { triggerRefresh } = useRefresh();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  
  // Combobox state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(''); // Stores the actual ID
  const [displayValue, setDisplayValue] = useState(''); // Stores the text in input
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('PRESENT');
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      setSelectedEmployeeId('');
      setDisplayValue('');
      setIsDropdownOpen(false);
      setDate(new Date().toISOString().slice(0, 10));
      setStatus('PRESENT');
    }
  }, [isOpen]);

  // Filter employees when user types
  useEffect(() => {
    if (!displayValue || (selectedEmployeeId && displayValue)) {
      // If empty or if we just selected an item (ID is set), show all or relevant
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(
        employees.filter(emp => 
          emp.full_name.toLowerCase().includes(displayValue.toLowerCase()) || 
          emp.email.toLowerCase().includes(displayValue.toLowerCase())
        )
      );
    }
  }, [displayValue, employees, selectedEmployeeId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (err) {
      alert('Failed to fetch employees');
    }
  };

  const handleInputChange = (e) => {
    setDisplayValue(e.target.value);
    setSelectedEmployeeId(''); // Clear selection when typing
    setIsDropdownOpen(true);
  };

  const handleSelectEmployee = (emp) => {
    setSelectedEmployeeId(emp.id);
    setDisplayValue(`${emp.full_name} (${emp.email})`);
    setIsDropdownOpen(false);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setSelectedEmployeeId('');
    setDisplayValue('');
    setFilteredEmployees(employees);
    setIsDropdownOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      alert('Please select an employee from the list');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (date > today) {
      alert('Cannot mark attendance for future dates');
      return;
    }

    try {
      await attendanceService.mark({
        employee_id: parseInt(selectedEmployeeId),
        date: date,
        status: status,
      });
      alert('Attendance marked successfully');
      triggerRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || 'Failed to mark attendance';
      alert(detail);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mark Attendance"
      footer={
        <Button onClick={handleSubmit} type="submit" form="attendance-form">
          Submit
        </Button>
      }
    >
      <form id="attendance-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Select or search employee..."
              value={displayValue}
              onChange={handleInputChange}
              onFocus={() => setIsDropdownOpen(true)}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {displayValue ? (
                <button type="button" onClick={clearSelection} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredEmployees.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">No employees found</div>
              ) : (
                filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 cursor-pointer"
                    onClick={() => handleSelectEmployee(emp)}
                  >
                    <div className="font-medium">{emp.full_name}</div>
                    <div className="text-xs text-gray-500">{emp.email}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Input label="Date" type="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default AttendanceModal;
