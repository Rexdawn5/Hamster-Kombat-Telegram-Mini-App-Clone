import React, { useState, useEffect } from 'react';
import spacedog from '../assets/spacedogs.png.png'; // Adjust the path to your image

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState(1500); // Initial points set to 1,500
  const [joinedTelegram, setJoinedTelegram] = useState(false);
  const [joinedTwitter, setJoinedTwitter] = useState(false);

  useEffect(() => {
    const dailyIncrement = 1000;

    // Increment points by 1,000 every 24 hours
    const interval = setInterval(() => {
      setPoints((prevPoints) => prevPoints + dailyIncrement);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Click handler for earning 500 points
  const handleEarnPoints = (platform: string) => {
    if (platform === 'Telegram' && !joinedTelegram) {
      console.log('Earned 500 spdogs for joining Telegram');
      setPoints((prevPoints) => prevPoints + 500); // Increment points by 500
      setJoinedTelegram(true); // Mark as joined
      window.open('https://t.me/spacedogscommunity', '_blank');
    } else if (platform === 'X (Twitter)' && !joinedTwitter) {
      console.log('Earned 500 spdogs for joining X (Twitter)');
      setPoints((prevPoints) => prevPoints + 500); // Increment points by 500
      setJoinedTwitter(true); // Mark as joined
      window.open('https://x.com/spacedogsbot', '_blank');
    } else if (platform === 'Boost Community') {
      console.log('Earned 500 spdogs for boosting community');
      setPoints((prevPoints) => prevPoints + 500); // Increment points by 500
      window.open('https://t.me/boost/spacedogscommunity', '_blank');
    }
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
        backgroundColor: '#3b3b5e', // Changed background color to #3b3b5e
        color: '#fff', // White text for better contrast
        padding: '15px 30px',
        borderRadius: '10px',
        marginBottom: '20px',
        fontSize: '24px'
      }}>
        {points.toLocaleString()} spdogs {/* Formatted with comma for thousands */}
      </div>

      <img 
        src={spacedog} 
        alt="Space Dog" 
        style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }} // Medium-large image
      />
      
      {/* Actions for earning 500 points */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        alignItems: 'center', 
        marginTop: '20px'
      }}>
        <button 
          onClick={() => handleEarnPoints('Telegram')}
          style={buttonStyle}
          disabled={joinedTelegram} // Disable button if already joined
        >
          {joinedTelegram ? 'Already Joined Telegram' : 'Join Telegram & Gain 500 spdogs'}
        </button>
        
        <button 
          onClick={() => handleEarnPoints('X (Twitter)')}
          style={buttonStyle}
          disabled={joinedTwitter} // Disable button if already joined
        >
          {joinedTwitter ? 'Already Joined X' : 'Join X & Gain 500 spdogs'}
        </button>

        <button 
          onClick={() => handleEarnPoints('Boost Community')}
          style={buttonStyle}
        >
          Boost Community & Gain 500 spdogs
        </button>
      </div>
    </div>
  );
};

// Button styling
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#3b3b5e', // Dark blue background
  color: '#fff', // White text
  padding: '12px 20px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  width: '80%', // Adjust width
  maxWidth: '300px',
  opacity: 1,
};

// Disable styling for the button when clicked
const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#a3a3a3', // Light gray background when disabled
  cursor: 'not-allowed',
};

export default AutoPoints;
