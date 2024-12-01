import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaDog, FaCoins, FaWallet, FaUserFriends } from 'react-icons/fa';
import AutoPoints from '../components/AutoPoints';
import Shop from '../components/Shop';
import ConnectWallet from '../components/ConnectWallet';
import InviteFriends from '../components/InviteFriends';
import SplashScreen from '../components/SplashScreen';
import './AppRouter.css';

const AppRouter: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash screen for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="app-background">
        <Routes>
          <Route path="/" element={<AutoPoints />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/wallet" element={<ConnectWallet />} />
          <Route path="/invite" element={<InviteFriends />} />
        </Routes>

        <nav className="navbar">
          <Link to="/" className="link-style">
            <FaDog size={24} />
            <span>Home</span>
          </Link>
          <Link to="/shop" className="link-style">
            <FaCoins size={24} />
            <span>Earn</span>
          </Link>
          <Link to="/wallet" className="link-style">
            <FaWallet size={24} />
            <span>Wallet</span>
          </Link>
          <Link to="/invite" className="link-style">
            <FaUserFriends size={24} />
            <span>Invite</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
};

export default AppRouter;
