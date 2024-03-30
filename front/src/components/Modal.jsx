import React, { useContext } from "react";
import { AppContext } from "../App";

const Modal = ({ isOpen, onClose }) => {

    const { account, nft_c, decimals } = useContext(AppContext);

    const buyStableChicken = async() => {
        try {
            await nft_c.methods.buyNative().send({ from: account[0], value:10000 });
        } catch (error) {
            console.error(error);    
        }
        onClose();
    }

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg p-4 z-20 w-96 ">
                {/* 모달 헤더 */}
                <div className="modal-content mb-4 flex justify-between items-center ">
                    <div className="text-blue-500 text-2xl font-bold">
                        Chicken Details
                    </div>
                    <div onClick={onClose}>
                        <img
                            src={`${process.env.PUBLIC_URL}/images/icons/exit.svg`}
                            alt="Volatile Chicken"
                        />
                    </div>
                </div>

                {/* 모달 내용 */}
                <div className="flex flex-col justify-between items-center p-4">
                    <div className=" font-bold">
                        <div className="mb-4">
                            Buy Price: <span>-INIT</span>
                        </div>
                        <div className="mb-4">
                            Sell Price: <span>- INIT</span>
                        </div>
                        <div className="mb-4">
                            Egg Production: <span>- INIT</span>
                        </div>
                        <div className="mb-4 flex items-center">
                            <div>Quantity: </div>
                            <input
                                type="text"
                                className="rounded w-20 h-8 bg-white border border-gray-300 ml-2 text-center"
                            />
                        </div>
                    </div>
                </div>

                {/* 확인 및 취소 버튼 */}
                <div className="modal-buttons flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                        onClick={buyStableChicken}
                    >
                        Buy
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        Sell
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default Modal;
