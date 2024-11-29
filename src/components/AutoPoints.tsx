import React, { useEffect, useState } from 'react';
import { ref, set, onValue } from 'firebase/database';
import database from '../firebaseConfig';

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviterId = urlParams.get('inviterId') || 'defaultInviter';
    const tg = window.Telegram.WebApp;
    const userData = tg.initDataUnsafe?.user || {};
    const telegramId = userData.id || `newUser_${Date.now()}`; // Fallback to a unique ID
    const username = userData.username || 'Guest';

    setUserId(telegramId);
    setUsername(username);

    // Check if user data exists, initialize if not
    const userRef = ref(database, `users/${telegramId}`);
    onValue(userRef, (snapshot) => {
      if (!snapshot.exists()) {
        // Initialize new user data
        set(userRef, {
          points: 2500,
          username,
          inviterId,
        }).catch(console.error);
      } else {
        // Load existing data
        const data = snapshot.val();
        setPoints(data.points || 2500);
        setUsername(data.username || 'Guest');
      }
    });
  }, []);

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Your Points: {points}</p>
    </div>
  );
};

export default AutoPoints;
