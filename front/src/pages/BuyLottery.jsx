import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import styled from 'styled-components';

const BuyLottery = () => {
    const navigate = useNavigate(); 
    const handleStartGame = () => {
        navigate('/write-lottery'); // 여기서 '/your-destination-path'는 이동하고자 하는 경로입니다.
      };

      const [ticketNumber, setTicketNumber] = useState(10); // 기본값을 10으로 설정합니다.
      const [eggBalance, setEggBalance] = useState(100);
      const [eggCount, setEggCount] = useState(10000);

      const handleInputChange = (event) => {
        let value = parseInt(event.target.value, 10);
      
        // 입력 값이 최소값과 최대값 사이에 있는지 확인하고, 그렇지 않은 경우 적절히 조정
        if (value < 1) {
          value = 1;
        } else if (value > 15) {
          value = 15;
        }
      
        // 값이 유효한 숫자인지 확인 (NaN 체크)
        if (!isNaN(value)) {
          setTicketNumber(value);
          setEggCount(value * 1000); // 여기에서 eggCount 상태를 업데이트
        }
      };
      
      const handleClick = (value) => {
        let newValue = value;// eggBalance 상태 업데이트 (이전 예시에서 사용됨)
        setTicketNumber(newValue); // ticketNumber 상태 업데이트로 input 필드의 값 변경
        setEggCount(newValue*1000);
      };
      
  return (
    <>
      <div>
        <div className="text-center">
        <p className="text-sm">Your egg balance: {eggBalance}</p>
        <h2 className="text-2xl font-bold my-4">
      Buy
      <input
        type="number"
        value={ticketNumber}
        onChange={handleInputChange}
        className="mx-2 bg-transparent text-center outline-none border-0 border-white"
        style={{ width: 'auto', minWidth: '1rem' }}
        min="1" // 최소값을 1로 설정
        max="15" // 최대값을 15로 설정
      />

      lottery tickets
    </h2>
        <p className="text-sm">*1 lottery ticket is 1,000 eggs</p>
        <p className="text-sm mb-4">*You can purchase up to 15 lottery tickets.</p>
        <div className="flex justify-center space-x-4 mb-4">
        <button className="bg-white border border-gray-300 text-black" onClick={() => handleClick(5)}>5</button>
      <button className="bg-white border border-gray-300 text-black" onClick={() => handleClick(10)}>10</button>
      <button className="bg-white border border-gray-300 text-black" onClick={() => handleClick(15)}>Max</button>
        </div>
      </div>
      <div className="border-t border-b py-4 my-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Your payment amount :</h3>
          <p className="text-xl font-bold">{eggCount.toLocaleString()} eggs</p>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <button className="bg-black text-white w-full" onClick={handleStartGame}>OK</button>
      </div>
      </div>
    </>
    
  )
}

export default BuyLottery

