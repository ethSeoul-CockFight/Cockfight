import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Lottery = () => {
    // 추후에 동적으로 변경할 부분
    const [betAmount, setBetAmount] = useState({ eggs: 1030, dollars: 1250 });
    const [payout, setPayout] = useState({ eggs: 969, dollars: 980 });
    const [playerCount, setPlayerCount] = useState({ current: 4, max: 10 });
    const [countTime, setCountTime] = useState('1 Days 2 Hours 16 Min 35 Sec');  // 나중에 시간 동적으로 변경 가능하게

    const navigate = useNavigate(); 
    const handleStartGame = () => {
        navigate('/buy-lottery'); // 여기서 '/your-destination-path'는 이동하고자 하는 경로입니다.
      };
  return (
    <div style={{ maxWidth: '540px', margin: 'auto' }}>
      <div>
        <div>
            Lottery Game
        </div>
        
    
        
        <div size="xl" weight={700} align="center">
          Lottery Game
        </div>
        
        <div>
          <div>
            How to play game
          </div>
          <div>1. Enter four lottery numbers between 1 and 50.</div>
        </div>
        
        <div>
      <div>
        Count time
      </div>                                 
      <div>{countTime}</div>      
    </div>
        
        <div>
          <div>
            Current status
          </div>
          <div>Bet amount : {betAmount.eggs.toLocaleString()} eggs (${betAmount.dollars.toLocaleString()})</div>
          <div>Pay out : {payout.eggs.toLocaleString()} eggs (${payout.dollars.toLocaleString()})</div>
          <div>The number of players : {playerCount.current}/{playerCount.max}</div>
        </div>
        
        <button fullWidth style={{ marginTop: 16 }} onClick={handleStartGame}>
          Start game
        </button>
      </div>
    </div>
  );
};

export default Lottery;
