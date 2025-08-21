"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Import your game components
import MathsProblem from "./components/MathsProblem";
import ReasoningPuzzle from "./components/ReasoningPuzzle";
import SequenceRecall from "./components/SequenceRecall";
import TechRiddle from "./components/TechRiddle";
import SudokuSolver from "./components/Sudoku";
import BonusQuestion from "./components/BonusQuestion";
import Warning from "@/components/warning";

// 1. Game references
const GameComponents = [
  { key: "maths", Comp: MathsProblem },
  { key: "reasoning", Comp: ReasoningPuzzle },
  { key: "sudoku", Comp: SudokuSolver },
  { key: "sequence", Comp: SequenceRecall },
  { key: "tech", Comp: TechRiddle },
];

export default function GamesPage() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [remainingGameKeys, setRemainingGameKeys] = useState(() =>
    GameComponents.map((g) => g.key)
  );
  const [currentGameKey, setCurrentGameKey] = useState<string | null>(null);
  const router = useRouter();

  // 2. Check session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPlayerId = localStorage.getItem("playerId");
      if (!storedPlayerId) {
        router.push("/"); // redirect to home if no session
      } else {
        setPlayerId(storedPlayerId);
      }
    }
  }, [router]);

  // 3. Pick a random game initially
  useEffect(() => {
    if (remainingGameKeys.length > 0 && !currentGameKey) {
      const randomIndex = Math.floor(Math.random() * remainingGameKeys.length);
      setCurrentGameKey(remainingGameKeys[randomIndex]);
    }
  }, [remainingGameKeys, currentGameKey]);

  // 4. Handle page refresh / close
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Only delete player if NOT on bonus question
      if (playerId && currentGameKey !== "bonus") {
        fetch("/api/session", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId }),
        }).finally(() => {
          localStorage.removeItem("playerId");
        });
      }
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [playerId, currentGameKey]);

  // 5. Move to next game
  function handleNextGame() {
    setRemainingGameKeys((prevKeys) => {
      const newRemainingKeys = prevKeys.filter((key) => key !== currentGameKey);

      if (newRemainingKeys.length > 0) {
        const nextIndex = Math.floor(Math.random() * newRemainingKeys.length);
        setCurrentGameKey(newRemainingKeys[nextIndex]);
      } else {
        setCurrentGameKey("bonus"); // trigger bonus question
      }
      return newRemainingKeys;
    });
  }

  // 6. Render current game
  const CurrentGame = useMemo(() => {
    if (currentGameKey === "bonus") {
      return <BonusQuestion key="bonus" />;
    }
    const gameInfo = GameComponents.find((g) => g.key === currentGameKey);
    if (!gameInfo) return null;

    return <gameInfo.Comp key={gameInfo.key} onNext={handleNextGame} />;
  }, [currentGameKey]);

  const gameTransitionVariants = {
    enter: { opacity: 0, x: 200, scale: 0.8 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -200, scale: 0.8 },
  };

  return (
    <div className="w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {CurrentGame ? (
          <motion.div
            key={currentGameKey}
            variants={gameTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <Warning />
            {CurrentGame}
          </motion.div>
        ) : (
          <div className="text-gray-400">Loading Game...</div>
        )}
      </AnimatePresence>
    </div>
  );
}
