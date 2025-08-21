import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Player from "@/modals/player";
import { getNextGame } from "@/lib/gameUtils";

export async function POST(req: Request) {
  const { name } = await req.json();
  await connectDB();

  const player = await Player.create({ name });
  const firstGame = getNextGame([]);

  player.currentGame = firstGame;
  await player.save();

  return NextResponse.json({ playerId: player._id, firstGame });
}
