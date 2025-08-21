import React, { useEffect, useRef } from "react";

interface TimerProps {
  duration: number; // seconds
  onExpire: () => void;
}

export default function Timer({ duration, onExpire }: TimerProps) {
  const [time, setTime] = React.useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [duration, onExpire]);

  return (
    <div className="text-lg font-mono text-blue-600 mb-2">
      Time left: {time}s
    </div>
  );
}
