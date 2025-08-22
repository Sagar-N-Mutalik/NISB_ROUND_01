import mongoose, { Schema, models, Document } from "mongoose";

export interface IAnswer extends Document {
    groupId: mongoose.Types.ObjectId;
    participantId: mongoose.Types.ObjectId;
    questionIndex: number;
    pointsAwarded: number;
    timeTaken: number;
}
// Schema is defined on the server, this is for type safety on client