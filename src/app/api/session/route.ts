import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Player from "@/modals/player";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { playerId } = await req.json();
    console.log("Received playerId:", playerId);

    if (!playerId) {
      return NextResponse.json(
        { success: false, message: "No playerId provided" },
        { status: 400 }
      );
    }

    const result = await Player.deleteOne({ _id: playerId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Player not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Player deleted successfully." });

  } catch (err) {
    console.error("Failed to delete player:", err);

    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
