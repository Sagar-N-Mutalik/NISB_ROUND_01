"use client";
import React, { useState, useEffect } from 'react';

export default function Timer({ duration, onExpire }: { duration: number, onExpire: (time: number) => void }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire(duration);
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onExpire, duration]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-2xl font-mono font-bold text-white bg-gray-900 px-4 py-2 rounded-lg">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
    );
}