import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaDog, FaCoins, FaWallet } from 'react-icons/fa'; // Removed FaTasks
import AutoPoints from '../components/AutoPoints';
import Shop from '../components/Shop';
import ConnectWallet from '../components/ConnectWallet';
import './AppRouter.css';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="app-background">
        <Routes>
          <Route path="/" element={<AutoPoints />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/wallet" element={<ConnectWallet />} />
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
        </nav>
      </div>
    </Router>
  );
};

export default AppRouter;
