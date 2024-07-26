import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import '@/app/dashboard/profile.css';
// img
import avatar1 from "@/public/assets/images/user/avatar-1.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const Friends = ({ userId }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: user } = useRetrieveUserQuery();

    useEffect(() => {
        // Función para obtener las organizaciones del usuario
        const fetchOrganizations = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${user.id}/organizations`);
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(data.organizations);
                } else {
                    console.error('Error fetching organizations:', data.error);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <React.Fragment>
            <Tab.Pane eventKey="friendsRequests">
                <Card>
                    <Card.Body>
                        <Row>
                            <h5>Your Organizations</h5>
                            <h1></h1><h1></h1>
                            {
                                organizations.length > 0 ? (
                                    organizations.map((org, index) => (
                                        <Col xl={6} xxl={4} key={index}>
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
                                                            <h5 className="mb-0">{org.name}</h5>
                                                        </div>
                                                    </div>
                                                    <Row className="g-2">
                                                        <Col xs={6}>
                                                            <div className="d-grid">
                                                                <a  className="btn btn-primary buttonorg_perf" href={`dashboard/${org.name}/home`}>Enter</a>
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
                                            <h6>No organizations found for this user.</h6>
                                        </div>
                                    </Col>
                                )
                            }
                        </Row>
                    </Card.Body>
                </Card>
            </Tab.Pane>
        </React.Fragment>
    );
}

export default Friends;
