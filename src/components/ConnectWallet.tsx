import React from 'react';
import walletImage from '../assets/wallet.png.png'; // Adjust the path to the image inside the assets folder

const ConnectWallet: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#000', // Optional: black background for contrast
      color: 'white', 
      textAlign: 'center' 
    }}>
      <img 
        src={walletImage} 
        alt="Wallet Coming Soon" 
        style={{ 
          width: '300px', 
          height: 'auto', 
          marginBottom: '20px', 
          animation: 'glow 1.5s infinite', // Apply glow animation
        }} 
      />
      <h1></h1>

      {/* Glow animation */}
      <style>
        {`
          @keyframes glow {
            0% {
              box-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
            }
            50% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 1);
            }
            100% {
              box-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ConnectWallet;
