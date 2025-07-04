import React from 'react';
import Lottie from 'lottie-react';
import errorAnimation from '../assets/Animation - 1751624707360.json';
import { useNavigate } from 'react-router-dom'

function Error() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full min-h-screen bg-[#e5e7eb] flex justify-center items-center overflow-hidden">

      <div className="absolute inset-0 z-0">
        <Lottie
          animationData={errorAnimation}
          loop={true}
          className="w-full h-full object-contain"
        />
      </div>


      <div className="absolute z-10   bottom-10 text-center px-4 hover:bg-black hover:text-white font-semibold  cursor-pointer p-2 rounded-2xl" onClick={() => { navigate('/') }}>
        Home
      </div>
    </div>
  );
}

export default Error;
