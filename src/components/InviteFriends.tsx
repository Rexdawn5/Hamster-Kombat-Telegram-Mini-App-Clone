import React, { useEffect, useState } from 'react';

const InviteFriends: React.FC = () => {
  const [telegramId, setTelegramId] = useState<string>(''); // Telegram ID
  const [username, setUsername] = useState<string>(''); // Telegram username
  const [inviteLink, setInviteLink] = useState<string>(''); // Invite link

  useEffect(() => {
    // Initialize Telegram Web App
    const tg = window.Telegram.WebApp;

    // Ensure the WebApp is ready
    tg.ready();

    // Fetch Telegram user data using initDataUnsafe
    const userData = tg.initDataUnsafe?.user || {};
    const fetchedUsername = userData.username || 'Guest';
    const fetchedTelegramId = userData.id || 'Unknown';

    setUsername(fetchedUsername);
    setTelegramId(fetchedTelegramId);

    // Generate invite link
    const baseUrl = `https://t.me/SpDogsBot/spacedogs`;
    const inviteUrl = `${baseUrl}?inviterId=${fetchedTelegramId}`;
    setInviteLink(inviteUrl);
  }, []);

  return (
    <div>
      <h1>Invite Friends</h1>
      <p>Share this link with your friends:</p>
      <a href={inviteLink} target="_blank" rel="noopener noreferrer">
        {inviteLink}
      </a>
      <p>Logged in as: {username}</p>
    </div>
  );
};

export default InviteFriends;
