import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../assets/images/login-bg.png";
import logo from '../assets/images/logo.png';

function Login() {
  const [secretKey, setSecretKey] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d{0,1}$/.test(value)) {
      const updatedSecretKey = [...secretKey];
      updatedSecretKey[index] = value;
      setSecretKey(updatedSecretKey);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const secretKeyString = secretKey.join('');

    if (secretKeyString.length !== 6) {
      setError('Please enter all 6 digits');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey: secretKeyString }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        console.log(data)
        const storageData = {
          employeeId: data.employeeId,
          attendanceId: data.attendanceId,
          employeeName: data.employeeName,
          loginTime: data.inTime,
          Role: data.roleCompany,
          isLoggedIn: 'true', // Add static values as needed
        };
    
        // Store each key-value pair in localStorage
        Object.entries(storageData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
        });
    

        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid secret key');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing the request');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-screen h-screen bg-[#060E0E] flex justify-center items-center">
      <div className="flex w-full h-full max-w-7xl bg-white shadow-lg">
        <div className="w-1/2 h-full relative">
          <img src={loginBg} alt="Sample" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 -mt-20 flex justify-center items-center">
            <img src={logo} alt="Logo" className="w-96 h-auto z-10" />
          </div>
        </div>
        <div className="w-1/2 h-full p-6 flex flex-col justify-center items-center bg-[#060E0E]">
          <h2 className="text-center text-2xl font-semibold text-gray-100 mb-6">
            Enter 6 Digit Secret Code
          </h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-between space-x-6 bg-[#1A1F1F] p-4 rounded-lg">
            <div className="flex items-center justify-between gap-4">
              {secretKey.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={secretKey[index] || ''}
                  onChange={(e) => handleChange(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-16 text-3xl text-gray-100 text-center bg-transparent border-2 border-[#36BCBA] rounded-md focus:outline-none"
                  placeholder="0"
                />
              ))}
            </div>
            <button
              disabled={loading}
              className={`mt-6 w-2/3 py-2 text-2xl font-semibold text-white rounded-lg ${loading ? 'bg-gray-500' : 'bg-[#36BCBA]'} hover:bg-pink-500 transition duration-300`}
            >
              {loading ? 'Processing...' : 'TIME IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
