import React, { useState, useEffect } from 'react';
import { ref, set, update, get } from 'firebase/database';
import database from '../firebaseConfig';
import spacedog from '../assets/spacedogs.png.png';
import { FaUserAlt } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('');
  const [isUsernameSaved, setIsUsernameSaved] = useState<boolean>(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState<boolean>(false);
  const [isInviteLinkVisible, setIsInviteLinkVisible] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id') || `user-${Date.now()}`;

  // Firebase: Load or create user data
  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);
    get(userRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // Create a new user profile with default points
        set(userRef, {
          points: 2500,
          username: '',
        }).catch(console.error);
      } else {
        const data = snapshot.val();
        setPoints(data.points || 2500);
        setUsername(data.username || '');
        setIsUsernameSaved(!!data.username);
      }
    });
  }, [userId]);

  // Increment points every 21 hours
  useEffect(() => {
    const interval = setInterval(() => {
      const incrementPoints = 500;
      const newPoints = points + incrementPoints;
      setPoints(newPoints);
      update(ref(database, `users/${userId}`), { points: newPoints }).catch(console.error);
    }, 21 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [points, userId]);

  // Handlers for username input and save
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSaveUsername = () => {
    if (username) {
      const userRef = ref(database, `users/${userId}`);
      update(userRef, { username })
        .then(() => {
          setIsUsernameSaved(true);
          setIsUsernameModalOpen(false); // Close modal after saving
        })
        .catch(console.error);
    }
  };

  const handleResetUsername = () => {
    setUsername('');
    setIsUsernameSaved(false);
    const userRef = ref(database, `users/${userId}`);
    update(userRef, { username: '' }).catch(console.error); // Reset username in Firebase
  };

  // Toggle Invite Link Visibility
  const toggleInviteLink = () => {
    setIsInviteLinkVisible((prev) => !prev);
  };

  // Create a Telegram-compatible invite link
  const telegramBotUsername = 'spacedogs'; // Replace with your bot's username
  const inviteLink = `https://t.me/SpDogsBot/spacedogs?start=${userId}`;

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
      {/* Username Icon and Display */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '10px',
          fontSize: '24px',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => setIsUsernameModalOpen(true)}
      >
        <FaUserAlt />
      </div>
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
        style={{
          width: '300px',
          height: '300px',
          objectFit: 'cover',
          marginBottom: '20px',
        }}
      />

      {/* Expandable Invite Link */}
      <button
        onClick={toggleInviteLink}
        style={{
          padding: '10px 20px',
          margin: '20px',
          borderRadius: '5px',
          backgroundColor: '#4caf50',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {isInviteLinkVisible ? 'Hide Invite Link' : 'Show Invite Link'}
      </button>

      {isInviteLinkVisible && (
        <div
          style={{
            margin: '10px 0',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '5px',
            color: '#000',
            textAlign: 'center',
          }}
        >
          <p>Invite your friends:</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="text"
              readOnly
              value={inviteLink}
              style={{
                flexGrow: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink).then(() => {
                  alert('Invite link copied to clipboard!');
                });
              }}
              style={{
                padding: '10px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Username Modal */}
      {isUsernameModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <h2>Set Your Username</h2>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
            />
            <div>
              <button
                onClick={handleSaveUsername}
                style={{ padding: '10px', marginRight: '10px' }}
              >
                Save
              </button>
              <button onClick={handleResetUsername} style={{ padding: '10px' }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoPoints;
