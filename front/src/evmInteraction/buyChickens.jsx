export const buyContract = async (chain, account, nft_c) => {
  await buyStableChicken_EVM(account, nft_c);
};

const buyStableChicken_EVM = async (account, nft_c) => {
  try {
    await nft_c.methods.buyNative().send({ from: account[0], value: 10000 });
  } catch (error) {
    console.error(error);
  }
};
