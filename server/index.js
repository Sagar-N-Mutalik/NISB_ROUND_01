import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import 'dotenv/config';

import Group from './models/Group.js';
import Participant from './models/Participant.js';
import Answer from './models/Answer.js';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Change to your Next.js app's URL in production
  }
});

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Socket Server connected to MongoDB."));

const questions = JSON.parse(fs.readFileSync('./utils/questions.json', 'utf-8'));

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinGroup', async (groupId) => {
    socket.join(groupId);
    const group = await Group.findById(groupId).populate({ path: 'participants', options: { sort: { totalScore: -1 } } });
    if (group) {
      io.to(groupId).emit('lobbyUpdate', group.participants);
    }
  });

  socket.on('startRound', async ({ groupId, participantId }) => {
    const proctor = await Participant.findById(participantId);
    if (!proctor?.isProctor) return;

    const group = await Group.findById(groupId);
    if (group) {
      group.roundStarted = true;
      await group.save();
      io.to(groupId).emit('roundStarted');
    }
  });

  socket.on('nextQuestion', async ({ groupId, participantId, questionIndex }) => {
    const proctor = await Participant.findById(participantId);
    if (!proctor?.isProctor) return;
    
    const group = await Group.findById(groupId);
    const questionSet = questions[group.questionSetIndex];
    const nextIndex = questionIndex + 1;

    if (group && nextIndex < questionSet.length) {
      group.currentQuestionIndex = nextIndex;
      await group.save();
      io.to(groupId).emit('newQuestion', nextIndex);
    } else {
      io.to(groupId).emit('gameOver');
    }
  });

  socket.on('submitAnswer', async ({ groupId, participantId, questionIndex, answer, timeTaken }) => {
    const group = await Group.findById(groupId);
    if (!group) return;

    const existingAnswer = await Answer.findOne({ participantId, questionIndex, groupId });
    if (existingAnswer) return;

    const questionSet = questions[group.questionSetIndex];
    const correctAnswer = questionSet[questionIndex].answer;
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.toLowerCase();
    let points = 0;

    if (isCorrect) {
      const rank = await Answer.countDocuments({ groupId, questionIndex }) + 1;
      const pointValues = { 1: 10, 2: 8, 3: 5, 4: 2 };
      points = pointValues[rank] || 0;
    }

    await new Answer({ groupId, participantId, questionIndex, pointsAwarded: points, timeTaken }).save();
    
    const participant = await Participant.findById(participantId);
    if (participant) {
      participant.totalScore += points;
      await participant.save();
    }

    socket.emit('answerResult', { correct: isCorrect, pointsAwarded: points });

    const updatedParticipants = await Participant.find({ _id: { $in: group.participants } }).sort({ totalScore: -1 });
    io.to(groupId).emit('lobbyUpdate', updatedParticipants);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Socket.IO server listening on port ${PORT}`));