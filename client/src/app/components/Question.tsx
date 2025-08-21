"use client";
import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import questions from '@/lib/questions';
import Timer from './Timer';
import { motion } from 'framer-motion';

export default function Question({ socket, userInfo, questionIndex }: { socket: Socket, userInfo: any, questionIndex: number }) {
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<any>(null);

    const questionSet = questions[userInfo.group.id - 1];
    const currentQuestion = questionSet[questionIndex];

    useEffect(() => {
        setAnswer('');
        setSubmitted(false);
        setResult(null);
    }, [questionIndex]);

    useEffect(() => {
        socket.on('answerResult', (data) => {
            setResult(data);
        });
        return () => {
            socket.off('answerResult');
        }
    }, [socket]);


    const submitAnswer = (timeTaken: number) => {
        if (submitted || userInfo.isProctor) return;
        setSubmitted(true);
        socket.emit('submitAnswer', {
            groupId: userInfo.group.id,
            participantId: userInfo.participantId,
            questionIndex,
            answer,
            timeTaken
        });
    };

    const nextQuestion = () => {
        socket.emit('nextQuestion', {
            groupId: userInfo.group.id,
            participantId: userInfo.participantId,
            questionIndex,
        });
    };

    return (
        <motion.div 
            key={questionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-screen"
        >
            <div className="card w-full max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-purple-400">{currentQuestion.category}</h2>
                    <Timer
                        key={questionIndex}
                        duration={currentQuestion.time_limit}
                        onExpire={(time) => submitAnswer(time)}
                    />
                </div>
                <p className="text-2xl text-gray-200 my-8 min-h-[100px]">{currentQuestion.question}</p>

                {!userInfo.isProctor && (
                    <div className="space-y-4">
                        <input value={answer} onChange={(e) => setAnswer(e.target.value)} className="input-field" disabled={submitted} />
                        <button onClick={() => submitAnswer(0)} className="btn btn-primary w-full" disabled={submitted}>
                            {submitted ? 'Submitted' : 'Submit'}
                        </button>
                    </div>
                )}
                
                {result && (
                    <div className={`mt-4 text-center p-4 rounded-lg ${result.correct ? 'bg-green-800' : 'bg-red-800'}`}>
                        {result.correct ? `Correct! You earned ${result.pointsAwarded} points.` : `Incorrect.`}
                    </div>
                )}

                {userInfo.isProctor && (
                    <button onClick={nextQuestion} className="btn btn-primary w-full mt-6">
                        Next Question
                    </button>
                )}
            </div>
        </motion.div>
    );
}