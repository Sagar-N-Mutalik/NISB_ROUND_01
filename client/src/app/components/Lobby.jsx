import styles from './Lobby.module.css';

export default function Lobby({ participants, userInfo, socket }) {
  const handleStart = () => {
    socket.emit('startRound', { groupId: userInfo.groupId, participantId: userInfo.participantId });
  };

  return (
    <div className={styles.card}>
      <h1>Lobby</h1>
      <p>Waiting for players... ({participants.length}/4)</p>
      <ul className={styles.playerList}>
        {participants.map(p => (
          <li key={p._id}>
            {p.name} {p.isProctor && <span>(Proctor)</span>}
          </li>
        ))}
      </ul>
      {userInfo.isProctor && participants.length === 4 && (
        <button className={styles.button} onClick={handleStart}>Start Game</button>
      )}
    </div>
  );
}