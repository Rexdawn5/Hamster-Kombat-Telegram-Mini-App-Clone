import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import database from '../firebaseConfig'; // Import your Firebase config

const InviteFriends: React.FC = () => {
  const userId = "user123"; // Replace with dynamic user identification logic
  const inviteLink = `https://your-backend-domain.com/handleReferral?ref=${userId}`;
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize user data in Firebase
  useEffect(() => {
    const userRef = ref(database, `users/${userId}`);
    set(userRef, {
      points: 2500, // User starts with 2500 points
      inviteLink,
    }).catch((error) => console.error("Error setting user data in Firebase:", error));
  }, [inviteLink, userId]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset "copied" state after 2 seconds
      })
      .catch((error) => console.error('Error copying link:', error));
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
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🐶🚀</div>

        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Invite Friends</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Invite your friends to earn points!
        </p>

        <button
          onClick={handleCopy}
          style={{
            backgroundColor: '#4CAF50', // Green button
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          {copied ? 'Link Copied!' : 'Copy Invite Link'}
        </button>
      </div>
    </div>
  );
};

export default InviteFriends;
