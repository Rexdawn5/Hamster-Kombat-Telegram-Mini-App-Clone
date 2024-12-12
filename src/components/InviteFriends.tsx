import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: string;
            username: string;
          };
        };
      };
    };
  }
}

const InviteFriends: React.FC = () => {
  const [profileLink, setProfileLink] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const userData = tg.initDataUnsafe?.user;

    if (userData) {
      const telegramId = userData.id;
      const username = userData.username || `user_${telegramId}`;
      const dynamicLink = `https://t.me/SpDogsBot/start?ref=${telegramId}_${username}`;
      setProfileLink(dynamicLink);

      // Load invited users from localStorage
      const storedInvites = localStorage.getItem(`invited_${telegramId}`);
      setInvitedUsers(storedInvites ? JSON.parse(storedInvites) : []);

      // Add listener for storage changes
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === `invited_${telegramId}`) {
          const updatedInvites = event.newValue ? JSON.parse(event.newValue) : [];
          setInvitedUsers(updatedInvites);
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Cleanup listener on unmount
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopySuccess('Copied to clipboard! 🚀');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy. Try again.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#000',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#333',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🐶🚀</div>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Invite Friends</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Invite your friends to earn points!
        </p>
        <button
          onClick={handleCopyLink}
          style={{
            backgroundColor: '#d3d3d3',
            color: '#000',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            border: 'none',
            animation: 'glow 1.5s infinite',
          }}
        >
          Copy Your Profile Link 🚀
        </button>
        {copySuccess && (
          <p style={{ marginTop: '20px', fontSize: '16px', color: '#0f0' }}>
            {copySuccess}
          </p>
        )}
      </div>

      {/* Invited Users Section */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '10px',
          backgroundColor: '#222',
          maxWidth: '400px',
          width: '90%',
          color: '#fff',
          textAlign: 'left',
        }}
      >
        <h2>Invited Friends</h2>
        {invitedUsers.length > 0 ? (
          <ul>
            {invitedUsers.map((user, index) => (
              <li key={index} style={{ margin: '5px 0' }}>
                {user}
              </li>
            ))}
          </ul>
        ) : (
          <p>No friends invited yet.</p>
        )}
      </div>
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.6); }
            50% { box-shadow: 0 0 20px rgba(255, 255, 255, 1); }
            100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.6); }
          }
        `}
      </style>
    </div>
  );
};

export default InviteFriends;
