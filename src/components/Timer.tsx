"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Helper function to format total seconds into MM:SS format
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export default function Timer({
  duration,
  onExpire,
}: {
  duration: number;
  onExpire: () => void;
}) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time <= 0) {
      onExpire();
      return;
    }

    const timerId = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timerId);
  }, [time, onExpire]);

  // Dynamically change color based on time remaining
  const timerColor =
    time <= 10
      ? "text-red-500"
      : time <= 30
      ? "text-yellow-400"
      : "text-gray-100";

  // Add a pulse animation for the last 10 seconds
  const pulseAnimation =
    time <= 10
      ? {
          scale: [1, 1.05, 1],
          transition: { duration: 1, repeat: Infinity },
        }
      : {};

  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-2 bg-gray-900/60 rounded-lg border border-gray-700 font-mono text-2xl font-bold ${timerColor} transition-colors duration-500`}
      animate={pulseAnimation}
    >
      <span>⏳</span>
      <span>{formatTime(time)}</span>
    </motion.div>
  );
}