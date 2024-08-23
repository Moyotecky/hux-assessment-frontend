"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email') || ''; // Retrieve email from search params

  useEffect(() => {
    if (!email) {
      setErrors({ api: 'Email is required for OTP verification.' });
    }
  }, [email]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(0, 1); // Only allow one character
      setOtp(newOtp);
      
      // Move to next input if current input is filled
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpString = otp.join('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp: otpString }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('OTP verification response:', response.data);
      router.push('/auth/success'); // Redirect to success page on successful verification
    } catch (error) {
      console.error('OTP verification error:', error.response ? error.response.data : error.message);
      setErrors({ api: error.response ? error.response.data.message : 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification-email', { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Resend OTP response:', response.data);
      setErrors({ api: 'Verification email resent. Please check your inbox.' });
    } catch (error) {
      console.error('Resend OTP error:', error.response ? error.response.data : error.message);
      setErrors({ api: error.response ? error.response.data.message : 'An error occurred. Please try again.' });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Verify OTP
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200 relative">
        <div className="flex justify-between mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={value}
              onChange={(e) => handleChange(e, index)}
              maxLength="1"
              className="w-12 h-12 text-center p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        {errors.api && <p className="text-red-500 text-sm mb-4">{errors.api}</p>}
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition ease-in-out duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading || !email} // Disable if email is not present
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          className={`w-full mt-4 bg-gray-500 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-gray-600 transition ease-in-out duration-300 ${resendLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={resendLoading || !email} // Disable if email is not present
        >
          {resendLoading ? 'Resending...' : 'Resend OTP'}
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationPage;
