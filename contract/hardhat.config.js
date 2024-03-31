require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");
require("@nomicfoundation/hardhat-toolbox/network-helpers");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      // 로컬 개발용 네트워크 설정. 기본적으로 구성됨
    },
    ropsten: {
      url: "https://public-01.testnet.bifrostnetwork.com/rpc", // Infura를 통한 Ropsten 네트워크 연결
      // accounts: [``], // 배포에 사용할 계정의 프라이빗 키
    },
    // 추가 네트워크 설정 (예: 메인넷, 기타 테스트넷 등)
  },
};
