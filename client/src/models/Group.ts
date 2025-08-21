import mongoose, { Schema, models, Document } from "mongoose";
import { IParticipant } from "./Participant";

export interface IGroup extends Document {
  name: string;
  code: string;
  roundStarted: boolean;
  currentQuestionIndex: number;
  questionSetIndex: number;
  participants: IParticipant['_id'][];
}
// Schema is defined on the server, this is for type safety on client