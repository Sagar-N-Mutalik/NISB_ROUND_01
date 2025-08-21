import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  score: number;
  currentGame: string;
  completedGames: string[];
  bonusAnswer?: string;
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  currentGame: { type: String, default: "" },
  completedGames: { type: [String], default: [] },
  bonusAnswer: { type: String },
   // Optional field for session tracking
});

const Player: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>("Player", PlayerSchema);
export default Player;
