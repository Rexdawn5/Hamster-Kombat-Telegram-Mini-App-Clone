import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import database from '../firebaseConfig'; // Ensure you have your Firebase config setup

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
  const [profileLink, setProfileLink] = useState<string>(''); // State for dynamic invite link
  const [copySuccess, setCopySuccess] = useState<string>(''); // State for copy status message

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const userData = tg.initDataUnsafe?.user;

    if (userData) {
      const telegramId = userData.id;
      const username = userData.username || `user_${telegramId}`;

      // Generate the dynamic profile link
      const dynamicLink = `https://t.me/SpDogsBot/start?ref=${telegramId}_${username}`;
      setProfileLink(dynamicLink);

      // Save user data to Firebase
      const userRef = ref(database, `users/${telegramId}`);
      set(userRef, {
        username: username,
        inviteLink: dynamicLink,
        createdAt: new Date().toISOString(),
      }).catch(console.error);
    } else {
      setProfileLink('https://t.me/SpDogsBot/start'); // Default fallback link
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      setCopySuccess('Copied to clipboard! 🚀');
      setTimeout(() => setCopySuccess(''), 3000); // Clear message after 3 seconds
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
        backgroundColor: '#000', // Black background
        color: 'white',
        textAlign: 'center',
      }}
    >
      {/* Black box */}
      <div
        style={{
          backgroundColor: '#333', // Black box
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Space-suited dog emoji at the top */}
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🐶🚀</div>

        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Invite Friends</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Invite your friends to earn points!
        </p>

        {/* Copy to Clipboard Button */}
        <button
          onClick={handleCopyLink}
          style={{
            backgroundColor: '#d3d3d3', // Light gray button
            color: '#000',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '16px',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            border: 'none',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c0c0c0')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d3d3d3')}
        >
          Copy Your Profile Link 🚀
        </button>

        {/* Copy status message */}
        {copySuccess && (
          <p style={{ marginTop: '20px', fontSize: '16px', color: '#0f0' }}>
            {copySuccess}
          </p>
        )}
      </div>
    </div>
  );
};

export default InviteFriends;
