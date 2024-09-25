import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import '@/app/dashboard/profile.css';
// img
import avatar1 from "@/public/assets/images/user/avatar-1.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Suggestions = ({ userId }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: user } = useRetrieveUserQuery();
    const { push } = useRouter();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user.id) {
                try {
                    const response = await fetch(`http://localhost:8000/api/person/${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status === 404) {
                        window.location.href = '/not-found';
                        return;
                    }
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    setUserDetails(data);
                } catch (error) {
                    toast.error(`No se pudo recuperar el usuario. Error: ${error.message}`);
                }
            }
        };

        if (user.id) {
            fetchUserDetails();
        }
    }, [user.id]);
    
    const handleApply = async (orgId) => {
        if (userDetails.user.is_form === true) {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${user.id}/apply-org/${orgId}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        org_id: orgId,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    toast.success('¡Solicitud de unión enviada con éxito! ¡Espera la aprobación!');
                } else {
                    toast.error('Error al enviar la solicitud de unión. Contacte al soporte.');
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        } else {
            window.location.href = '/complete/form';
        }
    };

    useEffect(() => {
        // Function to fetch user's organizations
        const fetchOrganizations = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/all-organizations/');
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(data); // Assuming the API returns an array of organizations
                } else {
                    console.error('Error al obtener organizaciones:', data);
                    setOrganizations([]);
                }
            } catch (error) {
                console.error('Error al obtener organizaciones:', error);
                setOrganizations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <React.Fragment>
            <Tab.Pane eventKey="friendsRequests">
                <Row>
                    <h5 className='suggestionsTitle'>Sugerencias</h5>
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
                                                        alt={org.name || "Imagen de la organización"} 
                                                    />
                                                </div>
                                                <div className="my-3">
                                                    <h5 className="mb-0">{org.name}</h5><br/>
                                                    <p className="text-muted">{org.description}</p>
                                                    <p className="text-muted">País: {org.country}</p>
                                                </div>
                                            </div>
                                            <Row className="g-2">
                                                <Col xs={6}>
                                                    <div className="d-flex justify-content-between">
                                                        <a
                                                            className="btn btn-primary buttonorg_perf applybtn"
                                                            onClick={() => handleApply(org.id)}   
                                                            size="sm"
                                                        >
                                                            Unirse
                                                        </a> 
                                                        <a
                                                            className="btn btn-outline-primary buttonorg_perf"
                                                            href={`dashboard/${org.id}/organization`}
                                                            size="sm"
                                                        >
                                                            Perfil
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
                                    <h6>No se encontraron sugerencias para este usuario.</h6>
                                </div>
                            </Col>
                        )
                    }
                </Row>
            </Tab.Pane>
        </React.Fragment>
    );
};

export default Suggestions;
