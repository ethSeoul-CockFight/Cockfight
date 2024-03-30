import React, { useContext, useEffect, useState } from "react";

import ChikenBox from "../components/ChikenBox";
import { getSellingList } from "../evmInteraction/connect";
import LoadingPage from "../components/Loading";
import { AppContext } from "../App";

const Market = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { vault_c, account } = useContext(AppContext);

  const [sellList, setSellList] = useState();

  const getSellingData = async () => {
    const response = await getSellingList(vault_c);
    setSellList(response);
    console.log(response);
    setIsLoading(false);
  };

  useEffect(() => {
    getSellingData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex justify-center text-3xl font-bold pt-80">
          <LoadingPage />
        </div>
      ) : (
        <div className="h-full overflow-y-scroll overflow-x-hidden scrollbar-hide">
          {/* 헤더 */}
          <div
            className="flex justify-around h-12 items-center  border-b-4
     border-zinc-200"
          >
            <div className="text-2xl font-bold">Market</div>
          </div>

          <div>
            {sellList[0]?.map((v, i) => (
              <ChikenBox key={i} tokenId={v} price={sellList[1][i]} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Market;

// 판매 리스트, getsellingchikens(tokenID, price)
// 구매하기, - buychkien
