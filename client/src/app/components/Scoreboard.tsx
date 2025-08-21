import React from 'react';
import { IParticipant } from '@/models/Participant';

export default function Scoreboard({ participants, isFinal, onLogout }: { participants: IParticipant[], isFinal: boolean, onLogout?: () => void }) {
    return (
        <div className="card w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-purple-400 mb-4">
                {isFinal ? "Final Scoreboard" : "Live Scores"}
            </h2>
            <div className="space-y-2">
                {participants.map((p, index) => (
                    <div key={p._id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center">
                        <span className="font-bold">{index + 1}. {p.name}</span>
                        <span className="font-mono text-lg">{p.totalScore} pts</span>
                    </div>
                ))}
            </div>
            {isFinal && onLogout && (
                <button onClick={onLogout} className="btn btn-primary w-full mt-6">
                    Play Again
                </button>
            )}
        </div>
    );
}