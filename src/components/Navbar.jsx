import React from 'react';
import { MdHowToVote } from 'react-icons/md';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel" aria-label="Main Navigation">
      <div className="navbar-content">
        <div className="navbar-brand">
          <MdHowToVote className="brand-icon" aria-hidden="true" />
          <h1>VoterAssist</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
