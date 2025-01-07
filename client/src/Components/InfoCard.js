import React from 'react';

const InfoCard = ({ icon, title, number, buttonText, onButtonClick }) => {
  return (
    <div className="max-w-full p-6 bg-gray-800 rounded-lg shadow-lg">
      {/* Icon */}
      <div className="flex justify-center items-center mb-4">
        <div className="bg-teal-600 p-3 rounded-full">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-center text-xl font-semibold text-teal-400 mb-4">{title}</h3>

      {/* Number */}
      <div className="text-center text-6xl font-bold text-white mb-6">{number}</div>

      {/* Button */}
      <div className="text-center">
        <button
          className="px-6 py-2 text-sm font-medium text-gray-800 bg-teal-400 hover:bg-teal-300 rounded-full shadow-lg transition duration-300"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InfoCard;
