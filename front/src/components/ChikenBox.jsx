import { useContext, useEffect } from "react";
import { formatAmount } from "../utils/helpper";
import { buyUser } from "../evmInteraction/buyChickens";
import { AppContext } from "../App";

const ChikenBox = ({ tokenId, price }) => {
  const { account, vault_c, decimals } = useContext(AppContext);

  const onClickUserBuyChicken = async () => {
    await buyUser(account, vault_c, tokenId, price);
  };
  return (
    <div className="flex items-center justify-between p-4 h-40 shadow-md rounded-lg">
      <div className="flex items-center justify-center">
        {/* 상품 이미지와 정보를 가운데 정렬 */}
        <img
          src={`${process.env.PUBLIC_URL}/images/c_classic.png`}
          alt="Volatile Chicken"
          className="rounded-full h-16 w-16"
        />
        <div className="flex flex-col items-center ml-2">
          <h3 className="text-lg font-bold">Stable Chicken</h3>
          <p className="text-sm text-gray-600">Condition : 70%</p>
        </div>
        <div className="ml-3">{formatAmount(price, 14)} USDC</div>
      </div>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md"
        onClick={onClickUserBuyChicken}
      >
        Buy
      </button>
    </div>
  );
};

export default ChikenBox;
