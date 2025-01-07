import React, { useState, useEffect } from 'react';
import { CiMenuKebab } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import { RiPresentationFill } from "react-icons/ri";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaves, setLeaves] = useState(0); // Ensure leaves state is declared
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const atteendanceList = async () => {
      try {
        const response = await axios.get('http://localhost:5000/attendance/summary');
        const attendance = response.data;
  
        const totalEmployees = attendance[0]?.totalEmployees || 0;
        const attendanceDataLength = attendance.length;
        const leaves = totalEmployees - attendanceDataLength;
        console.log('Total Employees:', totalEmployees);
        console.log('Attendance Data Length:', attendanceDataLength);
        console.log('Leaves:', leaves);
  
        setAttendanceData(attendance);
        setTotalEmployees(totalEmployees);
        setLeaves(leaves);
      } catch (err) {
        setError(err.response?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
  
    atteendanceList();
  }, []);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-full mx-auto px-6 rounded shadow-md">
      <h2 className='text-gray-100 text-3xl font-bold'>Dashboard</h2>
      <p className='text-gray-500 mt-2 mb-4'>See all details at once place.</p>

      <div className="border border-2 border-gray-700 bg-gray-900 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="max-w-full p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-teal-600 p-3 rounded-full">
                <FaUsers />
              </div>
            </div>

            <h3 className="text-center text-xl font-semibold text-teal-400 mb-4">Total Employees</h3>

            <div className="text-center text-6xl font-bold text-white mb-6">{totalEmployees}</div>

            <div className="text-center">
              <Link to={"/all-employees"}>
                <button
                  className="px-6 py-2 text-sm font-medium text-gray-800 bg-teal-400 hover:bg-teal-300 rounded-full shadow-lg transition duration-300"
                >
                  See All
                </button>
              </Link>
            </div>
          </div>
          <div className="max-w-full p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-teal-600 p-3 rounded-full">
                <RiPresentationFill />
              </div>
            </div>

            <h3 className="text-center text-xl font-semibold text-teal-400 mb-4">Leaves</h3>

            <div className="text-center text-6xl font-bold text-white mb-6">{leaves}</div>

            <div className="text-center">
              <Link to={"/all-employees"}>
                <button
                  className="px-6 py-2 text-sm font-medium text-gray-800 bg-teal-400 hover:bg-teal-300 rounded-full shadow-lg transition duration-300"
                >
                  See All
                </button>
              </Link>
            </div>
          </div>
          <div className="max-w-full p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-teal-600 p-3 rounded-full">
              <FaUsers />
              </div>
            </div>

            <h3 className="text-center text-xl font-semibold text-teal-400 mb-4">Today Present</h3>

            <div className="text-center text-6xl font-bold text-white mb-6">{attendanceData.length}</div>

            <div className="text-center">
              <Link to={"/all-employees"}>
                <button
                  className="px-6 py-2 text-sm font-medium text-gray-800 bg-teal-400 hover:bg-teal-300 rounded-full shadow-lg transition duration-300"
                >
                  See All
                </button>
              </Link>
            </div>
          </div>
        </div>
        
      </div>
      <div className='mt-6'>
        <h2 className='text-white text-2xl'>Attendance Record of the Day</h2>
        <div>
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full table-auto border-collapse bg-gray-900 text-gray-300">
              <thead>
                <tr className="bg-gray-800 text-sm text-center">
                  <th className="px-4 py-2 border border-gray-700">#</th>
                  <th className="px-4 py-2 border border-gray-700">Name</th>
                  <th className="px-4 py-2 border border-gray-700">Login Time</th>
                  <th className="px-4 py-2 border border-gray-700">Logout Time</th>
                  <th className="px-4 py-2 border border-gray-700">L</th>
                  <th className="px-4 py-2 border border-gray-700">P</th>
                  <th className="px-4 py-2 border border-gray-700">Date</th>
                  <th className="px-4 py-2 border border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((item, index) => (
                  <tr key={item.employeeId} className="hover:bg-gray-800 text-sm">
                    <td className="px-4 py-2 border border-gray-700 text-center">{index + 1}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">{item.employeeName}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">{item.loginTime}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">
                      {item.logoutTime === "Not Logged Out Yet" ? "-" : item.logoutTime}
                    </td>
                    <td className="px-4 py-2 border border-gray-700 text-center">Null</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">1</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">{item.date}</td>
                    <td className="px-4 py-2 border border-gray-700 text-center">
                      <button className="text-gray-300 hover:text-teal-500">
                        <CiMenuKebab />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
