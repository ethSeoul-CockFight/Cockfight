import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Welcome = () => {
  const images = [
    '/images/Welcome/Welcome1.png',
    '/images/Welcome/Welcome2.png',
    '/images/Welcome/Welcome3.png',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const [isClick, setIsClick] = useState(false);

  const onClickLogo = () => {
    setIsClick(true);
  };

  const onClickNext = () => {
    if (currentImageIndex === 2) {
      setCurrentImageIndex(0);
      navigate('/login');
    }

    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <>
      {isClick ? (
        <div className="h-full flex flex-col justify-between items-center pt-16">
          <div className="w-full">
            <img
              className="ml-10"
              src={images[currentImageIndex]}
              alt="Slider Image"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className="w-[300px] mb-[75px]">
            <button
              onClick={onClickNext}
              className="bg-neutral-900 text-white w-full py-4 rounded-full hover:bg-neutral-700 font-bold"
            >
              Next
            </button>
            <Link to="/login">
              <button className="bg-neutral-200 text-black w-full py-4 mt-5 rounded-full hover:bg-neutral-300 font-bold">
                Skip
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex justify-center items-center">
          <button
            onClick={onClickLogo}
            className="h-full  w-full flex justify-center items-center"
          >
            <img
              className=" w-[200px]  mb-[240px]  h-[200px]" // Logo 이미지 넣을떄 따로 값 바꿔주면됨
              src="/images/Welcome/logo.png"
              alt="Logo Image"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default Welcome;
