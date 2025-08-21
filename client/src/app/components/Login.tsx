"use client";
import React, { useState } from 'react';

export default function Login({ onLogin }: { onLogin: (data: any) => void }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!name.trim() || !code.trim()) {
            setError("Name and code are required.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, code }),
            });
            const data = await res.json();
            if (res.ok) {
                onLogin(data);
            } else {
                throw new Error(data.message);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="card w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">Mind Mashup</h1>
                <div className="space-y-4">
                    <input type="text" placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                    <input type="text" placeholder="Enter Group Code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input-field" />
                    <button onClick={handleLogin} className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? "Joining..." : "Join Game"}
                    </button>
                    {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
}