import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue } from 'firebase/database';
import database from '../firebaseConfig';
import spacedog from '../assets/spacedogs.png.png';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: string;
            username: string;
          };
        };
      };
    };
  }
}

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500); // Default points
  const [username, setUsername] = useState<string>('Guest'); // User's username
  const [userId, setUserId] = useState<string>(''); // User's Telegram ID
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState<boolean>(false);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const userData = tg.initDataUnsafe?.user;

    if (userData) {
      const telegramId = userData.id;
      const fetchedUsername = userData.username || 'Guest';

      setUserId(telegramId);
      setUsername(fetchedUsername);

      // Initialize or sync user data with Firebase
      const userRef = ref(database, `users/${telegramId}`);
      onValue(userRef, (snapshot) => {
        if (!snapshot.exists()) {
          set(userRef, {
            points: 2500,
            username: fetchedUsername,
          }).catch(console.error);
        } else {
          const data = snapshot.val();
          setPoints(data.points || 2500);
          setUsername(data.username || fetchedUsername);
        }
      });
    } else {
      console.error('User data not found in Telegram Web App context');
    }
  }, []);

  // Increment points every 21 hours
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoints = points + 500;
      setPoints(newPoints);
      update(ref(database, `users/${userId}`), { points: newPoints }).catch(console.error);
    }, 21 * 60 * 60 * 1000); // 21 hours

    return () => clearInterval(interval);
  }, [points, userId]);

  const saveUsername = () => {
    if (username.trim() && userId) {
      update(ref(database, `users/${userId}`), { username }).catch(console.error);
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#000', // Black background
        color: '#fff', // White text for contrast
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Welcome, {username}!</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>
        Your Points: <strong>{points.toLocaleString()} spdogs</strong>
      </p>
      <img
        src={spacedog}
        alt="Space Dog"
        style={{ width: '300px', margin: '20px auto', borderRadius: '10px', boxShadow: '0 4px 8px rgba(255, 255, 255, 0.2)' }}
      />
      {isUsernameInputVisible && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #fff',
              backgroundColor: '#333',
              color: '#fff',
              width: '80%',
              textAlign: 'center',
            }}
          />
          <button
            onClick={saveUsername}
            style={{
              padding: '10px 20px',
              marginLeft: '10px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#00bcd4', // Cyan for a modern touch
              color: '#000',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#008c9e')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#00bcd4')}
          >
            Save
          </button>
        </div>
      )}
      <button
        onClick={() => setIsUsernameInputVisible(!isUsernameInputVisible)}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#f44336', // Red for action
          color: '#fff',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f44336')}
      >
        {isUsernameInputVisible ? 'Hide Input' : 'Set Username'}
      </button>
    </div>
  );
};

export default AutoPoints;
