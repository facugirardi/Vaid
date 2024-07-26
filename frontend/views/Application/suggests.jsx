import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tab, Button } from "react-bootstrap";
import '@/app/dashboard/profile.css';
// img
import avatar1 from "@/public/assets/images/user/avatar-1.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const Suggestions = ({ userId }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: user } = useRetrieveUserQuery();

    useEffect(() => {
        // Function to fetch user's organizations
        const fetchOrganizations = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/all-organizations/');
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(data); // Assuming the API returns an array of organizations
                } else {
                    console.error('Error fetching organizations:', data);
                    setOrganizations([]);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
                setOrganizations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            <Tab.Pane eventKey="friendsRequests">
                <Row>
                    <h5 className='suggestionsTitle'>Suggestions</h5>
                    <h1></h1><h1></h1>
                    {
                        organizations.slice(0, 6).length > 0 ? (
                            organizations.slice(0, 6).map((org, index) => (
                                <Col xl={4} xxl={3} key={index}>
                                    <Card className="border shadow-none">
                                        <Card.Body>
                                            <div className="text-center">
                                                <div className="chat-avtar d-sm-inline-flex">
                                                    <Image 
                                                        className="rounded-circle img-thumbnail img-fluid wid-80" 
                                                        src={org.image || avatar1} 
                                                        alt={org.name || "Organization image"} 
                                                    />
                                                </div>
                                                <div className="my-3">
                                                    <h5 className="mb-0">{org.name}</h5><br/>
                                                    <p className="text-muted">{org.description}</p>
                                                    <p className="text-muted">Country: {org.country}</p>
                                                </div>
                                            </div>
                                            <Row className="g-2">
                                                <Col xs={6}>
                                                    <div className="d-flex justify-content-between">
                                                        <a
                                                            className="btn btn-primary buttonorg_perf"
                                                            href={`dashboard/${org.name}/home`}   
                                                            size="sm"
                                                        >
                                                            Enter
                                                        </a> 
                                                        <a
                                                            className="btn btn-outline-primary buttonorg_perf"
                                                            href={`dashboard/${org.name}/home`}
                                                            size="sm"
                                                        >
                                                            Profile
                                                        </a>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col>
                                <div className="text-center">
                                    <h6>No suggestions found for this user.</h6>
                                </div>
                            </Col>
                        )
                    }
                </Row>
            </Tab.Pane>
        </React.Fragment>
    );
}

export default Suggestions;
