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
                                <p className="mb-0 text-muted">Father&apos;s Name</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">Mr. Deepak Handge</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Address</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">Street 110-B Kalani Bag, Dewas, M.P. INDIA</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Zip Code</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">12345</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Phone</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">+0 123456789 , +0 123456789</h6>
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
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Website</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0"><a href="#" className="link-primary">http://example.com</a></h6>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header>
                        <h5>other Information</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row className="g-3">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Occupation</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">Designer</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Skills</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">C#, Javascript, Scss</h6>
                            </Col>
                        </Row>
                        <Row className="g-3 mt-0">
                            <Col md={4}>
                                <p className="mb-0 text-muted">Jobs</p>
                            </Col>
                            <Col md={6}>
                                <h6 className="mb-0">Phoenixcoded</h6>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Tab.Pane>
        </React.Fragment>
    );
}

export default FriendsRequest;

