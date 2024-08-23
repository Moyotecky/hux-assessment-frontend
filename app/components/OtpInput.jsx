import React from 'react';

interface OtpInputProps {
  otp: string[];
  onOtpChange: (index: number, value: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, onOtpChange }) => {
  return (
    <div className="flex justify-between mb-6">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          value={digit}
          onChange={(e) => onOtpChange(index, e.target.value)}
          className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform duration-300 transform hover:scale-105"
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default OtpInput;
