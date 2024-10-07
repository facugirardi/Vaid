import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import '@/app/dashboard/profile.css';
// img
import avatar1 from "@/public/assets/images/user/avatar-1.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const Requests = ({ userId }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: user } = useRetrieveUserQuery();
    const [organizations2, setOrganizations2] = useState([]);

    useEffect(() => {
        // Función para obtener las organizaciones del usuario
        const fetchOrganizations = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${user.id}/organizations`);
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(data.organizations);
                } else {
                    console.error('Error al obtener las organizaciones:', data.error);
                }
            } catch (error) {
                console.error('Error al obtener las organizaciones:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchOrganizations2 = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/organizations/candidatesorg/?user_id=${user.id}`);
                const data = await response.json();
                if (response.ok) {
                    setOrganizations2(data); // Assuming the API returns an array of organizations
                    console.log('Organizaciones:', data);
                } else {
                    console.error('Error al obtener organizaciones:', data);
                    setOrganizations2([]);
                }
            } catch (error) {
                console.error('Error al obtener organizaciones:', error);
                setOrganizations2([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
        fetchOrganizations2();
    }, [user.id]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    const bothEmpty = organizations.length === 0 && organizations2.length === 0;

    return (
        <React.Fragment>
            <Tab.Pane eventKey="requests">
                <Card>
                    <Card.Body>
                        <Row>
                            <h5>Solicitudes de Unión a Organizaciones</h5>
                            <h1></h1><h1></h1>
                            {
                                !bothEmpty && (
                                    <>
                                        {
                                            organizations2.length > 0 && organizations2.map((org, index) => (
                                                <Col xl={12} xxl={12} key={index}>
                                                    <Card className="border shadow-none">
                                                        <Card.Body>
                                                            <div className="text-center">
                                                                <div className="chat-avtar d-sm-inline-flex">
                                                                    <Image 
                                                                        className="rounded-circle img-thumbnail img-fluid wid-80" 
                                                                        src={org.profile_image ? `http://localhost:8000${org.profile_image}` : avatar1} 
                                                                        alt={org.name || "Imagen de la organización"} 
                                                                        width={100}
                                                                        height={100}
                                                                    />
                                                                </div>
                                                                <div className="my-3">
                                                                    <h5 className="mb-0">{org.name} 
                                                                    </h5>
                                                                </div>
                                                                <div className="my-3">
                                                                    <p className="mb-0"><span className="badge bg-warning">Pendiente</span></p>
                                                                </div>
                                                            </div>
                                                            <Row className="g-2">
                                                                <Col xs={12}>
                                                                    <div className="d-flex justify-content-center">
                                                                        <a
                                                                            className="btn btn-primary buttonorg_perf2"
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
                                        }
                                    </>
                                )
                            }
                                        {
                                            organizations.length > 0 && organizations.map((org, index) => (
                                                <Col xl={12} xxl={12} key={index}>
                                                    <Card className="border shadow-none">
                                                        <Card.Body>
                                                            
                                                            <div className="text-center">
                                                                <div className="chat-avtar d-sm-inline-flex">
                                                                    <Image 
                                                                        className="rounded-circle img-thumbnail img-fluid wid-80" 
                                                                        src={org.profile_image ? `http://localhost:8000${org.profile_image}` : avatar1} 
                                                                        alt={org.name || "Imagen de la organización"} 
                                                                        width={100}
                                                                        height={100}
                                                                    />
                                                                </div>
                                                                <div className="my-3">
                                                                    <h5 className="mb-0">{org.name}</h5>
                                                                </div>
                                                                <div className="my-3">
                                                                    <p className="mb-0"><span className="badge bg-success">Aceptada</span></p>
                                                                </div>
                                                            </div>

                                                            <Row className="g-2">
                                                                <Col xs={12}>
                                                                    <div className="d-flex justify-content-center">
                                                                        <a
                                                                            className="btn btn-primary buttonorg_perf2"
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
                                        }
                            {
                                bothEmpty && (
                                    <Col>
                                        <div className="text-center">
                                            <h6>No se encontraron organizaciones para este usuario.</h6>
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

export default Requests;
