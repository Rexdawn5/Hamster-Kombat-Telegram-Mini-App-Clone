import React, { useState, useEffect } from 'react';
import { ref, set, push, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust to your Firebase configuration

const InviteFriends: React.FC = () => {
  // Simulate dynamic user ID for the inviter
  const userId = 'user123'; // Replace with your dynamic user identification logic

  // Invite link with referral ID
  const inviteLink = `https://t.me/SpDogsBot/spacedogs?ref=${userId}`;
  const [copied, setCopied] = useState(false); // State to track if the link was copied
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]); // List of invited users

  // Track new invite usage in Firebase
  const handleInviteClick = () => {
    const inviteRef = ref(database, `invites/${userId}`);
    push(inviteRef, {
      timestamp: Date.now(),
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
        setCopied(true);
        handleInviteClick(); // Track invite usage
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch((error) => console.error('Error copying link:', error));
  };

  // Listen for new invited users in real-time
  useEffect(() => {
    const invitedUsersRef = ref(database, `invites/${userId}`);
    onValue(invitedUsersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.values(data).map((entry: any) => entry.link);
        setInvitedUsers(users);
      }
    });

    // Cleanup listener
    return () => {
      onValue(invitedUsersRef, () => {});
    };
  }, [userId]);

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
          backgroundColor: '#333',
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
          onClick={handleCopyLink}
          style={{
            backgroundColor: copied ? '#4CAF50' : '#d3d3d3',
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

        {/* List of invited users */}
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '20px' }}>Invited Users:</h2>
          <ul style={{ paddingLeft: '20px' }}>
            {invitedUsers.length > 0 ? (
              invitedUsers.map((user, index) => (
                <li key={index} style={{ fontSize: '16px', color: '#ddd' }}>
                  {user}
                </li>
              ))
            ) : (
              <p style={{ fontSize: '16px', color: '#aaa' }}>No invites yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;
