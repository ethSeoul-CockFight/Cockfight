import BigNumber from 'bignumber.js';

export const formatAmount = (amount, decimals) => {
  return new BigNumber(amount)
    .div(new BigNumber(10).pow(decimals))
    .decimalPlaces(3)
    .toString();
};

export function truncate(text = '', [h, t] = [4, 4]) {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
}
