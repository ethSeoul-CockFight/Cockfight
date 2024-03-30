import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import LoadingPage from "../components/Loading";
import { formatAmount, truncate } from "../utils/helpper";

const Main = () => {
  const { account, setAccount, web3, decimals } = useContext(AppContext);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOn, setIsModalOn] = useState(false);
  const [data, setData] = useState();

  const onClickModal = () => {
    setIsModalOn(!isModalOn);
  };

  const get_account_data = async () => {
    try {
      const response = await web3.eth.getBalance(account[0]);
      const value = formatAmount(response, decimals);
      setBalance(value);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    get_account_data();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex justify-center text-3xl font-bold pt-80">
          <LoadingPage />
        </div>
      ) : (
        <>
          <div className="h-full mb-24 overflow-y-scroll overflow-x-hidden scrollbar-hide">
            {/*헤더*/}
            <div className="flex justify-around h-12 items-center  border-b-4 border-zinc-200">
              <div>
                <div className="text-2xl font-bold">Cock Fight</div>
              </div>
            </div>
            {/* 바디 시작 */}
            <div className="min-h-full p-4">
              {/* balance */}
              <div className=" bg-slate-50	rounded-lg h-28 p-4 shadow-md mb-8">
                <div className="font-semibold mb-4">
                  My Balance ( chicken + eggs )
                </div>
                <div className="flex font-extrabold justify-end text-4xl text-slate-600	">
                  $1,893.44
                </div>
              </div>
              {/* Chicken */}
              <div className="mb-5 text-lg">
                Chickens
                {/* Stable 치킨 */}
                <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
                  <div className="flex rounded-full bg-slate-300 h-16 w-16 text-xs justify-center items-center	">
                    이미지(Stable)
                  </div>
                  <div>
                    <div>Stable</div>
                    <div className="text-xl font-bold">100 Chickens</div>
                  </div>
                  <button className=" bg-slate-300 rounded-lg h-12 p-1">
                    Unstaking
                  </button>
                </div>
                {/* Volatile 치킨 */}
                <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
                  <div className="flex rounded-full bg-slate-300 h-16 w-16 text-xs justify-center items-center	">
                    이미지 (Volatile)
                  </div>
                  <div>
                    <div>Volatile</div>
                    <div className="text-xl font-bold">100 Chickens</div>
                  </div>
                  <button className=" bg-slate-300 rounded-lg h-12 p-1">
                    Unstaking
                  </button>
                </div>
              </div>

              <div className="mb-10 text-lg">
                Eggs
                <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
                  <div className="flex rounded-full bg-slate-300 h-16 w-16 text-xs justify-center items-center	">
                    Eggs
                  </div>
                  <div>
                    <div className=" flex justify-end text-xs ml-8">
                      $1000.382
                    </div>
                    <div className=" flex justify-start text-xl font-bold mr-44">
                      100 Eggs
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Sell eggs
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Hatched eggs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Main;
