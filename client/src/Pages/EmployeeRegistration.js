import React, { useState } from 'react';
import axios from 'axios';
import ImageUpload from '../Components/ImageUpload';

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    in_time: '',
    out_time: '',
    joining_date: '',
    CNIC_No: '',
    designation: '',
    role_company: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/register-employee', formData);
      console.log('Form submitted successfully:', response.data);
      alert('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };
  return (
    <div className="max-w-full mx-auto px-6 rounded shadow-md">

      <h2 className="text-3xl font-bold mb-6 text-gray-200">Employee Registration</h2>
      <p className='text-gray-500 -mt-4 mb-4'>Create an Employee</p>
      <form
        className="space-y-6 border border-2 border-gray-800 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >

        {/* Full-width fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] rounded bg-transparent px-4 py-2 outline-none text-[#36BCBA]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] rounded bg-transparent px-4 py-2 outline-none text-[#36BCBA]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] rounded bg-transparent px-4 py-2 outline-none text-[#36BCBA]"
            />
          </div>
        </div>

        {/* Two-column fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">In Time</label>
            <input
              type="time"
              name="in_time"
              value={formData.in_time}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Out Time</label>
            <input
              type="time"
              name="out_time"
              value={formData.out_time}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CNIC Last 6 Digits</label>
            <input
              type="text"
              name="CNIC_No"
              placeholder="This is Autocomplete Field"
              value={formData.CNIC_No}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-transparent text-[#36BCBA] rounded px-4 py-2 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-gray-800 text-[#36BCBA] rounded px-4 py-2 outline-none appearance-none"
            >
              <option value="" disabled>
                Select Designation
              </option>
              <option value="Admin">Admin</option>
              <option value="Developer">Developer</option>
              <option value="Sales">Sales</option>
              <option value="IT">IT</option>
              <option value="Designer">Designer</option>
              <option value="Agency">Agency</option>
              <option value="Lead">Lead</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              name="role_company"
              value={formData.role_company}
              onChange={handleChange}
              className="w-full border border-[#36BCBA] bg-gray-800 text-[#36BCBA] rounded px-4 py-2 outline-none appearance-none"
            >
              <option value="" disabled>
               Role
              </option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-6">

          <button
            type="submit"
            className="bg-[#36BCBA] hover:bg-blue-900 font-bold text-black py-2 px-8 rounded-full shadow"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default EmployeeRegistration;