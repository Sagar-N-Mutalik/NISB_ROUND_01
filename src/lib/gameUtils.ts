const allGames = ["techRiddle", "mathsProblem", "reasoningPuzzle", "sequenceRecall", "sudoku"];

export function getNextGame(completed: string[]) {
  const remaining = allGames.filter(g => !completed.includes(g));
  if (remaining.length === 0) return null;
  return remaining[Math.floor(Math.random() * remaining.length)];
}
