import React, { useEffect } from 'react';
import { createContext, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';
import MyPage from './pages/MyPage';
import Footer from './components/Footer';
import Web3 from 'web3';
import WriteLottery from './pages/WriteLottery';
import BuyLottery from './pages/BuyLottery';
import Lottery from './pages/Lottery';
import Main from './pages/Main';
import Games from './pages/Games';
import { vault_abi } from './web3config/CockfightVaultLight';
import { nft_abi } from './web3config/ChickenContractLight';
import { getNftContract, getVaultContract } from './web3config/chain';
import Hatchery from './pages/Hatchery';
import Market from './pages/Market';
import { CHAIN } from './utils/consts';

export const AppContext = createContext();

function App() {
  const [temp, setTemp] = useState();
  const [chain, setChain] = useState(CHAIN);
  const [decimals, setDecimals] = useState(14);
  const [account, setAccount] = useState('');
  const web3 = new Web3(window.ethereum);
  const n_add = getNftContract();
  const v_add = getVaultContract();
  const nft_c = new web3.eth.Contract(nft_abi, n_add);
  const vault_c = new web3.eth.Contract(vault_abi, v_add);
  useEffect(() => {
    console.log(vault_c);
    console.log(nft_c);
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
              <Route path="/market" element={<Market />} />
              <Route path="/Hatchery" element={<Hatchery />} />
              <Route path="/lottery" element={<Lottery />} />
              <Route path="/write-lottery" element={<WriteLottery />} />
              <Route path="/buy-lottery" element={<BuyLottery />} />
              <Route path="/games" element={<Games />} />
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
