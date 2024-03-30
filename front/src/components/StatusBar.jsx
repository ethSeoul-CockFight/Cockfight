import React, { useEffect, useState } from "react";
import { FaSignal, FaWifi, FaBatteryFull } from "react-icons/fa";

const StatusBar = () => {
  const [time, setTime] = useState(getTime());

  function getTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedTime = `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
    return formattedTime;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="navigation-bar border-b border-zinc-200" id="navbar">
      <div className="time">{time}</div>
      <div className="status-icons">
        <FaSignal className="icon" />
        <FaWifi className="icon" />
        <FaBatteryFull className="icon" />
      </div>
    </div>
  );
};

export default StatusBar;
