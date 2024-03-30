export const buyContract = async (account, vault_c) => {
  return await buyStableChicken(account, vault_c);
};

export const buyUser = async (account, vault_c, tokenId, price) => {
  await buyUserChicken(account, vault_c, tokenId, price);
};

const buyStableChicken = async (account, vault_c) => {
  try {
    console.log(await vault_c.methods);

    await vault_c.methods
      .buyNative(0)
      .send({ from: account[0], value: '100000000000000000' });
  } catch (error) {
    return false;
  }
  return true;
};

const sellStableChicken = async (account, vault_c) => {
  try {
    console.log(await vault_c.methods);

    await vault_c.methods
      .sellChicken([7], ['93000000000000000'])
      .send({ from: account[0] });
  } catch (error) {
    console.error(error);
  }
};

const buyUserChicken = async (account, vault_c, tokenId, price) => {
  try {
    console.log(await vault_c.methods);

    await vault_c.methods
      .buyChicken(tokenId)
      .send({ from: account[0], value: price });
  } catch (error) {
    console.error(error);
  }
};
