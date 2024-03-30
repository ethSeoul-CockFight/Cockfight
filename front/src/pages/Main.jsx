import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import footerStore from "../stores/footerStore";
import backgroundImage from "../images/chicken.jpg";
import chickenImage from "../images/c_classic.png";
import eggImage from "../images/egg.png";
import { AppContext } from "../App";
import { connect } from "../evmInteraction/connect";
import axios from "axios";
import { API_URL } from "../utils/consts";

const Main = () => {
  const { setActiveMenu } = footerStore();
  const { account, setAccount, web3, decimals, chain } = useContext(AppContext);
  const [chicken, setChicken] = useState(0);

  const navigate = useNavigate();
  const onClickAccount = async () => {
    try {
      const accounts = await connect(chain);
      if (accounts) {
        setAccount(accounts);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleStartGame = () => {
    navigate("/lottery");
    setActiveMenu("game");
  };

  const fetchChicken = async () => {
    try {
      const response = await axios.get(`${API_URL}/market`);
      console.log(response);
      // setChicken(response.data.eggBalance); // Assuming the response contains an eggBalance field
    } catch (error) {
      console.error("Failed to fetch egg balance:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    fetchChicken();
  }, []);

  const outDTOdata = undefined; //back에서 받아와야하는 데이터
  const number = 103256789; //chkicken 수

  return (
    <BackgroundDiv>
      <UserItems>
        <UserItemBox>
          <ImageBox src={chickenImage} alt="Chicken" />
          <NumberBox>{outDTOdata ? outDTOdata : 3}</NumberBox>
        </UserItemBox>
        <UserItemBox>
          <ImageBox src={eggImage} alt="Egg" />
          <NumberBox>{outDTOdata ? outDTOdata : 60}</NumberBox>
        </UserItemBox>
      </UserItems>
      <Scoreboard>{new Intl.NumberFormat().format(number)}</Scoreboard>
      <Description>
        {`TVL(Total Value Locked): $`}
        {outDTOdata ? outDTOdata : 253532}
      </Description>
      {account ? (
        <StartGameButton onClick={handleStartGame}>Start Game</StartGameButton>
      ) : (
        <StartGameButton onClick={onClickAccount}>
          Wallet Connect
        </StartGameButton>
      )}
    </BackgroundDiv>
  );
};

export default Main;

const BackgroundDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: cover;
  justify-content: start;
`;

const UserItems = styled.div`
  margin: 70px 0;
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const UserItemBox = styled.div`
  width: 157px;
  height: 56px;
  background-color: #bdbdbd;
  border-radius: 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px 18px 16px 18px;
`;

const ImageBox = styled.img`
  width: 46px;
  height: 44px;
  background-color: white;
  border-radius: 50%;
  object-fit: cover;
`;

const NumberBox = styled.div`
  font-family: "Inter";
  font-weight: 700;
  font-size: 30px;
  color: #000000;
`;

const Scoreboard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
height: 50px;
  background-color: black;
  color: white;
  font-size: 30px;
  font-weight: 400;
  font-family:"Last Ninja", Impact, fantasy;
  margin -top: 20px;
  margin-bottom: 4px;
  letter-spacing: 8px;
`;

const Description = styled.div`
  text-align: center;
`;

const StartGameButton = styled.button`
  margin-top: 120px;
  margin-left: auto;
  margin-right: 20px;
  background-color: #ff2222;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;
