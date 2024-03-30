import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import eggImage from "../images/egg.png";

import LoadingPage from "../components/Loading";
import { formatAmount, truncate } from "../utils/helpper";
import { getNativeBalance, getChikenBalance } from "../evmInteraction/connect";
import { API_URL } from "../utils/consts";
import WithdrawModal from "../components/WithdrawModal";

const MyPage = () => {
  const { account, web3, decimals, nft_c } = useContext(AppContext);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFaucetLoading, setIsFaucetLoading] = useState(false);
  const [stableChicken, setStableChicken] = useState(0);
  const [volatileChicken, setVolatileChicken] = useState(0);
  const [userEgg, setUserEgg] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      console.log("account:", account);
      // const res = await axios.get(`${API_URL}/user?account=${account}`);
      // const users = res.data.users;

      if (account[0]) {
        setStableChicken(await getChikenBalance(account, nft_c)); // Assuming the response contains an eggBalance field
        // setUserEgg(users[0].egg); // Assuming the response contains an eggBalance field
      }
    } catch (error) {
      console.error("Failed to fetch egg balance:", error);
      // Handle error appropriately
    }
  };
  useEffect(() => {
    if (!account) {
      navigate("/main");
    }
  }, []);

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
    get_Data();
    fetchData();
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
                      {stableChicken} Chickens
                    </div>
                  </div>
                  <button
                    className="bg-slate-300 rounded-lg h-12 p-1"
                    onClick={openModal}
                  >
                    Unstaking
                  </button>
                </div>
                <WithdrawModal
                  isOpen={modalOpen}
                  onClose={closeModal}
                  userAccount={account[0]}
                />
                {/* Volatile 치킨 */}
                <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/c_punky.png`}
                    alt="Volatile Chicken"
                    className="flex rounded-full h-16 w-16 justify-center items-center	"
                  />

                  <div>
                    <div>Volatile</div>
                    <div className="text-xl font-bold">
                      {volatileChicken} Chickens
                    </div>
                  </div>
                  <button className=" bg-slate-300 rounded-lg h-12 p-1">
                    Unstaking
                  </button>
                </div>
              </div>

              <div className="mb-10 text-lg">
                Eggs
                <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
                  <ImageBox src={eggImage} alt="Egg" />
                  <div>
                    <div className=" flex justify-start text-xl font-bold mr-44">
                      {userEgg} Eggs
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

const ImageBox = styled.img`
  width: 46px;
  height: 44px;
  background-color: white;
  border-radius: 50%;
  object-fit: cover;
`;
