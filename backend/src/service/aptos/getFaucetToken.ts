import axios from 'axios';

export async function getAptosFaucetToken(address: string, amount: number) {
    const aptosFaucetUrl = `https://faucet.random.aptoslabs.com/mint`;
    const res = await axios.post(aptosFaucetUrl, null, {
        params: {
          amount: amount,
          address: address
        }
      });
    return res.data;
}