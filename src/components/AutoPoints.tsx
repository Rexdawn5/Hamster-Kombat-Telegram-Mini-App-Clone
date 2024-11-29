import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path to your Firebase config
import spacedog from '../assets/spacedogs.png.png'; // Adjust the path to your image

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500); // Default points
  const [username, setUsername] = useState<string>(''); // User's username
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState<boolean>(false);

  // Extract inviter ID (if present) and current user ID
  const urlParams = new URLSearchParams(window.location.search);
  const inviterId = urlParams.get('userId'); // Inviter's ID
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`; // Generate a unique user ID

  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Initialize new user profile
        set(userRef, {
          points: 2500,
          username: '',
          inviterId: inviterId || null, // Store inviter ID if available
          telegramId: '123456789', // Replace with actual Telegram ID logic
        }).catch(console.error);
      } else {
        // Sync existing user data
        setPoints(data.points || 2500);
        setUsername(data.username || '');
      }
    });

    return () => {
      onValue(userRef, () => {}); // Cleanup listener
    };
  }, [inviterId, userId]);

  // Increment points every 21 hours
  useEffect(() => {
    const incrementPoints = 500;
    const interval = setInterval(() => {
      setPoints((prevPoints) => {
        const newPoints = prevPoints + incrementPoints;
        update(ref(database, `users/${userId}`), { points: newPoints }).catch(console.error);
        return newPoints;
      });
    }, 21 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId]);

  // Save the username
  const saveUsername = () => {
    if (username.trim()) {
      update(ref(database, `users/${userId}`), { username }).catch(console.error);
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
