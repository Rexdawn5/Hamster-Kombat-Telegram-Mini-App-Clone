import React from 'react';

const InviteFriends: React.FC = () => {
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`; // Generate a unique user ID
  const inviteLink = `https://t.me/SpDogsBot/spacedogs?userId=${userId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#000', color: 'white' }}>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '400px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🐶🚀</div>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Invite Friends</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>Invite your friends to earn points!</p>
        <a
          href={inviteLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#d3d3d3',
            color: '#000',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          Share Invite Link 🚀
        </a>
      </div>
    </div>
  );
};

export default InviteFriends;
