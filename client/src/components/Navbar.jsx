import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <span className={styles.title}>🧠 Mind Mashup</span>
        <Link href="/leaderboard" className={styles.link}>
          Leaderboard
        </Link>
      </div>
    </nav>
  );
}