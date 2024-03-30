import {
  ALFAJORES_PARAMS,
  KLAYTN_PARAMS,
  NEON_PARAMS,
  FHENIX_PARAMS,
} from "./chainParams";

import { CHAIN } from "../utils/consts";

export const connect = async () => {
  if (CHAIN == "CELO") return await connect_celo();
  else if (CHAIN == "KLAYTN") return await connect_klaytn();
  else if (CHAIN == "NEON") return await connect_neon();
  else if (CHAIN == "FHENIX") return await connect_fhenix();
};

export const getChikenBalance = async (account, nft_c) => {
  const response = await nft_c.methods.balanceOf(account[0]).call();
  return response.toString();
};

export const getChickenIds = async (account, nft_c, balance) => {
  const ids = [];
  for (let i = 0; i < balance; i++) {
    const response = await nft_c.methods.tokenOfOwnerByIndex(account, i).call();
    ids.push(Number(response));
  }
  return ids;
};

export const getNativeBalance = async (web3, account) => {
  const response = await web3.eth.getBalance(account[0]);
  return response;
};

export const getSellingList = async (vault_c) => {
  const response = await vault_c.methods.getSellingChickens().call();
  return response;
};

const connect_celo = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [ALFAJORES_PARAMS],
    });
    return accounts;
  } catch (error) {}
};

const connect_klaytn = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [KLAYTN_PARAMS],
    });
    return accounts;
  } catch (error) {}
};

const connect_neon = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [NEON_PARAMS],
    });
    return accounts;
  } catch (error) {}
};

const connect_fhenix = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [FHENIX_PARAMS],
    });
    return accounts;
  } catch (error) {}
};

const connect_tbfc = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xbfc0", // 16진수 체인 ID, 여기서는 Bifrost Testnet의 체인 ID입니다.
          chainName: "Bifrost Testnet", // 네트워크의 이름입니다.
          rpcUrls: ["https://public-01.testnet.bifrostnetwork.com/rpc"], // 네트워크의 RPC URL 배열입니다.
          nativeCurrency: {
            name: "Bifrost Coin", // 네트워크에서 사용되는 통화의 이름입니다.
            symbol: "BFC", // 통화의 기호입니다.
            decimals: 18, // 통화의 소수점 자릿수입니다. 대부분의 이더리움 기반 통화는 18을 사용합니다.
          },
          blockExplorerUrls: ["https://explorer.testnet.bifrostnetwork.com/"], // 선택적, 블록 탐색기의 URL 배열입니다.
        },
      ],
    });
    return accounts;
  } catch (error) {
    console.error(error);
  }
};

const connect_sepolia = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0xbfc0",
        },
      ],
    });
    return accounts;
  } catch (error) {
    console.error(error);
  }
};
