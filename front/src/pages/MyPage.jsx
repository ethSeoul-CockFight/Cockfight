import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import LoadingPage from "../components/Loading";
import { formatAmount, truncate } from "../utils/helpper";
import { getNativeBalance } from "../evmInteraction/connect";

const MyPage = () => {
  const { account, setAccount, web3, decimals } = useContext(AppContext);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOn, setIsModalOn] = useState(false);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);
  const [chickenBalance, setChickenBalance] = useState(0);
  const [eggBalance, setEggBalance] = useState(0);
  const [data, setData] = useState();

  const onClickModal = () => {
    setIsModalOn(!isModalOn);
  };

  const onClickFaucet = async () => {
    try {
      setIsFaucetLoading(true);
      await getNativeBalance(web3, account);
    } catch (error) {
      console.error(error);
    }
    setIsFaucetLoading(false);
  };

  function waitTenSeconds() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  const get_account_data = async () => {
    try {
      await waitTenSeconds();
      const response = await getNativeBalance(web3, account);
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
                <div className="flex justify-between">
                  <div className="font-semibold mb-4">My Balance</div>
                  <button
                    className="bg-slate-300 rounded-lg h-8 p-1"
                    onClick={onClickFaucet}
                  >
                    {isFaucetLoading ? <div>Loading</div> : <div>Faucet</div>}
                  </button>
                </div>
                <div className="flex font-extrabold justify-end text-4xl text-slate-600	">
                  {balance} USDC
                </div>
              </div>
              {/* Chicken */}
              <div className="mb-5 text-lg">
                Chickens
                {/* Stable 치킨 */}
                <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/c_classic.png`}
                    alt="Volatile Chicken"
                    className="flex rounded-full h-16 w-16 justify-center items-center	"
                  />
                  <div>
                    <div>Stable</div>
                    <div className="text-xl font-bold">
                      {chickenBalance} Chickens
                    </div>
                  </div>
                  <button className="bg-slate-300 rounded-lg h-12 p-1">
                    Unstaking
                  </button>
                </div>
                {/* Volatile 치킨 */}
                <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/c_punky.png`}
                    alt="Volatile Chicken"
                    className="flex rounded-full h-16 w-16 justify-center items-center	"
                  />

                  <div>
                    <div>Volatile</div>
                    <div className="text-xl font-bold">36 Chickens</div>
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
                    <div className=" flex justify-start text-xl font-bold mr-44">
                      {eggBalance} Eggs
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2">
                    Buy eggs
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mr-2">
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

export default MyPage;
