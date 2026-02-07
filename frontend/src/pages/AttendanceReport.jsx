import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import attendanceService from '../services/attendanceService';
import employeeService from '../services/employeeService';
import { useRefresh } from '../context/RefreshContext';

const AttendanceReport = () => {
  const { refreshKey } = useRefresh();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    employee_name: location.state?.employee_name || '',
    department: '',
    attendance_date: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
    fetchEmployees();
  }, [refreshKey]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Remove empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const response = await attendanceService.getAll(activeFilters);
      setRecords(response.data);
    } catch (err) {
      console.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const columns = [
    { header: 'Employee Name', render: (row) => row.employee?.full_name || 'N/A' },
    { header: 'Email', render: (row) => row.employee?.email || 'N/A' },
    { header: 'Department', render: (row) => row.employee?.department || 'N/A' },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', render: (row) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        row.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {row.status}
      </span>
    )},
  ];

  const clearFilters = () => {
    setFilters({
      employee_name: '',
      department: '',
      attendance_date: '',
      status: '',
    });
    attendanceService.getAll({}).then(response => {
        setRecords(response.data);
    }).catch(err => {
        console.error('Failed to fetch records');
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
            <select
              name="employee_name"
              value={filters.employee_name}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.full_name}>
                  {emp.full_name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Department" name="department" value={filters.department} onChange={handleFilterChange} placeholder="Search dept..." />
          <Input label="Date" type="date" name="attendance_date" value={filters.attendance_date} onChange={handleFilterChange} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="secondary" onClick={clearFilters}>Clear</Button>
          <Button onClick={fetchRecords}>Apply Filters</Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={records} />
      )}
    </div>
  );
};

export default AttendanceReport;
