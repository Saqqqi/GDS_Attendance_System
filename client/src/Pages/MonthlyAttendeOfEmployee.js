import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const EmployeeAttendance = () => {
    const { id } = useParams();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);

    useEffect(() => {
        const fetchAttendanceRecords = async () => {
            setLoading(true); // Set loading to true when fetching starts
            setError(null); // Clear previous errors


            try {
                const response = await axios.get(`http://localhost:5000/attendance/employee/${id}`);

                setEmployeeName(response.data[0].employee.name);
                setAttendanceRecords(response.data);
                console.log(response.data);
                
            } catch (err) {
                // Handle error and set the error state with the error message
                setError(err.response?.data?.message || 'Failed to fetch attendance records');
                console.error('Error fetching data: ', err);
            } finally {
                setLoading(false); // Set loading to false when the request is complete
            }
        };

        fetchAttendanceRecords(); // Invoke the fetch function
    }, [id]); // Depend on `id` to refetch if the `id` changes

    // Loading state
    if (loading) {
        return <div>Loading attendance records...</div>;
    }

    // Error state
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    // Render attendance records
    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow- border border-[#36BCBA]">
            <div className="text-center text-xl text-white mb-4">
                <p className="font-bold text-[#36BCBA]">{employeeName || "Loading..."}</p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-gray-800 text-white border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 font-semibold border-b border-gray-600 text-left text-green-500">Date</th>
                            <th className="px-6 py-3 font-semibold border-b border-gray-600 text-left text-green-500">Login Time</th>
                            <th className="px-6 py-3 font-semibold border-b border-gray-600 text-left text-green-500">Logout Time</th>
                            <th className="px-6 py-3 font-semibold border-b border-gray-600 text-left text-green-500">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.map((record, index) => (
                            <tr key={index} className="hover:bg-gray-700">
                                <td className="px-6 py-4 border-b border-gray-600 text-gray-400">{record.date}</td>
                                <td className="px-6 py-4 border-b border-gray-600 text-gray-400">{record.loginTime}</td>
                                <td className="px-6 py-4 border-b border-gray-600 text-gray-400">{record.logoutTime}</td>
                                <td className="px-6 py-4 border-b border-gray-600 text-gray-400">
                                    {record.isLoggedIn ? "Logged In" : "Logged Out"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Count total presents and leaves */}
            <div className="mt-4 text-white flex justify-between">
                <div>
                    <p><strong className="text-gray-400 font-semibold">Total Presents:</strong> {attendanceRecords.filter(record => record.isLoggedIn).length}</p>
                </div>
                <div>
                    <p><strong>Total Leaves:</strong> {attendanceRecords.filter(record => !record.isLoggedIn).length}</p>
                </div>
            </div>
        </div>


    );
};

export default EmployeeAttendance;
