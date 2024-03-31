import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import eggImage from '../images/egg.png';

import LoadingPage from '../components/Loading';
import { formatAmount, truncate } from '../utils/helpper';
import { getNativeBalance, getChikenBalance } from '../evmInteraction/connect';
import { API_URL } from '../utils/consts';
import WithdrawModal from '../components/WithdrawModal';
import { getFaucet } from '../web3config/chain';
import axios from 'axios';

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
  const faucet = getFaucet();
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 성공 모달 상태

  function onClickCopy() {
    navigator.clipboard
      .writeText(account[0])
      .then(() => {
        console.log('클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        console.error('복사하는데 실패했습니다.', err);
      });
  }

  const fetchData = async () => {
    try {
      if (account) {
        const accountRes = await axios.get(
          `${API_URL}/user?address=${account[0]}`,
        );
        const users = accountRes.data.users;
        console.log(users);
        setUserEgg(users[0].egg);
        setStableChicken(users[0].stable_chicken);
        setVolatileChicken(users[0].volatile_chicken);
      }
    } catch (error) {
      console.error('Failed to fetch egg balance:', error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    fetchData();
  }, [account]);

  useEffect(() => {
    if (!account) {
      navigate('/main');
    }
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const onClickFaucet = async () => {
    try {
      setIsFaucetLoading(true);
      console.log(faucet);
      window.open(faucet, '_blank');
    } catch (error) {
      console.error(error);
    }
    setIsFaucetLoading(false);
  };

  const hatchChickens = async () => {
    if (userEgg < 1000) {
      alert('You need at least 1000 eggs to hatch a chicken.');
      return;
    }

    const sell = {
      address: account[0],
      egg: 1000,
      stable_chicken: 0,
      volatile_chicken: 0,
      is_buy: false,
    };

    const buy = {
      address: account[0],
      egg: 0,
      stable_chicken: 1,
      volatile_chicken: 0,
      is_buy: true,
    };

    try {
      const sellRes = await axios.post(`${API_URL}/market/trade`, sell);
      const buyRes = await axios.post(`${API_URL}/market/trade`, buy);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to perform buy operation:', error);
      // Handle error appropriately
    }
  };

  const get_account_data = async () => {
    setIsLoading(true);
    try {
      const response = await getNativeBalance(web3, account);
      const value = formatAmount(response, decimals);
      setBalance(value);
      await fetchData();
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
                <div className="text-2xl font-bold">My Page</div>
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
                    onClick={onClickCopy}
                  >
                    {truncate(account[0])}
                  </button>
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
                  <ImageBox className="m-3 p-1" src={eggImage} alt="Egg" />
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
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={hatchChickens}
                  >
                    Hatched eggs
                  </button>
                  {showSuccessModal && (
                    <SuccessModal>
                      <p>
                        Congratulations! Your eggs have been successfully
                        hatched.
                      </p>
                      <button onClick={() => setShowSuccessModal(false)}>
                        Close
                      </button>
                    </SuccessModal>
                  )}
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

const SuccessModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: white;
  border: 2px solid #4caf50;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 1000; // Ensure it's above other content
`;
