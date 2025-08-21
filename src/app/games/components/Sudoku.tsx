import Timer from "@/components/Timer";
import React, { useState, useEffect } from "react";

interface SudokuSolverProps {
  onNext?: () => void;
}

// Sudoku helper functions
const isSafe = (board: number[][], row: number, col: number, num: number) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[startRow + i][startCol + j] === num) return false;

  return true;
};

const solveSudoku = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0; // backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Generate full solved Sudoku
const generateFullGrid = (): number[][] => {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  const fillRandom = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              if (fillRandom(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillRandom(grid);
  return grid;
};

// Remove numbers randomly to create puzzle with min clues
const generatePuzzle = (fullGrid: number[][], minClues = 45): number[][] => {
  const puzzle = fullGrid.map((row) => [...row]);
  const totalCells = 81;
  const cellsToRemove = totalCells - minClues;

  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  return puzzle;
};

const SudokuSolver: React.FC<SudokuSolverProps> = ({ onNext }) => {
  const [fullGrid, setFullGrid] = useState<number[][]>([]);
  const [grid, setGrid] = useState<number[][]>([]);
  const [message, setMessage] = useState("");
  const [isExample, setIsExample] = useState(false); // track if this is example

  // Generate puzzle on mount
  useEffect(() => {
    const solved = generateFullGrid();
    setFullGrid(solved);
    setGrid(generatePuzzle(solved, 45));
  }, []);

  // Handle user input
  const handleChange = (row: number, col: number, value: string) => {
    if (!/^[1-9]?$/.test(value)) return;
    if (fullGrid[row][col] === grid[row][col] && value !== "") return; // pre-filled read-only

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = value === "" ? 0 : parseInt(value, 10);
    setGrid(newGrid);
  };

  // Solve/check remaining cells
  const handleSolve = () => {
    const newGrid = grid.map((r) => [...r]);
    let correctCount = 0;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newGrid[row][col] === 0 || newGrid[row][col] !== fullGrid[row][col]) {
          newGrid[row][col] = fullGrid[row][col]; // auto-correct
        } else {
          correctCount++;
        }
      }
    }

    setGrid(newGrid);
    setMessage(`✅ Puzzle solved! Correctly filled cells: ${correctCount}/81`);

    // Trigger onNext only for real Sudoku (not example)
    if (!isExample && onNext) onNext();
  };

  // Load example puzzle
  const handleLoadExample = () => {
    const solved = generateFullGrid();
    setFullGrid(solved);
    setGrid(generatePuzzle(solved, 45));
    setIsExample(true);
    setMessage("Example puzzle loaded!");
  };

  // Reset puzzle (new real Sudoku)
  const handleReset = () => {
    const solved = generateFullGrid();
    setFullGrid(solved);
    setGrid(generatePuzzle(solved, 45));
    setIsExample(false);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider">Sudoku Puzzle</h1>
        <p className="text-gray-400 mt-2">
          Instructions: Fill the empty cells with numbers 1-9 so that each row, column, and 3×3 box contains all numbers 1-9 exactly once.
          Click Solve to auto-check/correct remaining cells. Timer will auto-solve when time expires.
        </p>
      </div>

      <Timer duration={300} onExpire={handleSolve} />

      {/* Sudoku Grid */}
      <div className="grid grid-cols-9 shadow-2xl rounded-lg overflow-hidden border-2 border-blue-500">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellClasses = [
              "w-12 h-12 md:w-14 md:h-14",
              "flex items-center justify-center",
              "text-2xl font-semibold text-center",
              fullGrid[rowIndex][colIndex] === cell ? "bg-gray-700 text-gray-300" : "bg-gray-800 focus:bg-gray-700",
              "border-gray-700",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10",
              (colIndex + 1) % 3 === 0 && colIndex < 8 ? "border-r-2 border-r-gray-600" : "border-r",
              (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? "border-b-2 border-b-gray-600" : "border-b",
            ].join(" ");

            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength={1}
                value={cell === 0 ? "" : cell}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                className={cellClasses}
                readOnly={fullGrid[rowIndex][colIndex] === cell && cell !== 0} // pre-filled read-only
              />
            );
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={handleSolve}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
        >
          Solve / Check
        </button>
        <button
          onClick={handleLoadExample}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
        >
          Load Example
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
        >
          New Puzzle
        </button>
      </div>

      {/* Message */}
      {message && <p className="mt-6 text-lg font-semibold text-green-400">{message}</p>}
    </div>
  );
};

export default SudokuSolver;
