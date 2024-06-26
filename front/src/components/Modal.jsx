import React, { useContext, useState } from 'react';
import { buyContract } from '../evmInteraction/buyChickens.jsx';
import { AppContext } from '../App.jsx';
import axios from 'axios';
import { API_URL } from '../utils/consts.js';

const Modal = ({ isOpen, onClose, isVolatile }) => {
  const { account, vault_c, decimals } = useContext(AppContext);
  const quantity = 1;

  const buyAPI = async (chicken, egg) => {
    const body = {
      address: account[0],
      egg: egg,
      stable_chicken: isVolatile ? 0 : Number(chicken),
      volatile_chicken: isVolatile ? Number(chicken) : 0,
      is_buy: true,
    };
    try {
      const response = await axios.post(`${API_URL}/market/trade`, body);
      console.log('Buy response:', response.data);
      // Handle the response as needed
    } catch (error) {
      console.error('Failed to perform buy operation:', error);
      // Handle error appropriately
    }
  };

  const sellAPI = async (chicken, egg) => {
    const body = {
      address: account[0],
      egg: egg,
      stable_chicken: isVolatile ? 0 : chicken,
      volatile_chicken: isVolatile ? chicken : 0,
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

  const buyChickens = async () => {
    const response = await buyContract(account, vault_c, decimals);
    if (response) {
      await buyAPI(quantity, quantity * 10);
    }
    onClose();
  };

  const sellChickens = async () => {
    // await sellContract(chain, account, vault_c, decimals);
    await sellAPI(quantity);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-4 z-20 w-96 ">
        {/* 모달 헤더 */}
        <div className="modal-content mb-4 flex justify-between items-center ">
          <div className="text-blue-500 text-2xl font-bold">
            Chicken Details {isVolatile ? 'Volatile' : 'Stable'}
          </div>
          <div onClick={onClose}>
            <img
              src={`${process.env.PUBLIC_URL}/images/icons/exit.svg`}
              alt="Volatile Chicken"
            />
          </div>
        </div>

        {/* 모달 내용 */}
        <div className="flex flex-col justify-between items-center p-4">
          <div className=" font-bold">
            <div className="mb-4">
              Buy Price: <span>{quantity * 1000} - USDC</span>
            </div>
            <div className="mb-4">
              Instant Eggs: <span>{quantity * 10} - Eggs</span>
            </div>
            <div className="mb-4 flex items-center"></div>
          </div>
        </div>

        {/* 확인 및 취소 버튼 */}
        <div className="modal-buttons flex justify-end">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
            onClick={buyChickens}
          >
            Hatch
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
