import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const onClickMain = () => {
    navigate("/main");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <button
        onClick={onClickMain}
        className="h-full  w-full flex justify-center items-center"
      >
        <img
          className=" w-[200px]  mb-[240px]  h-[200px]" // Logo 이미지 넣을떄 따로 값 바꿔주면됨
          src="/images/Welcome/logo.png"
          alt="Logo Image"
        />
      </button>
    </div>
  );
};

export default Welcome;
