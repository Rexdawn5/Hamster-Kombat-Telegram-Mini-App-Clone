import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaDog, FaCoins, FaTasks, FaWallet } from 'react-icons/fa';
import AutoPoints from '../components/AutoPoints';
import InviteFriends from '../components/InviteFriends';
import Shop from '../components/Shop';
import ConnectWallet from '../components/ConnectWallet';
import './AppRouter.css';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="app-background">
        <Routes>
          <Route path="/" element={<AutoPoints />} />
          <Route path="/referral" element={<InviteFriends />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/wallet" element={<ConnectWallet />} />
        </Routes>

        <nav className="navbar">
          <Link to="/" className="link-style">
            <FaDog size={24} />
            <span>Home</span>
          </Link>
          <Link to="/referral" className="link-style">
            <FaTasks size={24} />
            <span>Friends</span>
          </Link>
          <Link to="/shop" className="link-style">
            <FaCoins size={24} />
            <span>Shop</span>
          </Link>
          <Link to="/wallet" className="link-style">
            <FaWallet size={24} />
            <span>Wallet</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
};

export default AppRouter;
