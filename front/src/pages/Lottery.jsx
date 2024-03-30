import React, { useContext, useEffect, useState } from 'react';
import styled, {css, createGlobalStyle} from 'styled-components';
import { AppContext } from '../App';
import { API_URL } from '../utils/consts';
import axios from "axios";
import { bettingAPI, buyAPI } from '../utils/api';
import { Link, useNavigate } from "react-router-dom";
import { connect } from '../evmInteraction/connect';

const LotteryContainer = styled.div`
  background-color: #FFEBF2; /* Soft pink background */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Poppins', sans-serif;
`;


const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 2px solid #FFC0CB; /* Light pink border */
  border-radius: 20px; /* Rounded edges */
  width: 250px;
  text-align: center;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #FF69B4; /* Brighter pink for the button */
  color: white;
  border-radius: 20px; /* Rounded edges for the button */
  cursor: pointer;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: background-color 0.2s, transform 0.1s;
  &:hover {
    background-color: #FF1493; /* Darker pink on hover */
    transform: translateY(-2px); /* Slight raise effect */
  }
  &:active {
    transform: translateY(1px); /* Pressed effect */
  }
`;

const Result = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 20px; /* Rounded edges for the result box */
  color: #fff;
  background-color: ${props => props.isSuccess ? '#98FB98' : '#FFB6C1'}; /* Success in light green, failure in light pink */
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
`;

const DigitContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%; /* Perfect circle */
  background-color: #FFC0CB; /* Light pink background */
  color: white;
  font-size: 24px;
  margin: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  font-family: 'Poppins', sans-serif;
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFC0CB; /* Light pink to match the theme */
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 20px; /* Rounded edges */
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  background: -webkit-linear-gradient(45deg, #FF69B4, #FFC0CB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const BettingButton = styled.button`
  padding: 10px 20px;
  margin: 5px; /* Slight separation between buttons */
  border: none;
  background-color: #FFB6C1; /* Slightly lighter pink */
  color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #FF1493; /* Darker pink on hover */
    transform: translateY(-2px); /* Slight raise effect */
  }
  &:active {
    transform: translateY(1px); /* Pressed effect */
  }
`;

const WaitingMessage = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 20px;
  color: white;
  background: linear-gradient(45deg, #FF69B4, #FFC0CB); /* Harmonizing with the Title component */
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  white-space: pre-wrap; /* Ensures text wrapping and respects newline characters */
  max-width: 80%; /* Optimal width for readability */
  border: 2px solid #FFC0CB; /* Light pink border to blend with the gradient */
  transition: transform 0.2s, background-color 0.2s; /* Smooth transition for hover effect */

  &:hover {
    transform: translateY(-2px); /* Slight elevation on hover */
    background: linear-gradient(45deg, #FF1493, #FF69B4); /* Slightly darker gradient on hover for interaction feedback */
  }
`;

const BettingStatusMessage = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 20px;
  background-color: #FFC0CB; /* Light pink background to match the theme */
  color: white;
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;



