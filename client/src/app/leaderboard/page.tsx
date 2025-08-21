"use client";
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LeaderboardPage() {
    // In a real multi-group scenario, you'd get the groupId from a URL parameter
    // For now, we'll just show all players as an example of a global leaderboard
    const { data: players, error } = useSWR('/api/groups', fetcher, { refreshInterval: 5000 });

    if (error) return <div className="text-red-500">Failed to load leaderboard</div>;
    if (!players) return <div className="text-white">Loading leaderboard...</div>;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="card w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">Leaderboard</h1>
                <div className="space-y-3">
                    {players.sort((a: any, b: any) => b.totalScore - a.totalScore).map((p: any, index: number) => (
                        <div key={p._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                            <span className="font-bold text-lg">{index + 1}. {p.name}</span>
                            <span className="font-mono text-xl text-yellow-300">{p.totalScore} pts</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}