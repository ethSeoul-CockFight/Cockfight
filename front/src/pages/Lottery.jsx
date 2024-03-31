import React, { useContext, useEffect, useState } from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import { AppContext } from '../App';
import { API_URL } from '../utils/consts';
import axios from 'axios';
import { bettingAPI, buyAPI } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from '../evmInteraction/connect';

const LotteryContainer = styled.div`
  background-color: #ffebf2; /* Soft pink background */
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
  border: 2px solid #ffc0cb; /* Light pink border */
  border-radius: 20px; /* Rounded edges */
  width: 250px;
  text-align: center;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #ff69b4; /* Brighter pink for the button */
  color: white;
  border-radius: 20px; /* Rounded edges for the button */
  cursor: pointer;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: background-color 0.2s, transform 0.1s;
  &:hover {
    background-color: #ff1493; /* Darker pink on hover */
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
  background-color: ${(props) =>
    props.isSuccess
      ? '#98FB98'
      : '#FFB6C1'}; /* Success in light green, failure in light pink */
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
`;

const DigitContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px; /* 컨테이너의 너비를 약간 넓힙니다. */
  height: 70px; /* 컨테이너의 높이를 약간 높입니다. */
  border-radius: 50%; /* 완벽한 원을 유지합니다. */
  background-color: #ffaddf; /* 배경색을 더 밝은 핑크색으로 변경합니다. */
  color: #ffffff; /* 글자 색상을 유지합니다. */
  font-size: 28px; /* 글자 크기를 더 크게 조정합니다. */
  margin: 5px; /* 마진을 유지하여 컨테이너 간 간격을 둡니다. */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* 그림자를 더 두드러지게 합니다. */
  font-family: 'Poppins', sans-serif; /* 폰트 패밀리를 유지합니다. */
  font-weight: 600; /* 글자 무게를 중간 정도로 설정합니다. */
  transition: transform 0.3s ease-in-out; /* 부드러운 변환 효과를 추가합니다. */

  &:hover {
    transform: scale(1.1); /* 호버 시 컨테이너를 약간 확대합니다. */
    background-color: #ff1493; /* 호버 시 배경색을 더 진한 핑크색으로 변경합니다. */
  }
`;
const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffc0cb; /* Light pink to match the theme */
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 20px; /* Rounded edges */
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  background: -webkit-linear-gradient(45deg, #ff69b4, #ffc0cb);
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
  background-color: #ffb6c1; /* Slightly lighter pink */
  color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #ff1493; /* Darker pink on hover */
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
  background: linear-gradient(
    45deg,
    #ff69b4,
    #ffc0cb
  ); /* Harmonizing with the Title component */
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  white-space: pre-wrap; /* Ensures text wrapping and respects newline characters */
  max-width: 80%; /* Optimal width for readability */
  border: 2px solid #ffc0cb; /* Light pink border to blend with the gradient */
  transition: transform 0.2s, background-color 0.2s; /* Smooth transition for hover effect */

  &:hover {
    transform: translateY(-2px); /* Slight elevation on hover */
    background: linear-gradient(
      45deg,
      #ff1493,
      #ff69b4
    ); /* Slightly darker gradient on hover for interaction feedback */
  }
`;

