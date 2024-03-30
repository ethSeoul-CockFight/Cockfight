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
import { SaleContract_ABI, SaleContract_ADD } from "./web3.config";
import Main from "./pages/Main";

export const AppContext = createContext();

function App() {
  const [temp, setTemp] = useState();
  const [chain, setChain] = useState("BFC");
  const [decimals, setDecimals] = useState(18);
  const [account, setAccount] = useState("");
  const web3 = new Web3(window.ethereum);
  const nft_c = new web3.eth.Contract(SaleContract_ABI, SaleContract_ADD);

  return (
    <div>
      <AppContext.Provider
        value={{
          temp,
          setTemp,
          account,
          setAccount,
          nft_c,
          web3,
          chain,
          setChain,
          decimals,
          setDecimals,
        }}
      >
        <BrowserRouter>
          <div className="w-full h-full sm:w-[390px] sm:h-[752px] overflow-hidden sm:rounded-[50px] relative shadow-md flex flex-col justify-between flex-1 z-10 sm:shadow-[10px_10px_50px_rgba(0,0,0,0.4)]">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/main" element={<Main />} />
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/list" element={<List />} />
              <Route path="/market" element={<Market />} />
              <Route path="/lottery" element={<Lottery />} />
              <Route path="/write-lottery" element={<WriteLottery />} />
              <Route path="/buy-lottery" element={<BuyLottery />} />
              {/* <Route path="/adminpage" element={<AdminPage />} /> */}
            </Routes>
            {account && <Footer />}
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
