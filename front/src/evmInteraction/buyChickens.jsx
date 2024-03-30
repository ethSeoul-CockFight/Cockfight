export const buyContract = async (account, vault_c) => {
  await buyStableChicken_CELO(account, vault_c);
};

const buyStableChicken_EVM = async (account, nft_c) => {
  try {
    console.log(account);
    await nft_c.methods.buyNative().send({ from: account[0], value: 10000 });
  } catch (error) {
    console.error(error);
  }
};

const buyStableChicken_CELO = async (account, vault_c) => {
  try {
    console.log(await vault_c.methods);

    await vault_c.methods
      .buyNative(0)
      .send({ from: account[0], value: "100000000000000000" });
  } catch (error) {
    console.error(error);
  }
};
