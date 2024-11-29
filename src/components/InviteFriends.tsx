import React, { useEffect, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path to your Firebase config

declare global {
  interface Window {
    Telegram: any;
  }
}

const InviteFriends: React.FC = () => {
  const [telegramId, setTelegramId] = useState<string>(''); // Telegram ID
  const [username, setUsername] = useState<string>(''); // Telegram username
  const [inviteLink, setInviteLink] = useState<string>(''); // Invite link

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const userData = tg.initDataUnsafe?.user || {};
    const fetchedUsername = userData.username || 'Guest';
    const fetchedTelegramId = userData.id || 'Unknown';

    setUsername(fetchedUsername);
    setTelegramId(fetchedTelegramId);

    const baseUrl = `https://t.me/SpDogsBot/spacedogs`; // Replace with your bot's username
    const inviteUrl = `${baseUrl}?start=${fetchedTelegramId}`;
    setInviteLink(inviteUrl);
  }, []);

  const rewardInviter = async (inviterId: string) => {
    if (inviterId) {
      const inviterRef = ref(database, `users/${inviterId}/points`);
      const bonusPoints = 500;

      try {
        const snapshot = await get(inviterRef);
        const currentPoints = snapshot.exists() ? snapshot.val() : 0;

        await set(inviterRef, currentPoints + bonusPoints);
      } catch (error) {
        console.error('Failed to reward inviter:', error);
      }
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
          Invite your friends to join Space Dogs and earn points!
        </p>

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
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c0c0c0')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d3d3d3')}
        >
          Share Invite Link 🚀
        </a>

        {username && (
          <p style={{ marginTop: '20px', fontSize: '16px', color: '#ccc' }}>
            Logged in as <strong>{username}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default InviteFriends;
