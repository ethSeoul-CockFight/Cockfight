import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const Hatchery = () => {
  const { account } = useContext(AppContext);
  // 모달코드 추가
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  useEffect(() => {
    if (!account) {
      navigate("/main");
    }
  }, []);

  return (
    <div className="h-full overflow-y-scroll overflow-x-hidden scrollbar-hide">
      {/* 헤더 */}
      <div
        className="flex justify-around h-12 items-center  border-b-4
       border-zinc-200"
      >
        <div className="text-2xl font-bold">Hatchery</div>
      </div>

      {/* 바디 */}
      <div className="h-screen ">
        {/* 첫 번째 박스 */}
        <div className="bg-black flex justify-center items-center h-1/3 ">
          <div className="flex-auto w-96 items-center justify-center">
            <div className="text-3xl font-bold ml-4 text-yellow-100">
              Hatch Chicken
            </div>
          </div>
          <button className="flex-auto" onClick={openModal}>
            <div className=" text-lg font-semibold mt-2 text-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/c_classic.png`}
                alt="Volatile Chicken"
                className="w-96"
              />
              <div className="text-white">Stable Chicken</div>
            </div>
          </button>
          <Modal isOpen={modalOpen} onClose={closeModal} isVolatile={false} />
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
              <div>Volatile Chicken</div>
            </button>
          </div>
          <Modal isOpen={modalOpen} onClose={closeModal} isVolatile={true} />
          <div className="flex flex-col w-96 items-end justify-end ">
            <div className="text-3xl font-bold mr-3">Get Egg</div>
            <div className="text-4xl font-bold mr-3 text-red-500">Instant</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hatchery;
