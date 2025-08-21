import mongoose, { Schema, models, Document } from "mongoose";

export interface IParticipant extends Document {
  _id: string;
  name: string;
  isProctor: boolean;
  totalScore: number;
}
// Schema is defined on the server, this is for type safety on client