import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Navigation from './components/Navigation';
import Login from './components/Login';
import Subscribe from './components/Subscribe';
import RefillStatus from './components/RefillStatus';
import ViewDrugs from './components/ViewDrugs';

const App = () => {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/refill-status" element={<RefillStatus />} />
          <Route path="/view-drugs" element={<ViewDrugs />} />
        </Routes>
      </Container>
    </Router>
  );
};

const Home = () => {
  return (
    <div>
      <h1>Welcome to Mail Order Pharmacy</h1>
      <p>Here you can manage your subscriptions, view drugs, and track refills.</p>
    </div>
  );
};

export default App;
