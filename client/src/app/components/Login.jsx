import { useState } from 'react';
import styles from './Login.module.css';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [roomKey, setRoomKey] = useState('');

  const handleSubmit = () => {
    if (name && roomKey) {
      onLogin(name, roomKey);
    }
  };

  return (
    <div className={styles.card}>
      <h1>Join Game</h1>
      <input 
        className={styles.input} 
        placeholder="Your Name" 
        value={name}
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        className={styles.input} 
        placeholder="Room Key" 
        value={roomKey}
        onChange={(e) => setRoomKey(e.target.value)} 
      />
      <button className={styles.button} onClick={handleSubmit}>Enter Room</button>
    </div>
  );
}