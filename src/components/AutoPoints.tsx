import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue, push } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path to your Firebase config
import spacedog from '../assets/spacedogs.png.png'; // Adjust the path to your image

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('');
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState<boolean>(false);
  const [isInviteVisible, setIsInviteVisible] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId') || 'defaultUserId';

  const inviteLink = `https://t.me/spacedogsbot?userId=${userId}`;

  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        set(userRef, {
          points: 2500,
          username: '',
        }).catch(console.error);
      } else {
        setPoints(data.points || 2500);
        setUsername(data.username || '');
      }
    });

    return () => {
      onValue(userRef, () => {}); // Cleanup listener
    };
  }, [userId]);

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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);

        const inviteRef = ref(database, `invites/${userId}`);
        push(inviteRef, {
          timestamp: Date.now(),
          inviteLink,
        }).catch(console.error);

        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  };

  const saveUsername = () => {
    if (username.trim()) {
      update(ref(database, `users/${userId}`), { username }).catch(console.error);
    }
  };

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

      <img
        src={spacedog}
        alt="Space Dog"
        style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
      />

      <button
        style={{
          ...buttonStyle,
          backgroundColor: isInviteVisible ? '#f0a500' : '#3b3b5e',
        }}
        onClick={() => setIsInviteVisible(!isInviteVisible)}
      >
        {isInviteVisible ? 'Close Invite' : 'Invite Friends'}
      </button>

      {isInviteVisible && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#2b2b4e',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#fff', marginBottom: '10px' }}>
            Copy your invite link below:
          </p>
          <input
            type="text"
            readOnly
            value={inviteLink}
            style={{
              padding: '10px',
              width: '90%',
              maxWidth: '300px',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          />
          <button onClick={handleCopyLink} style={buttonStyle}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
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
