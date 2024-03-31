import React, { useContext, useEffect, useState } from 'react';
import {
  buyContract,
  withdrawStableChicken,
} from '../evmInteraction/buyChickens.jsx';
import { getChikenBalance, getChickenIds } from '../evmInteraction/connect';
import { AppContext } from '../App.jsx';
import axios from 'axios';
import { API_URL } from '../utils/consts.js';

const WithdrawModal = ({ isOpen, onClose, userAccount }) => {
  const { account, vault_c, decimals, nft_c } = useContext(AppContext);
  const [stableChicken, setStableChicken] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [chickenIds, setChickenIds] = useState([]);

  const fetchData = async () => {
    if (account) {
      setStableChicken(Number(await getChikenBalance(account, nft_c))); // Assuming the response contains an eggBalance field
      const lists = await getChickenIds(userAccount, nft_c, stableChicken);
      setChickenIds(lists);
    }
  };

  React.useEffect(() => {
    // 이펙트에서 'value' 값을 사용 중입니다.  // dependency 배열에 'value' 값을 추가해야 합니다.
    fetchData();
  }, [stableChicken]); // 'value' 값이 변경될 때 이펙트를 실행합니다.

  const sellAPI = async (chicken, egg) => {
    console.log('chicken>> ', chicken, egg);
    const body = {
      address: account[0],
      egg: egg,
      stable_chicken: chicken, // isVolatile ? 0 : chicken,
      volatile_chicken: 0, // isVolatile ? chicken : 0,
      is_buy: false,
    };
    try {
      const response = await axios.post(`${API_URL}/market/trade`, body);
      console.log('Sell response:', response.data);
    } catch (error) {
      console.error('Failed to fetch egg balance:', error);
      // Handle error appropriately
    }
  };

  const sellChickens = async (tokenId) => {
    if (tokenId % 2 == 0) {
      await withdrawStableChicken(account, tokenId, vault_c);
      setStableChicken(Number(await getChikenBalance(account, nft_c)));
      await sellAPI(1, 0);
      onClose();
    } else {
      alert('Your chicken locked-up until April 3');
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-4 z-20 w-96 ">
        {/* 모달 헤더 */}
        <div className="modal-content mb-4 flex justify-between items-center ">
          <div className="text-blue-500 text-2xl font-bold">
            Withdraw Chickens
          </div>
          <div onClick={onClose}>
            <img
              src={`${process.env.PUBLIC_URL}/images/icons/exit.svg`}
              alt="Volatile Chicken"
            />
          </div>
        </div>

        {/* 모달 내용 */}
        <div>
          {chickenIds?.map((id, index) => (
            <div className="flex mt-2 bg-slate-50	rounded-lg h-24 p-2 shadow-md mb-4 justify-between items-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/c_classic.png`}
                alt="Volatile Chicken"
                className="flex rounded-full h-16 w-16 justify-center items-center	"
              />
              <div>
                <div className="text-xl font-bold">Stable #{id}</div>
                <div className="text-sm">
                  condition: {id % 2 == 0 ? '100%' : '70%'}
                </div>
              </div>
              <button
                className="bg-slate-200 rounded-lg h-12 p-1"
                onClick={() => sellChickens(id)}
              >
                <div>{id % 2 == 0 ? 'Unstaking' : 'Locked-up'}</div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default WithdrawModal;
