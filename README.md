# IEEE Game Round 1

This is a Next.js web application for the IEEE Game Round 1. The app features a series of interactive games:

- Maths Problem
- Reasoning Puzzle
- Sequence Recall
- Sudoku
- Tech Riddle

## How to Run

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the development server:
   ```powershell
   npm run dev
   ```
3. Open your browser and go to `http://localhost:3000`.

## Project Structure

- `src/app/games/components/` — Contains all game components.
- `src/app/games/page.tsx` — Main page to play games in sequence.
- `src/app/leaderboard/` — Leaderboard page.
- `src/app/api/` — API routes for game logic.

## Contribution
Feel free to add new games or improve existing ones. Make sure to follow the component structure and update the game list in `page.tsx`.

## License
MIT
