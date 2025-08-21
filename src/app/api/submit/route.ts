import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Player from "@/modals/player";
import { calculateScore } from "@/lib/scoring";

export async function POST(req: Request) {
  const { playerId, correct, position, gameName } = await req.json();
  await connectDB();

  const player = await Player.findById(playerId);
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  if (correct) {
    player.score += calculateScore(position, false);
  }
  player.completedGames.push(gameName);
  await player.save();

  return NextResponse.json({ success: true, newScore: player.score });
}
