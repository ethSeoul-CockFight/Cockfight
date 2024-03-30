import { CHAIN } from "../utils/consts";

export const getNftContract = () => {
  if (CHAIN == "CELO") {
    return "0xD85Cd1c7FC69d5a42aA41Ed3D61c0AAEe712b810";
  } else if (CHAIN == "KLAYTN") {
    return "0x861455DA34a78EBdf1E8362c186833A7D7857376";
  } else if (CHAIN == "FHENIX") {
    return "0x861455DA34a78EBdf1E8362c186833A7D7857376";
  } else if (CHAIN == "NEON") {
    return "0x861455DA34a78EBdf1E8362c186833A7D7857376";
  }
};

export const getVaultContract = () => {
  if (CHAIN == "CELO") {
    return "0x2e8e1E3a095A823A541b2B0C699951c4CaAa3a74";
  } else if (CHAIN == "KLAYTN") {
    return "0x76FABC14EC01DcD0Cf8E5119f26AA4b7f24c91eE";
  } else if (CHAIN == "FHENIX") {
    return "0x86C413143B81f5DcF0db2474B28A8ab27651134C";
  } else if (CHAIN == "NEON") {
    return "0x76FABC14EC01DcD0Cf8E5119f26AA4b7f24c91eE";
  }
};

export const getLotteryLight = () => {
  if (CHAIN == "CELO") {
    return "0x53B4b8be0334Fd896D4beb670051ab66AC874F76";
  } else if (CHAIN == "KLAYTN") {
    return "0x28323d59965A389d27f1e0C7E6e970ff1521b060";
  } else if (CHAIN == "FHENIX") {
    return "0x0645CAb4F544F450A8b653Ac2Bf32f40f9FBC08E";
  } else if (CHAIN == "NEON") {
    return "0x7746517E588e3b19d398e3C5b21777c8EE00575c";
  }
};
