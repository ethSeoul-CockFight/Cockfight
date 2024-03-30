import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import Modal from "../components/Modal";
import axios from 'axios';

const Market = () => {
  const { account, setAccount, chain } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  // 모달코드 추가
  const [modalOpen, setModalOpen] = useState(false);


  // const fetchEggBalance = async () => {
  //   try {
  //     const response = await axios.post('/api/getEggBalance', { /* Your request payload here, if needed */ });
  //     setEggBalance(response.data.eggBalance); // Assuming the response contains an eggBalance field
  //   } catch (error) {
  //     console.error('Failed to fetch egg balance:', error);
  //     // Handle error appropriately
  //   }
  // };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const get_Data = async () => {
    setIsLoading(true);
    try {
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  //여기까지 모달

  useEffect(() => {
    get_Data();
  }, []);

  return (
    <div className="h-full overflow-y-scroll overflow-x-hidden scrollbar-hide">
      {/* 헤더 */}
      <div
        className="flex justify-around h-12 items-center  border-b-4
       border-zinc-200"
      >
        <div className="text-2xl font-bold">Market</div>
      </div>

      {/* 바디 */}
      <div className="h-screen ">
        {/* 첫 번째 박스 */}
        <div className="bg-black flex justify-center items-center h-1/3 ">
          <div className="flex-auto w-96 items-center justify-center">
            <div className="text-3xl font-bold ml-3 text-yellow-50">
              Buy Chicken
            </div>
          </div>
          <button className="flex-auto" onClick={openModal}>
            <div className=" text-lg font-semibold mt-2 text-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/c_classic.png`}
                alt="Volatile Chicken"
                className="w-96"
              />
              <div className="text-white">A stable Chicken</div>
            </div>
          </button>
          <Modal isOpen={modalOpen} onClose={closeModal} />
        </div>

        {/* 두 번째 박스 */}
        <div className="h-1/3 flex  justify-center items-center">
          <div className="flex-auto" onClick={openModal}>
            <button className="text-lg font-semibold mt-2 text-center ">
              <img
                src={`${process.env.PUBLIC_URL}/images/c_punky.png`}
                alt="Volatile Chicken"
                className="w-96"
              />
              <div>A floating Chicken</div>
            </button>
          </div>
          <Modal isOpen={modalOpen} onClose={closeModal} />
          <div className="flex flex-col w-96 items-end justify-end ">
            <div className="text-3xl font-bold mr-3">get reward</div>
            <div className="text-xl font-bold mr-3">regularly</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
