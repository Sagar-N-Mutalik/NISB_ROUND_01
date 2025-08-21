"use client";
import React from 'react';
import { Socket } from 'socket.io-client';
import Scoreboard from './Scoreboard';

export default function Lobby({ socket, userInfo, participants }: { socket: Socket, userInfo: any, participants: any[] }) {
    const startRound = () => {
        socket.emit('startRound', { 
            groupId: userInfo.group.id, 
            participantId: userInfo.participantId 
        });
    };

    return (
        <div className="flex flex-col md:flex-row items-start justify-center min-h-screen gap-8 p-8">
            <div className="card w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-purple-400 mb-2">{userInfo.group.name}</h1>
                <h2 className="text-xl text-gray-300 mb-6">Lobby</h2>
                <div className="bg-gray-900 p-4 rounded-lg min-h-[200px]">
                    <h3 className="text-lg font-semibold mb-4">Players Joined ({participants.length}/4)</h3>
                    <ul className="space-y-2">
                        {participants.map(p => (
                            <li key={p._id} className="bg-gray-700 p-3 rounded-md text-left flex justify-between items-center">
                                <span>{p.name}</span>
                                {p.isProctor && <span className="text-xs font-bold text-yellow-300 bg-yellow-800 px-2 py-1 rounded-full">PROCTOR</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                {userInfo.isProctor && (
                    <button onClick={startRound} className="btn btn-primary w-full mt-6">
                        Start Round
                    </button>
                )}
            </div>
            <div className="w-full max-w-md">
                <Scoreboard participants={participants} isFinal={false} />
            </div>
        </div>
    );
}