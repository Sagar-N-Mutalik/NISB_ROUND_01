"use client";
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from '../components/Login';
import Lobby from '../components/Lobby';
import Question from '../components/Question';

const SOCKET_URL = "http://localhost:3001";

export default function HomePage() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('login'); // login, lobby, question, results
  const [participants, setParticipants] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('updateLobby', (participants) => {
      setParticipants(participants);
    });

    newSocket.on('joined', (data) => {
        setUserInfo(data);
        setGameState('lobby');
    });

    newSocket.on('error', (message) => {
        alert(message);
    });

    // Add listeners for 'roundStarted', 'newQuestion' here

    return () => newSocket.close();
  }, []);

  const handleLogin = (name, roomKey) => {
    socket.emit('joinRoom', { name, roomKey });
  };

  if (gameState === 'login') {
    return <Login onLogin={handleLogin} />;
  }
  if (gameState === 'lobby') {
    return <Lobby participants={participants} userInfo={userInfo} socket={socket} />;
  }
  if (gameState === 'question') {
    return <Question />; // We will build this out
  }

  return <div>Connecting...</div>;
}