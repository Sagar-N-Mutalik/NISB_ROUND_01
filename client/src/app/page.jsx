"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from './page.module.css';

export default function Home() {
  const [name, setName] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleStart = async () => {
    if (!name.trim()) return;
    setIsStarting(true);
    setError(null);

    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start.");
      
      localStorage.setItem("playerId", data.playerId);
      router.push("/games");

    } catch (err) {
      setError(err.message);
      setIsStarting(false);
    }
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className={styles.title}>🧠 Mind Mashup</h1>
      <div className={styles.form}>
        <input
          className={styles.input}
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
        />
        <button
          onClick={handleStart}
          disabled={!name.trim() || isStarting}
          className={styles.button}
        >
          {isStarting ? "Starting..." : "Join the Challenge"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </motion.div>
  );
}