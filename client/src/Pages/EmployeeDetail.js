import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeDetail = () => {
  const { id } = useParams(); // Get employee ID from URL params
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (e, employeeId) => {
    e.preventDefault();
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
      if (!confirmDelete) return;
  
      const response = await axios.delete(`http://localhost:5000/delete-employee/${employeeId}`);
      console.log('✅ Employee deleted successfully:', response.data);
      alert('Employee deleted successfully');
  
      // Redirect back to employee list or another page
      window.location.href = '/all-employees'; // Change this to your employee list route
    } catch (error) {
      console.error('❌ Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };
  


  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/employee-detail/${id}`);
        console.log(response.data);
        setEmployee(response.data.employee);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetail();
  }, [id]);

  if (loading) return <p className="text-center text-white">Loading employee details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-full mx-auto px-6 py-8 bg-transparent border border-2 border-gray-700 rounded-xl shadow-xl">
      {employee ? (
        <>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                className="w-40 h-40 rounded-full border-8 border-teal-400 shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                src="https://i.pravatar.cc/150?img=3"
                alt="Profile"
              />
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-wide">{employee.name}</h2>
            <p className="text-xl text-teal-200 mt-2">{employee.designation.role}</p>
          </div>

          <div className="space-y-8">
            <div className="bg-transparent p-8 rounded-lg shadow-md shadow-teal-500">
              <h3 className="text-3xl font-semibold text-teal-500 text-center">Basic Information</h3>
              <ul className="mt-4 text-lg text-gray-700 space-y-4 px-20">
                <li className='flex items-center justify-between'><strong className="text-teal-500 py-4 text-xl font-semibold">Email:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.email}</span></li>
                <li className='flex items-center justify-between'><strong className="text-teal-500 py-4">CNIC No:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.CNIC_No}</span></li>
                <li className='flex items-center justify-between'><strong className="text-teal-500 py-4">Address:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.address}</span></li>
                <li className='flex items-center justify-between'><strong className="text-teal-500 py-4">Joining Date:</strong> <span className='text-gray-500 text-xl font-semibold'>{new Date(employee.joining_date).toLocaleDateString()}</span> </li>
                <li className='flex items-center justify-between'><strong className="text-teal-500 py-4">In Time:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.in_time}</span></li>
                <li className='flex items-center justify-between'><strong className="text-teal-500 py-4">Out Time:</strong> <span className='text-gray-500 text-xl font-semibold'>{employee.out_time}</span> </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center flex items-center justify-between">
            <div>
            <Link
              to={`/update-employee/${employee._id}`}
              state={{ employee }}
            >
              <button
                className="inline-block px-8 py-2 text-lg text-black font-semibold bg-[#36BCBA] hover:bg-teal-600 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105"
              >
                Edit
              </button>
            </Link>
            </div>
            <div>
              <button
                onClick={(e) => handleDelete(e, employee._id)}
                className="inline-block px-8 py-2 text-lg font-semibold text-white bg-red-700 hover:bg-teal-600 rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>

        </>
      ) : (
        <p className="text-center text-white">No employee found</p>
      )}
    </div>
  );
};

export default EmployeeDetail;
