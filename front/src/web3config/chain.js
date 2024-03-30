import { CHAIN } from "../utils/consts";

export const getNftContract = () => {
  if (CHAIN == "CELO") {
    return "0xD85Cd1c7FC69d5a42aA41Ed3D61c0AAEe712b810";
  }
};

export const getVaultContract = () => {
  if (CHAIN == "CELO") {
    return "0x2e8e1E3a095A823A541b2B0C699951c4CaAa3a74";
  }
};

export const getLotteryLight = () => {
  if (CHAIN == "CELO") {
    return "0x53B4b8be0334Fd896D4beb670051ab66AC874F76";
  }
};
