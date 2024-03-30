import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import { connect } from "../evmInteraction/connect";

const Login = () => {
  const { account, setAccount, chain } = useContext(AppContext);
  const navigate = useNavigate();

  const onClickAccount = async () => {
    try {
      console.log("메마 로그인");
      const accounts = await connect(chain);
      if(accounts){
      setAccount(accounts);
      navigate("/main");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center mt-16">
      <div className="mt-24 font-bold flex flex-col w-[300px]">
        {account ? (
          <div></div>
        ) : (
          <button
            onClick={onClickAccount}
            className="bg-neutral-200 text-black w-full py-4 mt-5 rounded-full hover:bg-neutral-300"
          >
            Wallet Connect
          </button>
        )}
      </div>
      <img
        className="w-full max-h-[calc(100%-8rem)] object-contain" // `object-contain`으로 이미지 비율 유지
        src="/images/Main.png"
        alt="Login Image"
      />
    </div>
  );
};

export default Login;
