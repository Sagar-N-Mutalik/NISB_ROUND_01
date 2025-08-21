import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Player from "@/modals/player";
import { calculateScore } from "@/lib/scoring";

export async function POST(req: Request) {
  const { playerId, answer } = await req.json();
  await connectDB();

  const player = await Player.findById(playerId);
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  // Bonus correctness check
  if (answer.toLowerCase() === "1884") {
    player.score += calculateScore(0, true);
  }
  player.bonusAnswer = answer;
  await player.save();

  return NextResponse.json({ success: true, score: player.score });
}
