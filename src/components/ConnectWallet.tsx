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
        style={{ width: '300px', height: 'auto', marginBottom: '20px' }} // Adjust the size as needed
      />
      <h1></h1>
    </div>
  );
};

export default ConnectWallet;
