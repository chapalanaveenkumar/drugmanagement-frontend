import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RefillStatus = () => {
  const [refills, setRefills] = useState([]);
  const [drugName, setDrugName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [memberId, setMemberId] = useState('');  // Take memberId input from the user
  const navigate = useNavigate();
  const userin = localStorage.getItem("user"); // Check if user exists in localStorage

  useEffect(() => {
    if (!userin) {
      navigate('/login'); // Redirect to login page if no user is found
    }
  }, [userin, navigate]); // Dependency on userin and navigate


  useEffect(() => {
    if (memberId) {
      axios.get(`http://localhost:3000/api/refills/${memberId}`)
        .then(response => setRefills(response.data))
        .catch(error => console.error('Error fetching refill status:', error));
    }
  }, [memberId]);

  const handleCreateRefill = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!drugName || !quantity || !memberId) {
      alert("All fields are required: Member ID, Drug Name, and Quantity.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/refills', {
        memberId,
        drugName,
        quantity
      });

      // If refill creation is successful, update the refills list
      alert('Refill request created successfully');
      setDrugName(''); // Reset input fields after successful submission
      setQuantity(1);
      setMemberId(''); // Reset memberId field after successful submission

      // Optionally, refetch refills for the member
      axios.get(`http://localhost:3000/api/refills/${memberId}`)
        .then(response => setRefills(response.data))
        .catch(error => console.error('Error fetching updated refills:', error));
    } catch (error) {
      console.error('Error creating refill request:', error);
      alert('Failed to create refill request.');
    }
  };

  return (
    userin?(
    <div className="container mt-5">
      <h1>Your Refill Status</h1>
      
      {/* Refill Form */}
      <Form onSubmit={handleCreateRefill}>
        <Form.Group controlId="memberId">
          <Form.Label>Member ID</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter your Member ID" 
            value={memberId} 
            onChange={(e) => setMemberId(e.target.value)} 
          />
        </Form.Group>

        <Form.Group controlId="drugName">
          <Form.Label>Drug Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter drug name" 
            value={drugName} 
            onChange={(e) => setDrugName(e.target.value)} 
          />
        </Form.Group>

        <Form.Group controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Refill Request
        </Button>
      </Form>

      <hr />

      <h2>Refill Requests</h2>
      <div className="row">
        {refills.map(refill => (
          <div className="col-md-4" key={refill._id}>
            <Card className={`mb-4 ${refill.status.toLowerCase()}`}>
              <Card.Body>
                <Card.Title>{refill.drugName}</Card.Title>
                <Card.Text>Refill Date: {new Date(refill.date).toLocaleDateString()}</Card.Text>
                <Card.Text>Status: {refill.status}</Card.Text>
                <Card.Text>Quantity: {refill.quantity}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>):(<div>Loading</div>)
  );
};

export default RefillStatus;
