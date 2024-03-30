import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import StatusBar from "./components/StatusBar";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
import Footer from "./components/Footer";
import List from "./pages/List";
import Market from "./pages/Market";
import Web3 from "web3";
import WriteLottery from "./pages/WriteLottery";
import BuyLottery from "./pages/BuyLottery";
import Lottery from "./pages/Lottery";
import Main from "./pages/Main";
import { vault_abi } from "./web3config/CockfightVaultLight";
import { nft_abi } from "./web3config/ChickenContractLight";
import { SaleContract_ABI, SaleContract_ADD } from "./web3.config";

export const AppContext = createContext();

function App() {
  const [temp, setTemp] = useState();
  const [chain, setChain] = useState("BFC");
  const [decimals, setDecimals] = useState(18);
  const [account, setAccount] = useState("");
  const web3 = new Web3(window.ethereum);
  const n_add = "0xD85Cd1c7FC69d5a42aA41Ed3D61c0AAEe712b810";
  const v_add = "0x2e8e1E3a095A823A541b2B0C699951c4CaAa3a74";
  const nft_c = new web3.eth.Contract(nft_abi, n_add);
  const vault_c = new web3.eth.Contract(vault_abi, v_add);
  useEffect(() => {
    console.log(vault_c);
  }, []);

  return (
    <div>
      <AppContext.Provider
        value={{
          temp,
          setTemp,
          account,
          setAccount,
          nft_c,
          vault_c,
          web3,
          chain,
          setChain,
          decimals,
          setDecimals,
        }}
      >
        <BrowserRouter>
          <div className="iphone">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/main" element={<Main />} />
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/list" element={<List />} />
              <Route path="/market" element={<Market />} />
              <Route path="/lottery" element={<Lottery />} />
              <Route path="/write-lottery" element={<WriteLottery />} />
              <Route path="/buy-lottery" element={<BuyLottery />} />
            </Routes>
            {account && <Footer />}
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