const BettingStatusMessage = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 20px;
  background-color: #ffc0cb; /* Light pink background to match the theme */
  color: white;
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SuccessModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  background-color: white;
  border: 2px solid #4caf50;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 1000; // Ensure it's above other content
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999; // Behind the modal, but above other content
`;

const Lottery = () => {
  const [entry, setEntry] = useState('');
  const [lotteryResult, setLotteryResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { account, setAccount, chain, web3, decimals, lotto_c } =
    useContext(AppContext);
  const [countdown, setCountdown] = useState('00:00:00');
  const [targetDate, setTargetDate] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [hasCountdownFinished, setHasCountdownFinished] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [userEgg, setUserEgg] = useState(0);
  const [mostRecentGame, setMostRecentGame] = useState({});
  const [userRecentBetting, setUserRecentBetting] = useState({});
  const [winNumber, setWinNumber] = useState(0);
  const [submitModal, setSubmitModal] = useState(false);
  
  const navigate = useNavigate();
  const handleBet = (amount) => {
    setBetAmount(amount);
    // Additional logic for placing a bet...
  };

  const onCloseSubmitModal = () => {
    setSubmitModal(false);
  };

  useEffect(() => {
    setWinNumber(Math.floor(1000 + Math.random() * 9000));
    if (!account) {
      navigate('/main');
    }
  }, []);

  const fetchData = async () => {
    try {
      const mostRecentGame = await axios.get(`${API_URL}/game`);
      const endTime = Number(mostRecentGame.data.game.end_time) * 1000;
      setMostRecentGame({
        game_id: mostRecentGame.data.game.game_id,
        winner_position: mostRecentGame.data.game.winner_position,
        end_time: Number(mostRecentGame.data.game.end_time) * 1000,
        is_ended: mostRecentGame.data.game.is_ended,
      });
      setTargetDate(endTime);
      if (account) {
        const accountRes = await axios.get(
          `${API_URL}/user?address=${account[0]}`,
        );
        const users = accountRes.data.users;
        setUserEgg(users[0].egg); // Assuming the response contains an eggBalance field
      }
    } catch (error) {
      console.error('Failed to on fetch data:', error);
      // Handle error appropriately
    }
  };

  const calculateCountdown = () => {
    // Set your target date/time for countdown
    const now = new Date().getTime();
    const distance = targetDate - now;

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEntry(value.slice(0, 4));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasSubmitted) {
      alert("You've already submitted your bet!");
      return;
    }
    if (betAmount === 0) {
      alert('Please select a bet amount!');
      return;
    }
    if (userEgg < betAmount) {
      alert('Not enough eggs!');
      return;
    }
    if (!entry) {
      alert('Please enter a number!');
      return;
    }
    if (!account) {
      alert('Please connect your wallet!');
      await connect(chain);
      return;
    }
    if (
      mostRecentGame.is_ended ||
      userRecentBetting.game_id === mostRecentGame.game_id
    ) {
      return;
    }

    setUserRecentBetting({
      game_id: mostRecentGame.game_id,
      amount: betAmount,
      position: entry,
    });

    const bettingBody = {
      address: account[0],
      game_id: mostRecentGame.game_id,
      egg: betAmount,
      position: entry,
    };

    bettingAPI(account, betAmount, bettingBody);

    // contract call
    await lotto_c.methods.makeBet(entry, betAmount).send({ from: account[0] });
    setSubmitModal(true);
    setHasSubmitted(true); // Disable further submissions
  };

  const handlePreviousBetting = async () => {
    try {
      
      const didWin = entry === winNumber;
      setIsSuccess(didWin);
      setLotteryResult(
        didWin
          ? "Congratulations! You've won!"
          : 'Sorry, better luck next time!',
      );
    } catch (error) {
      console.error('Failed on lottery:');
    }
  };

  // useEffect(() => {
    
  //   if (hasCountdownFinished) {
      
  //     setHasSubmitted(false);
  //   }
  // }, [hasCountdownFinished]);

  useEffect(() => {
    fetchData();
    handlePreviousBetting();
  }, []);

  useEffect(() => {
    if (targetDate) {
      const timer = setInterval(() => {
        const newCountdown = calculateCountdown();
        setCountdown(newCountdown);

        const now = new Date().getTime();
        if (targetDate <= now) {
          // handlePreviousBetting();
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
        {submitModal && (
          <>

            <ModalBackdrop onClick={() => onCloseSubmitModal(false)} />
            <SuccessModal>
              <div>Your Betting Submitted!</div>
            </SuccessModal>
          </>
        )}
        <Title>Lottery</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            value={entry}
            onChange={handleChange}
            placeholder="Enter a 4-digit number"
            maxLength="4"
          />
          <SubmitButton type="submit" disabled={hasSubmitted}>
            Submit
          </SubmitButton>
        </form>

        <div>
          <BettingButton onClick={() => handleBet(1)}>1</BettingButton>
          <BettingButton onClick={() => handleBet(5)}>5</BettingButton>
          <BettingButton onClick={() => handleBet(10)}>10</BettingButton>
        </div>
        {hasSubmitted ? (
          lotteryResult && (
            <Result isSuccess={isSuccess}>
              {lotteryResult}
              <div>
                <>
                {
                <DigitContainer>
                    {entry.toString().padStart(4, '0')}
                  </DigitContainer>
                }
                </>
                <>
                {
                  <DigitContainer>
                    {winNumber.toString().padStart(4, '0')}
                  </DigitContainer>
                }
                </>
                
              </div>
            </Result>
          )
        ) : (
          <WaitingMessage>
            {`You have ${userEgg} eggs \nYou Bet ${entry} with ${betAmount} eggs! \nPlease wait until the draw...`}
          </WaitingMessage>
        )}
        <CountdownContainer>Countdown to Draw: {countdown}</CountdownContainer>
      </LotteryContainer>
    </>
  );
};

export default Lottery;
