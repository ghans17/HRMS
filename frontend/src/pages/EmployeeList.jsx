import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import employeeService from '../services/employeeService';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null); // For editing
  const [formData, setFormData] = useState({ full_name: '', email: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setCurrentEmployee(null);
    setFormData({ full_name: '', email: '', department: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    setFormData({ 
      full_name: employee.full_name, 
      email: employee.email, 
      department: employee.department 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.department) {
      alert('Please fill required fields');
      return;
    }

    try {
      if (currentEmployee) {
        await employeeService.update(currentEmployee.id, formData);
      } else {
        await employeeService.create(formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
      setFormData({ full_name: '', email: '', department: '' });
      setCurrentEmployee(null);
    } catch (err) {
      console.error(err);
      let errorMessage = 'Failed to save employee';
      const detail = err.response?.data?.detail;

      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail.map(error => error.msg).join(', ');
      } else if (detail && typeof detail === 'object') {
        errorMessage = JSON.stringify(detail);
      }
      
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.remove(id);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Full Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Department', accessor: 'department' },
    { header: 'Total Present', accessor: 'total_present' },
  ];

  const actions = (row) => (
    <div className="flex space-x-2">
      <button 
        onClick={() => navigate('/', { state: { employee_name: row.full_name } })} 
        className="text-green-600 hover:text-green-800 transition-colors"
        title="View Attendance"
      >
        <ClipboardList size={18} />
      </button>
      <button 
        onClick={() => openEditModal(row)} 
        className="text-blue-600 hover:text-blue-800 transition-colors"
        title="Edit"
      >
        <Pencil size={18} />
      </button>
      <button 
        onClick={() => handleDelete(row.id)} 
        className="text-red-600 hover:text-red-800 transition-colors"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={openAddModal}>Add Employee</Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table columns={columns} data={employees} actions={actions} />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentEmployee ? "Edit Employee" : "Add New Employee"}
        footer={
          <Button onClick={handleSubmit} type="submit" form="employee-form">
            {currentEmployee ? "Update" : "Save"}
          </Button>
        }
      >
        <form id="employee-form" onSubmit={handleSubmit}>
          <Input label="Full Name" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
          <Input label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} required />
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeList;
