"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import successAnimation from '../../../public/success-animation.json'; // Path to your animation JSON

const SuccessPage = () => {
  const [glitter, setGlitter] = useState(false);
  const [shine, setShine] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Start glitter and shine effects after component mounts
    const timer = setTimeout(() => {
      setGlitter(true);
      setShine(true);
    }, 100);

    // Cleanup timers
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleContinue = () => {
    router.push('/dashboard'); // Navigate to dashboard on button click
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Success!</h1>
      <div className="relative mb-6">
        <Lottie
          animationData={successAnimation}
          loop={false}
          className="w-48 h-48"
        />
        {glitter && (
          <div className="absolute inset-0 pointer-events-none glitter-container">
            <div className="glitter"></div>
          </div>
        )}
        {shine && (
          <div className="absolute inset-0 pointer-events-none shine"></div>
        )}
      </div>
      <p className="text-gray-600 mt-6 mb-8">Your registeration was successful.</p>
      <button
        onClick={handleContinue}
        className="w-full max-w-xs bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition ease-in-out duration-300"
      >
        Continue to Dashboard
      </button>
    </div>
  );
};

export default SuccessPage;
