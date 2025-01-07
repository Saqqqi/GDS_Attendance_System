import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeCard = ({ 
  name, 
  role, 
  image, 
  id 
}) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/employee-detail/${id}`);
  };

  return (
<div className="w-full max-w-sm bg-transparent border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
  {/* Dropdown Button - (Optional) You can uncomment this for dropdown functionality */}
  {/* <div className="flex justify-end p-4">
    <button 
      id="dropdownButton" 
      className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
      type="button"
    >
      <span className="sr-only">Open dropdown</span>
      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
      </svg>
    </button>
  </div> */}

  {/* Profile Section */}
  <div className="flex flex-col items-center py-6 px-4">
    <img 
      className="w-24 h-24 mb-4 rounded-full shadow-lg object-cover" 
      src={image} 
      alt={`${name}'s profile`} 
    />
    <h5 className="mb-1 text-xl font-semibold text-gray-200 dark:text-white">{name}</h5>
    <span className="text-sm text-gray-400 dark:text-gray-500">{role}</span>

    {/* Buttons Section */}
    <div className="flex mt-6">
      <button 
        onClick={handleDetailClick}
        className="py-2 px-6 text-md text-white bg-[#36BCBA] font-semibold rounded-lg border border-transparent hover:bg-[#2a9c94] transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#36BCBA]/50"
      >
        See Details
      </button>
    </div>
  </div>
</div>

  );
};

export default EmployeeCard;
