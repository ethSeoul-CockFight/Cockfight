import React, { useContext } from "react";
import { RiHomeLine } from "react-icons/ri";
import { TbShoppingBag } from "react-icons/tb";
import { BiGame } from "react-icons/bi";
import { VscDashboard } from "react-icons/vsc";
import { GoPerson, GoScreenFull } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import footerStore from "../stores/footerStore";

const Footer = () => {
  const { activeMenu, setActiveMenu } = footerStore();
  const navigate = useNavigate();

  const onClickHome = () => {
    setActiveMenu("main");
    navigate(`/main`);
  };

  const onClickGame = () => {
    setActiveMenu("game");
    navigate("/lottery");
  };

  const onClickHatchery = () => {
    setActiveMenu("dashboard");
    navigate("/Hatchery");
  };

  const onClickMarket = () => {
    setActiveMenu("market");
    navigate("/market");
  };

  const onClickMyPage = () => {
    setActiveMenu("myPage");
    navigate("/my-page");
  };

  return (
    <FooterContainer>
      <FooterButton onClick={onClickHome} isActive={activeMenu === "main"}>
        <RiHomeLine
          size="24px"
          color={activeMenu === "main" ? "#582fff" : "#4b5563"}
        />
        <IconLabel>Home</IconLabel>
      </FooterButton>
      <FooterButton onClick={onClickGame} isActive={activeMenu === "game"}>
        <BiGame
          size="24px"
          color={activeMenu === "game" ? "#582fff" : "#4b5563"}
        />
        <IconLabel>Games</IconLabel>
      </FooterButton>

      <FooterButton
        onClick={onClickHatchery}
        isActive={activeMenu === "dashboard"}
      >
        <VscDashboard
          size="24px"
          color={activeMenu === "dashboard" ? "#582fff" : "#4b5563"}
        />
        <IconLabel>Hatchery</IconLabel>
      </FooterButton>
      <FooterButton onClick={onClickMarket} isActive={activeMenu === "market"}>
        <TbShoppingBag
          size="24px"
          color={activeMenu === "market" ? "#582fff" : "#4b5563"}
        />
        <IconLabel>Market</IconLabel>
      </FooterButton>
      <FooterButton onClick={onClickMyPage} isActive={activeMenu === "myPage"}>
        <GoPerson
          size="24px"
          color={activeMenu === "myPage" ? "#582fff" : "#4b5563"}
        />
        <IconLabel>My Page</IconLabel>
      </FooterButton>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 70px;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  background-color: white;
`;

const FooterButton = styled.button`
  height: 100%;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ isActive }) =>
    isActive
      ? `
    #582fff
  `
      : `#4b5563`};
  &:hover {
    background-color: #f3f4f6;
  }
  &:last-child {
    border-right: none;
  }
`;

const IconLabel = styled.div`
  font-size: 10px;
  font-weight: 400;
  text-align: center;
  margin-top: 4px;
`;
