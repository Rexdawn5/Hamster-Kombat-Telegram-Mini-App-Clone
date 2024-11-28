import React, { useState, useEffect } from 'react';
import { ref, set, update, get, push } from 'firebase/database';
import database from '../firebaseConfig';
import spacedog from '../assets/spacedogs.png.png';

const AutoPoints: React.FC = () => {
  const [points, setPoints] = useState<number>(2500);
  const [username, setUsername] = useState<string>('');
  const [isInviteVisible, setIsInviteVisible] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [joinedAt, setJoinedAt] = useState<number | null>(null);

  // Get invited user ID from URL parameters
  const queryParams = new URLSearchParams(window.location.search);
  const invitedUserId = queryParams.get('spacedogsuserId');
  
  // Use local user ID or create a new one if no local user exists
  const localUserId = localStorage.getItem('userId');
  const [userId, setUserId] = useState<string>(invitedUserId || localUserId || '');

  useEffect(() => {
    // Decide whether to fetch invited user profile or create a new user profile
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
        const generatedUsername = `SpaceDog${currentUserId.slice(-5)}`;
        const timestamp = Date.now();

        set(userRef, {
          points: 2500,
          username: generatedUsername,
          joinedAt: timestamp,
        }).catch(console.error);

        setUsername(generatedUsername);
        setJoinedAt(timestamp);
      } else {
        // If the user exists, fetch and set their profile data
        const data = snapshot.val();
        setPoints(data.points || 2500);
        setUsername(data.username || '');
        setJoinedAt(data.joinedAt || null);
      }
    });
  }, [localUserId, invitedUserId]);

  const inviteLink = `https://t.me/SpDogsBot/spacedogsuserId=${userId}`;

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
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  };

  const formatTimestamp = (timestamp: number | null) =>
    timestamp ? new Date(timestamp).toLocaleString() : 'Not available';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'black', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '8px', left: '45px', fontSize: '20px', color: 'white', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {username || ''}
      </div>

      <div style={{ backgroundColor: '#3b3b5e', color: '#fff', padding: '15px 30px', borderRadius: '10px', marginBottom: '20px', fontSize: '24px' }}>
        {points.toLocaleString()} spdogs
      </div>

      <img src={spacedog} alt="Space Dog" style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }} />

      <p style={{ color: '#fff' }}>Joined At: {formatTimestamp(joinedAt)}</p>

      <button style={{ backgroundColor: isInviteVisible ? '#f0a500' : '#3b3b5e', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }} onClick={() => setIsInviteVisible(!isInviteVisible)}>
        {isInviteVisible ? 'Close Invite' : 'Invite Friends'}
      </button>

      {isInviteVisible && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#2b2b4e', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#fff', marginBottom: '10px' }}>Copy your invite link below:</p>
          <input type="text" readOnly value={inviteLink} style={{ padding: '10px', width: '90%', maxWidth: '300px', marginBottom: '10px', textAlign: 'center' }} />
          <button onClick={handleCopyLink} style={{ backgroundColor: '#3b3b5e', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AutoPoints;
