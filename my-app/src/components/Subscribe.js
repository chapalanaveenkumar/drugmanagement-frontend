import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Subscribe = () => {
  const [memberId, setMemberId] = useState(''); // State for member ID input
  const [plan, setPlan] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [prescriptionId, setPrescriptionId] = useState('');
  const [subscribedDrugs, setSubscribedDrugs] = useState([]);
  const [showSubscribedDrugs, setShowSubscribedDrugs] = useState(false);
  const navigate = useNavigate();
  const userin = localStorage.getItem("user"); // Check if the user is logged in

  useEffect(() => {
    if (!userin) {
      navigate('/login'); // Redirect to login if user is not logged in
    }
  }, [userin, navigate]); // Corrected the dependency array to check 'userin'

  const fetchSubscribedDrugs = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/subscription/${memberId}`);
      if (Array.isArray(response.data)) {
        setSubscribedDrugs(response.data); // Ensure data is an array
      } else {
        setSubscribedDrugs([]); // Reset if invalid data is received
      }
    } catch (error) {
      console.error('Error fetching subscribed drugs:', error);
      setSubscribedDrugs([]); // Reset on error
    }
  };

  const handleSubscription = async () => {
    
    if (!memberId || !prescriptionId || !plan || quantity < 1) {
      alert('All fields are required, and quantity must be at least 1.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/subscription/subscribe', {
        memberId,
        prescriptionId,
        plan,
        quantity,
        
      });

      alert('Subscription successful!');
      fetchSubscribedDrugs(); // Refresh subscribed drugs after a successful subscription
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe!');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Subscribe to Drug Deliveries</h1>

      <Form>
        <div className="form-group mb-3">
          <label htmlFor="memberId">Member ID:</label>
          <Form.Control
            type="text"
            placeholder="Enter Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="prescriptionId">Prescription ID:</label>
          <Form.Control
            type="text"
            placeholder="Enter Prescription ID"
            value={prescriptionId}
            onChange={(e) => setPrescriptionId(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <Form.Check
            type="radio"
            label="Weekly"
            value="weekly"
            checked={plan === 'weekly'}
            onChange={() => setPlan('weekly')}
          />
          <Form.Check
            type="radio"
            label="Monthly"
            value="monthly"
            checked={plan === 'monthly'}
            onChange={() => setPlan('monthly')}
          />
          <Form.Check
            type="radio"
            label="Quarterly"
            value="quarterly"
            checked={plan === 'quarterly'}
            onChange={() => setPlan('quarterly')}
          />
        </div>

        <div className="quantity-adjuster mb-3">
          <Button variant="outline-secondary" onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>-</Button>
          <span className="mx-3">{quantity}</span>
          <Button variant="outline-secondary" onClick={() => setQuantity(prev => prev + 1)}>+</Button>
        </div>

        <Button variant="primary" onClick={handleSubscription}>Subscribe Now</Button>
      </Form>

      <div className="mt-5">
        <Button
          variant="secondary"
          onClick={() => {
            if (showSubscribedDrugs) {
              setShowSubscribedDrugs(false);
            } else {
              fetchSubscribedDrugs(); // Fetch data when user clicks to show subscribed drugs
              setShowSubscribedDrugs(true);
            }
          }}
        >
          {showSubscribedDrugs ? 'Hide Subscribed Drugs' : 'Show Subscribed Drugs'}
        </Button>

        {showSubscribedDrugs && (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Prescription ID</th>
                <th>Plan</th>
                <th>Quantity</th>
                <th>Subscription Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribedDrugs.map((drug, index) => (
                <tr key={index}>
                  <td>{drug.prescriptionId}</td>
                  <td>{drug.plan}</td>
                  <td>{drug.quantity}</td>
                  <td>{drug.createdAt ? new Date(drug.createdAt).toLocaleDateString() : 'N/A'}</td> 
                  </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
