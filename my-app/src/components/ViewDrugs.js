import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ViewDrugs = () => {
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/drugs')
      .then(response => setDrugs(response.data))
      .catch(error => console.error('Error fetching drugs:', error));
  }, []);
  const userin = localStorage.getItem("user"); // Check if user exists in localStorage
  const navigate = useNavigate();

  useEffect(() => {
    if (!userin) {
      navigate('/login'); // Redirect to login page if no user is found
    }
  }, [userin, navigate]); // Dependency on userin and navigate


  return (
    userin?(
    <div className="container mt-5">
      <h1>Available Drugs</h1>
  
      {drugs.length === 0 ? (
        <p>No drugs available at the moment.</p>
      ) : (
        <div className="drug-list">
          <Row>
            {drugs.map(drug => (
              <Col md={4} key={drug._id}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>{drug.name}</Card.Title>
                    <Card.Text>Manufacturer: {drug.manufacturer}</Card.Text>
                    <Card.Text>Medical Composition: {drug.medicalComposition}</Card.Text>
                    <Card.Text>Expiry Date: {new Date(drug.expiryDate).toLocaleDateString()}</Card.Text>
                    <Card.Text>Units per Package: {drug.unitsInPackage}</Card.Text>
                    <Card.Text>Cost per Package: ${drug.costPerPackage}</Card.Text>
                    <Card.Text>
                      Available Stock:
                      {drug.locations.map((location, index) => (
                        <div key={index}>
                          {location.location}: {location.availableStock} units
                        </div>
                      ))}
                    </Card.Text>
                    <Button variant="primary">Add to Cart</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>):(<div>Loading</div>)
  );
}  

export default ViewDrugs;