const Lottery = () => {
  const [entry, setEntry] = useState('');
  const [lotteryResult, setLotteryResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { account, setAccount, chain, web3, decimals } = useContext(AppContext);
  const [countdown, setCountdown] = useState("00:00:00");
  const [targetDate, setTargetDate] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [hasCountdownFinished, setHasCountdownFinished] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userEgg, setUserEgg] = useState(0);
  const [mostRecentGame, setMostRecentGame] = useState({});
  const [userRecentBetting, setUserRecentBetting] = useState({});

  const handleBet = (amount) => {
    setBetAmount(amount);
    // Additional logic for placing a bet...
  };
  
  
  const fetchData = async () => {
    try {
      const accountRes = await axios.get(`${API_URL}/user?account=${account}`);      
      const mostRecentGame = await axios.get(`${API_URL}/game`);
      const endTime = Number(mostRecentGame.data.game.end_time) * 1000

      const users = accountRes.data.users
      setMostRecentGame({
          game_id: mostRecentGame.data.game.game_id,
          winner_position: mostRecentGame.data.game.winner_position,
          end_time: Number(mostRecentGame.data.game.end_time) * 1000,
          is_ended: mostRecentGame.data.game.is_ended
      });
      setTargetDate(endTime);
      if (account) {
        console.log("endTime:", endTime)
        const bettingRes = await axios.get(`${API_URL}/betting?address=${account}`);
        console.log("bettingRes:", bettingRes);
        setUserEgg(users[0].egg); // Assuming the response contains an eggBalance field
      }
    } catch (error) {
      console.error("Failed to on lottery:", error);
      // Handle error appropriately
    }
  };

  const calculateCountdown = () => {
    // Set your target date/time for countdown
    const now = new Date().getTime();
    const distance = targetDate - now;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEntry(value.slice(0, 4));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    console.log('handleSubmit:', betAmount, account, hasCountdownFinished);
    if (betAmount === 0) {
      alert("Please select a bet amount!");
      return;
    }
    if (userEgg < betAmount) {
      alert("Not enough eggs!");
      return;
    }
    if (!entry){
      alert("Please enter a number!");
      return;
    }
    if (!account) {
      alert("Please connect your wallet!");
      await connect(chain);
      return;
    }
    if (mostRecentGame.is_ended || userRecentBetting.game_id === mostRecentGame.game_id) {
      window.location.reload();
      return
    }

    setUserRecentBetting({
      game_id: mostRecentGame.game_id,
      amount: betAmount,
      position: entry
    })
    bettingAPI(account, betAmount);
    setHasSubmitted(true); // Disable further submissions
  };


  const handlePreviousBetting = async () => {
    const game_id = userRecentBetting.game_id
    console.log('userRecentBetting:', userRecentBetting)
    if (!game_id) return

    const gameRes = await axios.get(`${API_URL}/game?game_id=${game_id}`);

    const winNumber = gameRes.data.game.winner_position;
    console.log('winNumber:', winNumber, entry)
    const didWin = entry === winNumber;
    setIsSuccess(didWin);
    setLotteryResult(didWin ? "Congratulations! You've won!" : "Sorry, better luck next time!");
  }

  useEffect(() => {
    fetchData();
    handlePreviousBetting()
  }, []);

  useEffect(() => {
    if (targetDate) {
      const timer = setInterval(() => {
        const newCountdown = calculateCountdown();
        setCountdown(newCountdown);
        
        const now = new Date().getTime();
        if (targetDate <= now) {
          setHasCountdownFinished(true);
          clearInterval(timer); // Stop the timer once the countdown is finished
        }
      }, 1000);
  
      return () => clearInterval(timer);
    }
  }, [targetDate]);

  return (
    <>
    <LotteryContainer>
      {
        mostRecentGame.is_ended && userRecentBetting.game_id === mostRecentGame.game_id ? (
          <BettingStatusMessage>
            Your bet for game {mostRecentGame.game_id} was {userRecentBetting.amount} eggs.
            {userRecentBetting.didWin ? " Congratulations, you won!" : " Better luck next time!"}
          </BettingStatusMessage>
        ) : null
      }
      <Title>Lottery</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          value={entry}
          onChange={handleChange}
          placeholder="Enter a 4-digit number"
          maxLength="4"
        />
        <SubmitButton type="submit" disabled={hasSubmitted}>Submit Entry</SubmitButton>
      </form>
      
      <div>
        <BettingButton onClick={() => handleBet(1)}>1</BettingButton>
        <BettingButton onClick={() => handleBet(5)}>5</BettingButton>
        <BettingButton onClick={() => handleBet(10)}>10</BettingButton>
      </div>
      {hasCountdownFinished ? (
        lotteryResult && (
          <Result isSuccess={isSuccess}>
            {lotteryResult}
            <div>
              {entry.split('').map((digit, index) => (
                <DigitContainer key={index}>{digit}</DigitContainer>
              ))}
            </div>
          </Result>
        )
      ) : (
        <WaitingMessage>
          {`You have ${userEgg} eggs \nYou Bet ${entry} with ${betAmount} eggs! \nPlease wait until the draw...`}
        </WaitingMessage>
      )}
      <CountdownContainer>
        Countdown to Draw: {countdown}
      </CountdownContainer>
    </LotteryContainer>
    </>
  );
};

export default Lottery;
