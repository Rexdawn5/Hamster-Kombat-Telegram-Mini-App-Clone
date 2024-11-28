import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path to your Firebase config
import spacedog from '../assets/spacedogs.png.png'; // Adjust the path to your image

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('');
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState<boolean>(false);
  const [isInviteLinkVisible, setIsInviteLinkVisible] = useState<boolean>(false); // State for invite link visibility
  const inviteLink = 'https://t.me/SpDogsBot/spacedogs'; // Define the invite link

  // Extract userId from the shared link (e.g., "?userId=someId")
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId') || 'defaultUserId'; // Fallback to default ID

  // Initialize or sync user data with Firebase
  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // If user is new, initialize with 2500 points
        set(userRef, {
          points: 2500,
          username: '',
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
  }, [userId]);

  // Increment points every 21 hours and update Firebase
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

  // Function to copy the invite link to the clipboard
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => alert('Invite link copied to clipboard!'))
      .catch((err) => alert('Failed to copy the link: ' + err));
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
          top: '8px',
          left: '45px',
          fontSize: '20px',
          color: 'white',
          maxWidth: '60%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {username || ''}
      </div>

      {/* Username Input Toggle Icon */}
      <div
        style={{
          position: 'absolute',
          top: '7px',
          left: '5px',
          cursor: 'pointer',
          fontSize: '20px',
          color: 'white',
          backgroundColor: '#5a3fbe',
          borderRadius: '50%',
          padding: '10px',
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
              width: '90%',
              maxWidth: '300px',
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
        {points.toLocaleString()} spdogs
      </div>

      {/* Space Dog Image */}
      <img
        src={spacedog}
        alt="Space Dog"
        style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
      />

      {/* Expandable Invite Link */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setIsInviteLinkVisible(!isInviteLinkVisible)}
          style={buttonStyle}
        >
          {isInviteLinkVisible ? 'Hide Invite Link' : 'Show Invite Link'}
        </button>

        {isInviteLinkVisible && (
          <div style={{ marginTop: '10px', transition: 'height 0.3s ease-out', height: isInviteLinkVisible ? 'auto' : '0' }}>
            <a
              href={inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: '#5a3fbe',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Click here to join!
            </a>
            <button
              onClick={copyInviteLink}
              style={{
                backgroundColor: '#5a3fbe',
                color: '#fff',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                fontSize: '14px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
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

export default AutoPoints;
