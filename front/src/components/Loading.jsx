import React, { useState, useEffect } from "react";
import LoadignIcon from "../components/LoadingIcon";

function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  const StateChange = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div className="w-20">
      {isLoading && <LoadignIcon />}
      <button onClick={StateChange}>{isLoading ? "" : ""}</button>
    </div>
  );
}

export default LoadingPage;
