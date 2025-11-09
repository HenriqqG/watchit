import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  startTime: number;
  onFinish?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ startTime, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(startTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onFinish) onFinish();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onFinish]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="font-mono text-lg font-semibold">
      {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;