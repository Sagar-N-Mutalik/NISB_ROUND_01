// import mongoose from 'mongoose';

// const GroupSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   code: { type: String, required: true, unique: true },
//   isStarted: { type: Boolean, default: false },
//   questionSetIndex: { type: Number, required: true },
//   currentQuestionIndex: { type: Number, default: -1 },
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }],
//   answers: [{
//       questionIndex: Number,
//       participantId: mongoose.Schema.Types.ObjectId,
//       timeTaken: Number,
//   }],
// });

// export default mongoose.model("Group", GroupSchema);