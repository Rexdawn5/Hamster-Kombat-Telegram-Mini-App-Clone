import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Firebase configuration
import spacedog from '../assets/spacedogs.png.png'; // Adjust the path to your image

declare global {
  interface Window {
    Telegram: any;
  }
}

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500); // Default points
  const [username, setUsername] = useState<string>(''); // Telegram username
  const [telegramId, setTelegramId] = useState<string>(''); // Telegram ID
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState<boolean>(false);

  useEffect(() => {
    // Initialize Telegram Web App
    const tg = window.Telegram.WebApp;
    tg.ready();

    // Fetch user data
    const userData = tg.initDataUnsafe?.user || {};
    const fetchedUsername = userData.username || 'Guest';
    const fetchedTelegramId = userData.id || 'Unknown';

    setUsername(fetchedUsername);
    setTelegramId(fetchedTelegramId);

    // Sync with Firebase
    const userRef = ref(database, `users/${fetchedTelegramId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Initialize new user profile in Firebase
        set(userRef, {
          points: 2500,
          username: fetchedUsername,
          telegramId: fetchedTelegramId,
        }).catch(console.error);
      } else {
        // Sync existing user data
        setPoints(data.points || 2500);
        setUsername(data.username || fetchedUsername);
      }
    });

    return () => {
      onValue(userRef, () => {}); // Cleanup listener
    };
  }, []);

  // Increment points every 21 hours
  useEffect(() => {
    const incrementPoints = 500;
    const interval = setInterval(() => {
      setPoints((prevPoints) => {
        const newPoints = prevPoints + incrementPoints;
        update(ref(database, `users/${telegramId}`), { points: newPoints }).catch(console.error);
        return newPoints;
      });
    }, 21 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [telegramId]);

  // Save the username
  const saveUsername = () => {
    if (username.trim()) {
      update(ref(database, `users/${telegramId}`), { username }).catch(console.error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      {/* Username Display */}
      <div style={{ position: 'absolute', top: '8px', left: '45px', fontSize: '20px', color: 'white' }}>
        {username || ''}
      </div>

      {/* Username Input */}
      <div
        style={{ position: 'absolute', top: '7px', left: '5px', cursor: 'pointer', backgroundColor: '#5a3fbe', borderRadius: '50%', padding: '10px' }}
        onClick={() => setIsUsernameInputVisible(!isUsernameInputVisible)}
      >
        U
      </div>
      {isUsernameInputVisible && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', marginBottom: '10px' }}
          />
          <button onClick={saveUsername} style={{ backgroundColor: '#3b3b5e', color: '#fff', padding: '12px 20px', borderRadius: '8px' }}>
            Save
          </button>
        </div>
      )}

      {/* Points Display */}
      <div style={{ backgroundColor: '#3b3b5e', color: '#fff', padding: '15px 30px', borderRadius: '10px', fontSize: '24px' }}>
        {points.toLocaleString()} spdogs
      </div>

      <img src={spacedog} alt="Space Dog" style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }} />
    </div>
  );
};

export default AutoPoints;
