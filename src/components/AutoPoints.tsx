import React, { useState, useEffect } from 'react';
import { ref, set, update, get, push } from 'firebase/database';
import database from '../firebaseConfig';
import spacedog from '../assets/spacedogs.png.png';
import { FaUserAlt } from 'react-icons/fa'; // User icon

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('');
  const [isInviteVisible, setIsInviteVisible] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [joinedAt, setJoinedAt] = useState<number | null>(null);
  const [isUsernameSaved, setIsUsernameSaved] = useState<boolean>(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState<boolean>(false);

  // Get invited user ID from URL parameters
  const queryParams = new URLSearchParams(window.location.search);
  const invitedUserId = queryParams.get('spacedogsuserId');
  
  // Use local user ID or create a new one if no local user exists
  const localUserId = localStorage.getItem('userId');
  const [userId, setUserId] = useState<string>(invitedUserId || localUserId || '');

  useEffect(() => {
    const currentUserId = invitedUserId || localUserId || push(ref(database, 'users')).key!;
    setUserId(currentUserId);

    // If it's a new user, store userId in localStorage
    if (!localUserId && !invitedUserId) {
      localStorage.setItem('userId', currentUserId);
    }

    const userRef = ref(database, `users/${currentUserId}`);
    get(userRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // If the user doesn't exist, generate a new username and profile
        setUsername(`SpaceDog${currentUserId.slice(-5)}`);
        setJoinedAt(Date.now());
      } else {
        // If the user exists, fetch and set their profile data
        const data = snapshot.val();
        setPoints(data.points || 2500);
        setUsername(data.username || '');
        setJoinedAt(data.joinedAt || null);
        setIsUsernameSaved(true);  // Set the flag that username is saved
      }
    });
  }, [localUserId, invitedUserId]);

  useEffect(() => {
    // If username is set, update the backend with the username
    if (username && !isUsernameSaved) {
      const userRef = ref(database, `users/${userId}`);
      set(userRef, {
        points: 2500,
        username: username,
        joinedAt: joinedAt || Date.now(),
      }).then(() => setIsUsernameSaved(true)).catch(console.error);
    }
  }, [username, isUsernameSaved, userId, joinedAt]);

  const inviteLink = isUsernameSaved ? `https://t.me/SpDogsBot/spacedogsuserId=${userId}` : '';

  useEffect(() => {
    // Increment points every 21 hours for the user
    const interval = setInterval(() => {
      const incrementPoints = 500;
      const newPoints = points + incrementPoints;
      setPoints(newPoints);
      update(ref(database, `users/${userId}`), { points: newPoints }).catch(console.error);
    }, 21 * 60 * 60 * 1000); // 21 hours in milliseconds

    return () => clearInterval(interval);
  }, [points, userId]);

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(console.error);
    }
  };

  const formatTimestamp = (timestamp: number | null) =>
    timestamp ? new Date(timestamp).toLocaleString() : 'Not available';

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSaveUsername = () => {
    if (username) {
      setIsUsernameSaved(true);
      const userRef = ref(database, `users/${userId}`);
      set(userRef, {
        points: points,
        username: username,
        joinedAt: joinedAt || Date.now(),
      }).then(() => {
        setIsUsernameModalOpen(false); // Close modal after saving username
      }).catch(console.error);
    }
  };

  const handleResetUsername = () => {
    setUsername('');
    setIsUsernameSaved(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'black', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '24px', color: 'white', cursor: 'pointer' }} onClick={() => setIsUsernameModalOpen(true)}>
        <FaUserAlt />
      </div>

      <div style={{ position: 'absolute', top: '8px', left: '45px', fontSize: '20px', color: 'white', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {username || ''}
      </div>

      <div style={{ backgroundColor: '#3b3b5e', color: '#fff', padding: '15px 30px', borderRadius: '10px', marginBottom: '20px', fontSize: '24px' }}>
        {points.toLocaleString()} spdogs
      </div>

      <img src={spacedog} alt="Space Dog" style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }} />

      <p style={{ color: '#fff' }}>Joined At: {formatTimestamp(joinedAt)}</p>

      <button style={{ backgroundColor: isInviteVisible ? '#f0a500' : '#3b3b5e', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }} onClick={() => setIsInviteVisible(!isInviteVisible)} disabled={!isUsernameSaved}>
        {isInviteVisible ? 'Close Invite' : 'Invite Friends'}
      </button>

      {isInviteVisible && isUsernameSaved && inviteLink && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#2b2b4e', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#fff', marginBottom: '10px' }}>Copy your invite link below:</p>
          <input type="text" readOnly value={inviteLink} style={{ padding: '10px', width: '90%', maxWidth: '300px', marginBottom: '10px', textAlign: 'center' }} />
          <button onClick={handleCopyLink} style={{ backgroundColor: '#3b3b5e', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}

      {/* Modal for setting/resetting username */}
      {isUsernameModalOpen && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h2>Set Your Username</h2>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
            />
            <div>
              <button onClick={handleSaveUsername} style={{ padding: '10px', marginRight: '10px' }}>Save</button>
              <button onClick={handleResetUsername} style={{ padding: '10px' }}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoPoints;
