import React from 'react';

const InviteFriends: React.FC = () => {
  const inviteLink = "https://t.me/SpDogsBot/spacedogs";

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#000', // Black background
      color: 'white', 
      textAlign: 'center' 
    }}>
      {/* Black box */}
      <div style={{ 
        backgroundColor: '#333', // Black box
        padding: '20px', 
        borderRadius: '10px',
        maxWidth: '400px', 
        width: '90%',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        {/* Space-suited dog emoji at the top */}
        <div style={{ fontSize: '50px', marginBottom: '20px' }}>🐶🚀</div>

        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Invite Friends</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px' }}>
          Invite your friends to earn points!
        </p>

        {/* Shareable link */}
        <a 
          href={inviteLink} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#d3d3d3', // Light gray button
            color: '#000', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            fontSize: '16px',
            textDecoration: 'none',
            display: 'inline-block',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c0c0c0')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d3d3d3')}
        >
          Share Invite Link 🚀
        </a>
      </div>
    </div>
  );
};

export default InviteFriends;
