export const connect = async () => {
  return await connect_celo();
};

export const getChikenBalance = async (account, nft_c) => {
  const response = await nft_c.methods.balanceOf(account[0]).call();
  return response.toString();
};

const ALFAJORES_PARAMS = {
  chainId: "0xaef3",
  chainName: "Alfajores Testnet",
  nativeCurrency: { name: "Alfajores Celo", symbol: "A-CELO", decimals: 18 },
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
  blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org/"],
  iconUrls: ["future"],
};

export const getNativeBalance = async (web3, account) => {
  const response = await web3.eth.getBalance(account[0]);
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
