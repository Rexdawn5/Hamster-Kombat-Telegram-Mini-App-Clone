import React, { useState, useEffect } from 'react';
import { ref, set, update, onValue, push, get } from 'firebase/database';
import database from '../firebaseConfig';
import spacedog from '../assets/spacedogs.png.png';

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('');
  const [isUsernameInputVisible, setIsUsernameInputVisible] = useState<boolean>(false);
  const [isInviteVisible, setIsInviteVisible] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [joinedAt, setJoinedAt] = useState<number | null>(null);

  const queryParams = new URLSearchParams(window.location.search);
  const invitedUserId = queryParams.get('spacedogsuserId');
  const localUserId = localStorage.getItem('userId');

  const userId = localUserId || push(ref(database, 'users')).key!;

  useEffect(() => {
    if (!localUserId) {
      localStorage.setItem('userId', userId);
    }

    if (invitedUserId && invitedUserId !== userId) {
      const invitedUserRef = ref(database, `users/${invitedUserId}`);
      get(invitedUserRef).then((snapshot) => {
        if (!snapshot.exists()) {
          // Create a new profile for the invited user
          const timestamp = Date.now();
          set(invitedUserRef, {
            points: 2500,
            username: '',
            joinedAt: timestamp,
          }).catch(console.error);
        }
      });
    }
  }, [userId, invitedUserId]);

  const inviteLink = `https://t.me/SpDogsBot/spacedogsuserId=${userId}`;

  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPoints(data.points || 2500);
        setUsername(data.username || '');
        setJoinedAt(data.joinedAt || null);
      } else {
        const timestamp = Date.now();
        set(userRef, {
          points: 2500,
          username: '',
          joinedAt: timestamp,
        }).catch(console.error);
        setJoinedAt(timestamp);
      }
    });

    return () => {
      onValue(userRef, () => {}); // Cleanup listener
    };
  }, [userId]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);
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

  const formatTimestamp = (timestamp: number | null) =>
    timestamp ? new Date(timestamp).toLocaleString() : 'Not available';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'black', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '8px', left: '45px', fontSize: '20px', color: 'white', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {username || ''}
      </div>

      <div
        style={{ position: 'absolute', top: '7px', left: '5px', cursor: 'pointer', fontSize: '20px', color: 'white', backgroundColor: '#5a3fbe', borderRadius: '50%', padding: '10px' }}
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
            style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', marginBottom: '10px', width: '90%', maxWidth: '300px' }}
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

      <div style={{ backgroundColor: '#3b3b5e', color: '#fff', padding: '15px 30px', borderRadius: '10px', marginBottom: '20px', fontSize: '24px' }}>
        {points.toLocaleString()} spdogs
      </div>

      <img src={spacedog} alt="Space Dog" style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }} />

      <p style={{ color: '#fff' }}>Joined At: {formatTimestamp(joinedAt)}</p>

      <button style={{ ...buttonStyle, backgroundColor: isInviteVisible ? '#f0a500' : '#3b3b5e' }} onClick={() => setIsInviteVisible(!isInviteVisible)}>
        {isInviteVisible ? 'Close Invite' : 'Invite Friends'}
      </button>

      {isInviteVisible && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#2b2b4e', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#fff', marginBottom: '10px' }}>Copy your invite link below:</p>
          <input type="text" readOnly value={inviteLink} style={{ padding: '10px', width: '90%', maxWidth: '300px', marginBottom: '10px', textAlign: 'center' }} />
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
