import React from 'react';
import HelpIcon from '../HelpIcon';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div>
      <h1>Welcome to LabBooker</h1>
      <p>Book your lab equipment here</p>
      <Link to={'/dashboard'}>Welcome to Dashboard!</Link>
      <br />
      <Link to={'/bookings'}>check out Bookings!</Link>
      <HelpIcon />
    </div>
  );
};

export default Home;