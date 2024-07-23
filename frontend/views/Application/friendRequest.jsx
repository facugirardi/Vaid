import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const FriendsRequest = () => {

    const { data: user } = useRetrieveUserQuery();
    
    
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/person/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUserDetails(data);
            } catch (error) {
                toast.error(`Failed to retrieve user. Error: ${error.message}`);
            }
        };

        if (user && user.id) {
            fetchUserDetails();
        }
    }, [user]);

    if (!user || !userDetails) {
        return <p>Loading...</p>;
    }
    return (
        <React.Fragment>
            <Tab.Pane eventKey="friendsRequest" id="friends" role="tabpanel" aria-labelledby="friends-tab">
                <Card>
                    <Card.Header>
                        <h5>Personal Details</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-3">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Full Name</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">{user.first_name} {user.last_name}</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Country</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">{userDetails.person.country}</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Phone</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">{userDetails.person.phone_number}</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Email</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0"><a href="mailto:support@example.com" className="link-primary">{user.email}</a></h6>
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
                                <h6 className="mb-0">{userDetails.person.description}
                </h6>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Tab.Pane>
        </React.Fragment>
    );
}

export default FriendsRequest;

