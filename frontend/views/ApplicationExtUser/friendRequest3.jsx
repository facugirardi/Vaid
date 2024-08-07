

import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const FriendsRequest = () => {
  const { data: user } = useRetrieveUserQuery();  
  const [userType, setUserType] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const [organizationId, setOrganizationId] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.href;
    // Use URL constructor to parse the URL
    const url = new URL(currentUrl);
    // Split the pathname into segments
    const pathSegments = url.pathname.split('/');
    // Find the segment after 'dashboard'
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      setOrganizationId(pathSegments[dashboardIndex + 1]);
    }
  }, []);
 
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (organizationId) {
        try {
          const response = await fetch(`http://localhost:8000/api/person/${organizationId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 404) {
            push('/not-found');
            return;
          }
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Fetched userDetails:', data); // Logging fetched data
          setUserDetails(data);
        } catch (error) {
          toast.error(`Failed to retrieve user. Error: ${error.message}`);
        }
      }
    };

    if (organizationId) {
      fetchUserDetails();
      console.log(userDetails)
    }
  }, [organizationId]);


  return (
    <React.Fragment>
            
        <Tab.Pane eventKey="friendsRequest" id="friends" role="tabpanel" aria-labelledby="friends-tab">
          <Card>
            <Card.Header>
              <h5>Details</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-0 text-muted">Name</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">
                    {userDetails ? `${userDetails.user.first_name} ${userDetails.user.last_name}` : 'Loading...'}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Country</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails ? userDetails.person.country : 'Loading...'}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Email</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails ? userDetails.user.email : 'Loading...'}</h6>
                </Col>
              </Row>

            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <h5>Other Information</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-0 text-muted">Description</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails ? userDetails.person.description : 'Loading...'}</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab.Pane>
    </React.Fragment>
  );
}

export default FriendsRequest;
