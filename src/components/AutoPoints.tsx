import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path to your Firebase config
import spacedog from '../assets/spacedogs.png.png'; // Adjust the path to your image

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(1500); // Initial points set to 1,500
  const [boostAvailable, setBoostAvailable] = useState(true);
  const [boostCooldown, setBoostCooldown] = useState(false);

  const userId = 'user123'; // Replace this with dynamic user identification logic
  const telegramId = 'exampleTelegramId'; // Replace with actual Telegram ID retrieval logic
  const telegramUsername = 'exampleUsername'; // Replace with actual username retrieval logic

  // Initialize or sync user data with Firebase
  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // Initialize user data in Firebase
        set(userRef, {
          points: 1500,
          telegramId,
          telegramUsername,
          boostCooldownEnd: null, // Initialize cooldown
          boostAvailable: true, // Initialize boost availability
        }).catch(console.error);
      } else {
        setPoints(data.points || 1500); // Sync points from Firebase

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
  }, [userId, telegramId, telegramUsername]);

  // Increment points daily and update Firebase
  useEffect(() => {
    const dailyIncrement = 1000;

    const interval = setInterval(() => {
      setPoints((prevPoints) => {
        const newPoints = prevPoints + dailyIncrement;
        update(ref(database, `users/${userId}`), { points: newPoints }).catch(console.error);
        return newPoints;
      });
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

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

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}></h1>
      
      <div style={{ 
        backgroundColor: '#3b3b5e', 
        color: '#fff',
        padding: '15px 30px',
        borderRadius: '10px',
        marginBottom: '20px',
        fontSize: '24px'
      }}>
        {points.toLocaleString()} spdogs {/* Formatted with commas */}
      </div>

      <img 
        src={spacedog} 
        alt="Space Dog" 
        style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
      />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        alignItems: 'center', 
        marginTop: '20px'
      }}>
        <button 
          onClick={handleJoinTelegram}
          style={buttonStyle}
        >
          Join Telegram
        </button>

        <button 
          onClick={handleJoinX}
          style={buttonStyle}
        >
          Join X
        </button>

        <button 
          onClick={handleBoostCommunity}
          style={
            boostAvailable && !boostCooldown 
              ? buttonStyle 
              : disabledButtonStyle
          }
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
