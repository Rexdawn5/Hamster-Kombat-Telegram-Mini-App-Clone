import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import database from '../firebaseConfig'; // Firebase configuration

const InviteFriends: React.FC = () => {
  const userId = 'user123'; // Replace with dynamic user identification logic
  const inviteLink = `https://t.me/SpDogsBot/spacedogs?ref=${userId}`;
  const [copied, setCopied] = useState(false); // State to track if the link was copied

  // Track invite link usage in Firebase
  const handleInviteClick = () => {
    const inviteRef = ref(database, `invites/${userId}`);
    push(inviteRef, {
      timestamp: Date.now(), // Track the timestamp of the invite
      link: inviteLink,
    })
      .then(() => console.log('Invite tracked successfully in Firebase'))
      .catch((error) => console.error('Error tracking invite in Firebase:', error));
  };

  // Copy invite link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true); // Set copied state to true
        handleInviteClick(); // Track usage in Firebase
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
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

        {/* Copy button */}
        <button
          onClick={handleCopyLink} // Copy link and track usage
          style={{
            backgroundColor: copied ? '#4CAF50' : '#d3d3d3', // Green when copied
            color: '#000',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = copied ? '#4CAF50' : '#c0c0c0')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = copied ? '#4CAF50' : '#d3d3d3')
          }
        >
          {copied ? 'Link Copied!' : 'Copy Invite Link 🚀'}
        </button>
      </div>
    </div>
  );
};

export default InviteFriends;
