import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Group from "@/models/Group";
import Participant from "@/models/Participant";
import Answer from "@/models/Answer";
import { nanoid } from "nanoid";
import questions from "@/lib/questions";

// POST: Handles player and proctor login
export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, code } = await req.json();

        if (!name || !code) {
            return NextResponse.json({ message: "Name and code are required." }, { status: 400 });
        }

        const group = await Group.findOne({ code }).populate('participants');
        if (!group) {
            return NextResponse.json({ message: "Invalid group code." }, { status: 404 });
        }
        
        const isProctor = name.trim().toUpperCase() === 'PROCTOR';

        // Check if a participant with the same name is already in the group (for re-login)
        let participant = group.participants.find((p: any) => p.name.toLowerCase() === name.trim().toLowerCase());

        if (participant) {
            // Re-logging in, return existing data
             return NextResponse.json({
                participantId: participant._id,
                isProctor: participant.isProctor,
                group: { id: group._id, name: group.name }
            });
        }

        // New participant checks
        if (group.roundStarted && !isProctor) {
            return NextResponse.json({ message: "This round has already started." }, { status: 403 });
        }
        
        if (group.participants.length >= 4 && !isProctor) {
            return NextResponse.json({ message: "This group is full." }, { status: 403 });
        }
        
        const sessionId = nanoid();
        participant = await new Participant({ name, isProctor, sessionId, totalScore: 0 }).save();

        group.participants.push(participant._id);
        await group.save();

        return NextResponse.json({
            participantId: participant._id,
            isProctor,
            group: { id: group._id, name: group.name }
        });

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

// GET: Sets up the 25 groups for the competition
export async function GET() {
    try {
        await connectDB();
        // Clear previous game data for a fresh setup
        await Group.deleteMany({});
        await Participant.deleteMany({});
        await Answer.deleteMany({});

        const groupCodes = [];
        for (let i = 1; i <= 25; i++) {
            const code = nanoid(6).toUpperCase();
            const questionSetIndex = (i - 1) % questions.length;
            await new Group({ name: `Group ${i}`, code, questionSetIndex }).save();
            groupCodes.push({ groupName: `Group ${i}`, code });
        }
        return NextResponse.json({ message: "Successfully created 25 groups.", groupCodes });
    } catch (error) {
        console.error("Setup API Error:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}