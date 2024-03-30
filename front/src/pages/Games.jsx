import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import rulletImageA from '../images/rullet1.png';
import rulletImageB from '../images/rullet2.png';
import rulletImageC from '../images/main.png';
import { useNavigate } from 'react-router-dom';
import footerStore from '../stores/footerStore';

const Games = () => {
  const { setActiveMenu } = footerStore();
  const navigate = useNavigate();
  const handleStartGame = () => {
    navigate('/lottery');
    setActiveMenu('game');
  };

  return (
    <PageContainer>
      <StyledSwiper
        spaceBetween={0} // 슬라이드 사이의 간격 설정
        centeredSlides={true} // 활성 슬라이드를 중앙에 배치
        slidesPerView={1.5} // 자동으로 슬라이드 뷰 설정
        loop={true} // 무한 반복 설정
      >
        {/* SwiperSlide 요소들 */}
        <SwiperSlide>
          <GameBox>
            <BoldLargeTextBox>Lottery Game</BoldLargeTextBox>
            <ImageBox src={rulletImageA} />
            <GameInfo>Bet amount : 35</GameInfo>
            <InfoDescription>The number of eggs bet by others</InfoDescription>
            <GameInfo>Payout : 33.25</GameInfo>
            <PlayButton onClick={handleStartGame}>Play</PlayButton>
          </GameBox>
        </SwiperSlide>
        <SwiperSlide>
          <GameBox>
            <BoldLargeTextBox>Roulette Game</BoldLargeTextBox>
            <ImageBox src={rulletImageB} />
            <GameInfo>Bet amount : 35</GameInfo>
            <InfoDescription>The number of eggs bet by others</InfoDescription>
            <GameInfo>Payout : 33.25</GameInfo>
            <PlayButton onClick={handleStartGame}>Play</PlayButton>
          </GameBox>
        </SwiperSlide>
        <SwiperSlide>
          <GameBox>
            <BoldLargeTextBox>Fight Game</BoldLargeTextBox>
            <ImageBox src={rulletImageC} />
            <GameInfo>Bet amount : 35</GameInfo>
            <InfoDescription>The number of eggs bet by others</InfoDescription>
            <GameInfo>Payout : 33.25</GameInfo>
            <PlayButton onClick={handleStartGame}>Play</PlayButton>
          </GameBox>
        </SwiperSlide>
      </StyledSwiper>
      <RewardTimeBox>
        <BoldLargeTextBox>Chris's Next Reward Time</BoldLargeTextBox>
        <BoldLargeTextBox>7 Hours 32 Min 02 Sec</BoldLargeTextBox>
      </RewardTimeBox>
    </PageContainer>
  );
};

export default Games;

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  flex-direction: column;
`;

const CarouselSlider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 50%;
`;
const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 500px; // 적당한 높이 설정

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: black;
    background-color: grey;
    border-radius: 20px; // 슬라이드의 모서리 둥글게
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); // 입체 효과를 위한 그림자
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;
    // 겹치지 않도록 슬라이드 너비 설정
    width: calc(
      (100% - 60px) / 3
    ); // 전체 너비에서 슬라이드 간 간격을 뺀 후 3으로 나눕니다.
    height: 450px; // 슬라이드 높이 설정
  }

  .swiper-slide-active {
    opacity: 1; // 활성화된 슬라이드는 완전 불투명
    transform: scale(1); // 활성화된 슬라이드는 원래 크기
  }

  .swiper-slide-next,
  .swiper-slide-prev {
    opacity: 0.6; // 비활성화된 슬라이드는 투명하게
    transform: scale(0.8); // 비활성화된 슬라이드는 축소
  }
`;

const GameBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 80%;
`;

const BoldLargeTextBox = styled.div`
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 10px;
`;

const GameInfo = styled.div`
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 10px;
  text-align: center;
`;

const InfoDescription = styled.div`
  font-weight: 400;
  font-size: 12px;
  margin-bottom: 15px;
`;

const PlayButton = styled.button`
  width: 90px;
  height: 38px;
  background-color: black;
  color: white;
  font-weight: 700;
  font-size: 14px;
  border-radius: 100px;
`;

const ImageBox = styled.img`
  width: 300px;
  object-fit: cover;
  margin-bottom: 10px;
`;

const RewardTimeBox = styled.div`
  width: 305px;
  height: 100px;
  border-radius: 15px;
  background-color: #DFDFDF;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
