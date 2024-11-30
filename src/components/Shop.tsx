import React from 'react';
import { FaCoins, FaRocket } from 'react-icons/fa';

const Shop: React.FC = () => {
  // Click handler for point options
  const handlePurchase = (points: number, ton: number, link: string) => {
    console.log(`Purchased ${points} points for ${ton} TON`);
    window.open(link, '_blank'); // Opens the payment link in a new tab
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', color: '#f1f1f1', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>EARN🐶</h1>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        {/* Make a TON Transaction */}
        <div
          style={{ ...pointOptionStyle, animation: 'glow 1.5s infinite' }}
          onClick={() => handlePurchase(2000, 0, 'https://t.me/send?start=IVPqJbt43iaV')}
        >
          <FaCoins style={iconStyle} />
          <span style={textStyle}>Make a TON Transaction</span>
          <FaRocket style={iconStyle} />
        </div>

        {/* 10,000 Points for 1 TON */}
        <div
          style={{ ...pointOptionStyle, animation: 'glow 1.5s infinite' }}
          onClick={() => handlePurchase(10000, 1, 'https://t.me/send?start=IV9jdjl7BVe7')}
        >
          <FaCoins style={iconStyle} />
          <span style={textStyle}>10,000 Points</span>
          <FaRocket style={iconStyle} />
          <span style={textStyle}>1 TON</span>
        </div>

        {/* 15,000 Points for 2 TON */}
        <div
          style={{ ...pointOptionStyle, animation: 'glow 1.5s infinite' }}
          onClick={() => handlePurchase(15000, 2, 'https://t.me/send?start=IVV6Y78fTWq3')}
        >
          <FaCoins style={iconStyle} />
          <span style={textStyle}>15,000 Points</span>
          <FaRocket style={iconStyle} />
          <span style={textStyle}>2 TON</span>
        </div>
      </div>

      {/* Glow animation */}
      <style>
        {`
          @keyframes glow {
            0% {
              box-shadow: 0 0 5px rgba(92, 107, 192, 0.6);
            }
            50% {
              box-shadow: 0 0 20px rgba(92, 107, 192, 1);
            }
            100% {
              box-shadow: 0 0 5px rgba(92, 107, 192, 0.6);
            }
          }
        `}
      </style>
    </div>
  );
};

const pointOptionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#333',
  padding: '10px 20px',
  borderRadius: '10px',
  width: '80%',
  maxWidth: '300px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const iconStyle: React.CSSProperties = {
  fontSize: '20px',
  color: '#3b3b5e',
};

const textStyle: React.CSSProperties = {
  fontSize: '16px',
  margin: '0 10px',
};

export default Shop;
