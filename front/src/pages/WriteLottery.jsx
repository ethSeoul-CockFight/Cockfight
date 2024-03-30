import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Modal = ({ opened, title, goToHome, goToMyPage }) => {
    if (!opened) return null;
  
    return (
      <ModalOverlay>
        <ModalBody>
          <h2>{title}</h2>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <StyledButton color="green" onClick={goToHome}>
              Go to Home
            </StyledButton>
            <StyledButton color="gray" onClick={goToMyPage}>
              Go to My Page
            </StyledButton>
          </div>
        </ModalBody>
      </ModalOverlay>
    );
  };

const WriteLottery = () => {
    const navigate = useNavigate();
    const [modalOpened, setModalOpened] = useState(false);

    const handleNotice = () => {
        setModalOpened(true);
    };

    const goToHome = () => navigate('/main');
    const goToMyPage = () => navigate('/my');

    const [digits, setDigits] = useState(["_", "_", "_", "_"]);

    const handleDigitChange = (value, index) => {
        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);
    };

    const handleAutoGenerate = () => {
        const newDigits = digits.map(() => Math.floor(Math.random() * 10).toString());
        setDigits(newDigits);
    };

    const addInputFields = (numberOfLines) => {
      // 한 줄에 4개의 입력 필드가 있으므로, 총 필요한 입력 필드 수를 계산
      const totalFieldsToAdd = numberOfLines * 4;
      // 새로운 입력 필드들('_')을 포함하는 배열 생성
      const newFields = Array(totalFieldsToAdd).fill('_');
      // 기존 digits 배열에 새로운 입력 필드들을 추가
      setDigits([...digits, ...newFields]);
  };

    // digits 배열을 4개씩 나누어 처리하기 위한 로직
    const chunkedDigits = [];
    for (let i = 0; i < digits.length; i += 4) {
        chunkedDigits.push(digits.slice(i, i + 4));
    }

    return (
        <>
            <div>
                <div>Enter four lottery numbers between 0 and 9</div>
                <div>
                    {chunkedDigits.map((chunk, chunkIndex) => (
                        <div key={chunkIndex} style={{ display: 'flex', marginBottom: '8px' }}>
                            {chunk.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit !== "_" ? digit : ""}
                                    onChange={(e) => handleDigitChange(e.target.value, (chunkIndex * 4) + index)}
                                    className="text-center bg-transparent outline-none"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        lineHeight: '40px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        borderBottom: "2px solid black",
                                        marginRight: '8px',
                                        color: digit === "_" ? "transparent" : "black",
                                        textShadow: digit === "_" ? "0 0 0 black" : "none"
                                    }}
                                    pattern="\d*"
                                />
                            ))}
                        </div>
                    ))}
                    <button onClick={() => addInputFields(9)}>Add Input Field</button>
                </div>
                <button onClick={handleAutoGenerate}>AutoGenerate</button>
                <button onClick={handleNotice}>OK</button>
            </div>
            <Modal
                opened={modalOpened}
                title="Congratulations!"
                goToHome={goToHome}
                goToMyPage={goToMyPage}
           />
        </>
    );
};

export default WriteLottery;


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalBody = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: auto;
  max-width: 500px;
  width: 100%; // 모바일 화면에서는 너비를 꽉 채우도록 조정
  position: relative;
  overflow: hidden;
`;

const StyledButton = styled.button`
  padding: 12px 24px;
  margin-left: ${(props) => (props.color === 'gray' ? '10px' : '0')};
  background-color: ${(props) => (props.color === 'green' ? 'green' : 'gray')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;