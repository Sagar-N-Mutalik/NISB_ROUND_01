"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GameLayout from "@/components/GameLayout";
import Warning from "@/components/warning";

// Import all the individual game components
import TechRiddle from "./TechRiddle";
import MathsProblem from "./MathsProblem";
import ReasoningPuzzle from "./ReasoningPuzzle";
import SequenceRecall from "./SequenceRecall";
import Sudoku from "./Sudoku";

import BonusQuestion from "./BonusQuestion";

const GameComponents = [
  { key: "techRiddle", Comp: TechRiddle },
  { key: "mathsProblem", Comp: MathsProblem },
  { key: "reasoningPuzzle", Comp: ReasoningPuzzle },
  { key: "sequenceRecall", Comp: SequenceRecall },
  { key: "sudoku", Comp: Sudoku },
];

export default function GamesPage() {
  const [playerId, setPlayerId] = useState(null);
  const [completedGames, setCompletedGames] = useState([]);
  const [currentGameKey, setCurrentGameKey] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedPlayerId = localStorage.getItem("playerId");
    if (!storedPlayerId) {
      router.push("/");
    } else {
      setPlayerId(storedPlayerId);
    }
  }, [router]);

  const selectNextGame = useCallback(() => {
    const remaining = GameComponents.filter(g => !completedGames.includes(g.key));
    if (remaining.length === 0) {
      setCurrentGameKey("bonus");
    } else {
      const nextGame = remaining[Math.floor(Math.random() * remaining.length)];
      setCurrentGameKey(nextGame.key);
    }
  }, [completedGames]);

  useEffect(() => {
    if (playerId) {
      selectNextGame();
    }
  }, [playerId, completedGames, selectNextGame]);

  const handleNextGame = (gameKey) => {
    setCompletedGames(prev => [...prev, gameKey]);
  };
  
  const CurrentGameComponent = () => {
    if (!currentGameKey) return <div>Loading next challenge...</div>;
    if (currentGameKey === "bonus") return <BonusQuestion />;

    const game = GameComponents.find(g => g.key === currentGameKey);
    if (!game) return <div>Error: Game not found.</div>;
    
    return <game.Comp onNext={() => handleNextGame(game.key)} />;
  };

  return (
    <GameLayout>
      <Warning />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGameKey}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <CurrentGameComponent />
        </motion.div>
      </AnimatePresence>
    </GameLayout>
  );
}