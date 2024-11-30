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
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('Guest');
  const [userId, setUserId] = useState<string>(''); 
  const [isTaskbarOpen, setIsTaskbarOpen] = useState<boolean>(false); 
  const [notification, setNotification] = useState<string>(''); // For the pop-up notification

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const userData = tg.initDataUnsafe?.user;

    if (userData) {
      const telegramId = userData.id;
      const fetchedUsername = userData.username || 'Guest';

      setUserId(telegramId);
      setUsername(fetchedUsername);

      const userRef = ref(database, `users/${telegramId}`);
      onValue(userRef, (snapshot) => {
        if (!snapshot.exists()) {
          set(userRef, { points: 2500, username: fetchedUsername }).catch(console.error);
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

  useEffect(() => {
    const interval = setInterval(() => {
      const newPoints = points + 500;
      setPoints(newPoints);
      update(ref(database, `users/${userId}`), { points: newPoints }).catch(console.error);
      showNotification('🎉 500 points added! 🚀'); // Display notification when points are added
    }, 21 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [points, userId]);

  // Function to show the pop-up notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000); // Hide notification after 3 seconds
  };

  return (
    <div
      style={{
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}> {username}!</h1>

      <div
        style={{
          backgroundColor: '#3b3b5e',
          color: '#fff',
          borderRadius: '8px',
          padding: '15px',
          margin: '10px auto',
          width: '80%',
          maxWidth: '400px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          <span style={{ fontSize: '24px' }}>
            {points.toLocaleString()}
          </span> 
          spdogs <span style={{ fontSize: '24px' }}>🦴</span>
        </p>
      </div>

      <img
        src={spacedog}
        alt="Space Dog"
        style={{
          width: '300px',
          margin: '20px auto',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(255, 255, 255, 0.2)',
          animation: 'glowImage 1.5s infinite',
        }}
      />

      {/* Notification Pop-Up */}
      {notification && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ff9800',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            fontSize: '18px',
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          {notification}
        </div>
      )}

      {/* Taskbar */}
      <div>
        <button
          onClick={() => setIsTaskbarOpen(!isTaskbarOpen)}
          style={{
            marginTop: '20px',
            padding: '15px 25px',
            borderRadius: '15px',
            border: 'none',
            backgroundColor: '#5c6bc0',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 0 15px 3px rgba(92, 107, 192, 0.6)',
            animation: 'glow 1.5s infinite',
          }}
        >
          {isTaskbarOpen ? 'Close Task' : 'Task'}
        </button>

        {isTaskbarOpen && (
          <div
            style={{
              marginTop: '10px',
              backgroundColor: '#333',
              borderRadius: '10px',
              padding: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <a
                href="https://t.me/spacedogscommunity"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: '#00bcd4',
                }}
              >
                Join Telegram
              </a>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <a
                href="https://x.com/spacedogsbot"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: '#00bcd4',
                }}
              >
                Join X
              </a>
            </div>

            {/* Boost Community Section */}
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#444', borderRadius: '8px' }}>
              <h3 style={{ color: '#fff' }}>Boost the Community!</h3>
              <a
                href="https://t.me/boost/spacedogscommunity"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: '#ff5722',
                  fontWeight: 'bold',
                }}
              >
                Boost Now!
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Glow Animation */}
      <style>
        {`
          @keyframes glowImage {
            0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.6); }
            50% { box-shadow: 0 0 30px rgba(255, 255, 255, 1); }
            100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.6); }
          }
        `}
      </style>
    </div>
  );
};

export default AutoPoints;
