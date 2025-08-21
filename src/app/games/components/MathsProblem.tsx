"use-client";
import { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import Timer from "@/components/Timer";

type Mat = number[][];

// --- LOGIC (UNCHANGED) ---
function genMatrix(n = 3, min = 1, max = 9): Mat {
  return Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)
  );
}

function mul3x3(A: Mat, B: Mat): Mat {
  const C = Array.from({ length: 3 }, () => Array(3).fill(0));
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) sum += A[i][k] * B[k][j];
      C[i][j] = sum;
    }
  }
  return C;
}

function equal3x3(A: Mat, B: Mat): boolean {
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (A[i][j] !== B[i][j]) return false;
  return true;
}

export default function MathsProblem({ onNext }: { onNext?: () => void }) {
  const A = useMemo(() => genMatrix(3, 1, 9), []);
  const B = useMemo(() => genMatrix(3, 1, 9), []);
  const correct = useMemo(() => mul3x3(A, B), [A, B]);

  const [ans, setAns] = useState<(number | "" | "-")[][]>(() => Array.from({ length: 3 }, () => Array(3).fill("")));
  const [submitting, setSubmitting] = useState(false);

  const setCell = (r: number, c: number, v: string) => {
    const next = ans.map(row => [...row]);
    next[r][c] = v === "" || v === "-" ? v : Number(v);
    setAns(next as Mat);
  };

  const toNumberMatrix = (M: (number | "" | "-")[][]): Mat | null => {
    const out = Array.from({ length: 3 }, () => Array(3).fill(0));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const val = M[i][j];
        if (val === "" || val === "-" || Number.isNaN(Number(val))) return null;
        out[i][j] = Number(val);
      }
    }
    return out;
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const playerId = localStorage.getItem("playerId");
    const numAns = toNumberMatrix(ans);
    const isCorrect = numAns ? equal3x3(numAns, correct) : false;

    await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({
        playerId,
        correct: isCorrect,
        position: 1,
        gameName: "mathsProblem",
      }),
    });

    if (onNext) onNext();
  };

  // --- UI COMPONENTS ---

  const MatrixView = ({ M, label }: { M: Mat; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold text-gray-400 mb-2">{label}</div>
      <div className="p-2 bg-gray-900 rounded-md">
        <div className="grid grid-cols-3 gap-2 font-mono text-2xl">
          {M.flat().map((v, i) => (
            <div key={`${label}-${i}`} className="w-16 h-16 flex items-center justify-center bg-gray-700 text-teal-300 rounded-md">
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AnswerMatrix = () => (
    <div className="flex flex-col items-center">
       <div className="text-xl font-bold text-gray-400 mb-2">C</div>
        <div className="p-2 bg-gray-900 rounded-md">
          <div className="grid grid-cols-3 gap-2">
            {ans.map((row, r) =>
              row.map((_, c) => (
                <input
                  key={`c-${r}-${c}`}
                  type="number"
                  value={ans[r][c]}
                  onChange={(e) => setCell(r, c, e.target.value)}
                  className="w-16 h-16 text-center bg-gray-700 text-white font-mono text-2xl rounded-md border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
                />
              ))
            )}
          </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <motion.div
        className="w-full max-w-4xl p-8 space-y-6 bg-gray-800 border border-teal-500/20 rounded-xl shadow-2xl shadow-teal-500/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        <div className="flex justify-between items-start">
            <div>
                 <h1 className="text-3xl font-bold text-teal-400">🧮 3×3 Matrix Multiplication</h1>
                 <p className="text-gray-400 mt-1">Compute the product matrix <span className="font-mono text-teal-300">C = A × B</span>.</p>
            </div>
          <Timer duration={300} onExpire={submit} />
        </div>

        <div className="flex items-center justify-center flex-wrap gap-6 pt-6">
          <MatrixView M={A} label="A" />
          <div className="text-5xl font-thin text-gray-500">×</div>
          <MatrixView M={B} label="B" />
          <div className="text-5xl font-thin text-gray-500">=</div>
          <AnswerMatrix />
        </div>

        <div className="flex justify-end pt-6">
            <motion.button
              disabled={submitting}
              onClick={submit}
              className="px-8 py-3 font-semibold text-gray-900 bg-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileTap={{ scale: submitting ? 1 : 0.95 }}
            >
              {submitting ? "Submitting..." : "Submit Answer"}
            </motion.button>
        </div>
      </motion.div>
    </div>
  );
}