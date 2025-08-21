"use client";
import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import Login from './Login';
import Lobby from './Lobby';
import Question from './Question';
import Scoreboard from './Scoreboard';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export default function ClientWrapper() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [gameState, setGameState] = useState('login');
    const [userInfo, setUserInfo] = useState<any>(null);
    const [participants, setParticipants] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('mindmashup_user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUserInfo(userData);
            setGameState('lobby');
        }

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                newSocket.emit('joinGroup', userData.group.id);
            }
        });

        newSocket.on('lobbyUpdate', setParticipants);
        newSocket.on('roundStarted', () => setGameState('question'));
        newSocket.on('newQuestion', (index) => setCurrentQuestionIndex(index));
        newSocket.on('gameOver', () => setGameState('gameOver'));

        return () => { newSocket.close(); };
    }, []);

    const handleLogin = (data: any) => {
        setUserInfo(data);
        localStorage.setItem('mindmashup_user', JSON.stringify(data));
        socket?.emit('joinGroup', data.group.id);
        setGameState('lobby');
    };
    
    const handleLogout = () => {
        localStorage.removeItem('mindmashup_user');
        setUserInfo(null);
        setGameState('login');
    };

    if (!socket) return <div className="text-white text-center">Connecting...</div>;

    switch (gameState) {
        case 'login':
            return <Login onLogin={handleLogin} />;
        case 'lobby':
            return <Lobby socket={socket} userInfo={userInfo} participants={participants} />;
        case 'question':
            return <Question socket={socket} userInfo={userInfo} questionIndex={currentQuestionIndex} />;
        case 'gameOver':
            return <Scoreboard participants={participants} isFinal={true} onLogout={handleLogout} />;
        default:
            return <Login onLogin={handleLogin} />;
    }
}