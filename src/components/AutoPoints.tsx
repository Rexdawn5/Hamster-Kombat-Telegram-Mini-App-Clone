import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path to your Firebase config
import spacedog from '../assets/spacedogs.png.png'; // Adjust the path to your image

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500); // Initial points set to 1,500
  const [boostAvailable, setBoostAvailable] = useState(true);
  const [boostCooldown, setBoostCooldown] = useState(false);
  const [username, setUsername] = useState<string>(''); // To hold username
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState<boolean>(false); // For toggling input visibility

  const userId = 'user123'; // Replace this with dynamic user identification logic

  // Initialize or sync user data with Firebase
  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Initialize user data in Firebase
        set(userRef, {
          points: 1500,
          username: '', // Initialize empty username
          boostCooldownEnd: null, // Initialize cooldown
          boostAvailable: true, // Initialize boost availability
        }).catch(console.error);
      } else {
        setPoints(data.points || 2500); // Sync points from Firebase
        setUsername(data.username || ''); // Sync username from Firebase

        // Sync cooldown state
        const now = Date.now();
        if (data.boostCooldownEnd && now < data.boostCooldownEnd) {
          setBoostCooldown(true);
          setTimeout(() => setBoostCooldown(false), data.boostCooldownEnd - now);
        } else {
          setBoostCooldown(false);
        }

        setBoostAvailable(data.boostAvailable ?? true);
      }
    });

    return () => {
      // Cleanup listener
      onValue(userRef, () => {});
    };
  }, [userId]);

  // Increment points every 21 hours and update Firebase
  useEffect(() => {
    const incrementPoints = 500; // Points given every 21 hours

    const interval = setInterval(() => {
      setPoints((prevPoints) => {
        const newPoints = prevPoints + incrementPoints;
        update(ref(database, `users/${userId}`), { points: newPoints }).catch(console.error);
        return newPoints;
      });
    }, 21 * 60 * 60 * 1000); // 21 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [userId]);

  // Handle Join Telegram
  const handleJoinTelegram = () => {
    window.open('https://t.me/spacedogscommunity', '_blank'); // Open Telegram community link
  };

  // Handle Join X
  const handleJoinX = () => {
    window.open('https://x.com/spacedogsbot', '_blank'); // Open "Join X" link
  };

  // Handle Boost Community points
  const handleBoostCommunity = () => {
    if (!boostAvailable || boostCooldown) return;

    const now = Date.now();
    const cooldownEnd = now + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    setPoints((prevPoints) => {
      const newPoints = prevPoints + 0; // Increment points
      update(ref(database, `users/${userId}`), {
        points: newPoints,
        boostCooldownEnd: cooldownEnd,
        boostAvailable: false,
      }).catch(console.error);
      return newPoints;
    });

    setBoostAvailable(false); // Disable boost button for 7 hours
    setTimeout(() => {
      setBoostAvailable(true);
      update(ref(database, `users/${userId}`), { boostAvailable: true }).catch(console.error);
    }, 7 * 60 * 60 * 1000); // Re-enable after 7 hours

    setBoostCooldown(true); // Start cooldown for 24 hours
    setTimeout(() => {
      setBoostCooldown(false);
      update(ref(database, `users/${userId}`), { boostCooldownEnd: null }).catch(console.error);
    }, 24 * 60 * 60 * 1000); // Cooldown ends in 24 hours
  };

  // Save the username to Firebase
  const saveUsername = () => {
    if (username.trim()) {
      update(ref(database, `users/${userId}`), { username }).catch(console.error);
    }
  };

  // Reset the username field
  const resetUsername = () => {
    setUsername('');
    update(ref(database, `users/${userId}`), { username: '' }).catch(console.error);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'black',
        textAlign: 'center',
      }}
    >
      {/* Username Display */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '67px', // Adjusted to make it close to the "U" icon
          fontSize: '18px',
          color: 'white',
          marginTop: '5px',
        }}
      >
        {username || ''}
      </div>

      {/* Username Input Toggle Icon */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '15px',
          cursor: 'pointer',
          fontSize: '20px',
          color: 'white', // White text color
          backgroundColor: '#5a3fbe', // Light indigo background color
          borderRadius: '40%', // Circular background
          padding: '10px', // Add padding to make it circular
        }}
        onClick={() => setIsUsernameInputVisible(!isUsernameInputVisible)}
      >
        U
      </div>

      {/* Username Input Field */}
      {isUsernameInputVisible && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              marginBottom: '10px',
              width: '250px',
            }}
          />
          <div>
            <button onClick={saveUsername} style={buttonStyle}>
              Save
            </button>
            <button onClick={resetUsername} style={buttonStyle}>
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Points Display */}
      <div
        style={{
          backgroundColor: '#3b3b5e',
          color: '#fff',
          padding: '15px 30px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '24px',
        }}
      >
        {points.toLocaleString()} spdogs {/* Formatted with commas */}
      </div>

      {/* Space Dog Image */}
      <img
        src={spacedog}
        alt="Space Dog"
        style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
      />

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <button onClick={handleJoinTelegram} style={buttonStyle}>
          Join Telegram
        </button>
        <button onClick={handleJoinX} style={buttonStyle}>
          Join X
        </button>
        <button
          onClick={handleBoostCommunity}
          style={boostAvailable && !boostCooldown ? buttonStyle : disabledButtonStyle}
          disabled={!boostAvailable || boostCooldown}
        >
          {boostCooldown
            ? 'Boost Cooldown Active'
            : boostAvailable
            ? 'Boost Community spdogs'
            : 'task complete'}
        </button>
      </div>

      {/* Embed Boost link */}
      <a
        href="https://t.me/boost/spacedogscommunity"
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: '20px', color: '#3b3b5e', textDecoration: 'underline' }}
      >
      
      </a>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#3b3b5e',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  width: '80%',
  maxWidth: '300px',
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#a3a3a3',
  cursor: 'not-allowed',
};

export default AutoPoints;
