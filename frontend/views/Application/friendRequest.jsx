import React from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const FriendsRequest = () => {

    const { data: user } = useRetrieveUserQuery();
    
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
                                <h6 className="mb-0">Argentina</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">City</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">Cordoba</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Phone</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">+0 123456789</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Email</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0"><a href="mailto:support@example.com" className="link-primary">support@example.com</a></h6>
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
                                <h6 className="mb-0">I live in Cordoba but i grew up in Rio do Janeiro, Brazil.
I speak fluid Spanish and natal Portuguese. 
I have two childs, Carla 12 years old and Marcos 4 years old.
Im working in “Pocito” construction, as foreman. My purpose in life is to help people because I know how it feels to be homeless.

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

