import axios from 'axios';
import { API_URL } from './consts';

export const bettingAPI = async (account, egg, betting) => {
  const body = {
    address: account[0],
    egg,
    stable_chicken: 0,
    volatile_chicken: 0,
    is_buy: false,
  };
  
  try {
    const response = await axios.post(`${API_URL}/market/trade`, body);
    const bettingResponse = await axios.post(`${API_URL}/betting`, betting);
    console.log("Buy response:", response.data);
    console.log("Betting response:", bettingResponse.data);
    // Handle the response as needed
  } catch (error) {
    console.error("Failed to perform buy operation:", error);
    // Handle error appropriately
  }
};

export const buyAPI = async (account, chicken, isVolatile) => {
    const body = {
      address: account[0],
      egg: 0,
      stable_chicken: isVolatile ? 0 : chicken,
      volatile_chicken: isVolatile ? chicken : 0,
      is_buy: true,
    };
    try {
      const response = await axios.post(`${API_URL}/market/trade`, body);
      console.log("Buy response:", response.data);
      // Handle the response as needed
    } catch (error) {
      console.error("Failed to perform buy operation:", error);
      // Handle error appropriately
    }
  };

export const sellAPI = async (account, chicken, isVolatile) => {
    const body = {
      address: account[0],
      egg: 0,
      stable_chicken: isVolatile ? 0 : chicken,
      volatile_chicken: isVolatile ? chicken : 0,
      is_buy: false,
    };
    try {
      const response = await axios.post(`${API_URL}/market/trade`, body);
      console.log("Sell response:", response.data);
    } catch (error) {
      console.error("Failed to fetch egg balance:", error);
      // Handle error appropriately
    }
  };