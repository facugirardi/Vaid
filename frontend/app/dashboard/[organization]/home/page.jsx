'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap'; // Importamos componentes de Bootstrap
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './home.css';
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import Image from "next/image";

const Page = () => {
    const [organizationId, setOrganizationId] = useState("");
    const eventCarouselRef = useRef(null); // Reference for the event carousel
    const taskCarouselRef = useRef(null); // Reference for the task carouse
    const [events, setEvents] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOrgAccount, setIsOrgAccount] = useState(false);
    const { data: user, isError, isLoading } = useRetrieveUserQuery();
    const [tasks, setTasks] = useState([]);


  useEffect(() => {
        if (organizationId) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/events/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    setEvents(data);
                } catch (error) {
                    console.error("Error al obtener los datos:", error);
                }
            };

            const fetchData3 = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/tasks/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    setTasks(data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData3();

            fetchData();
        }
    }, [organizationId]);

    const checkUserPermissions = async (userId) => {
        let isAdmin = false;
        let isOrgAccount = false;

        try {
            const adminResponse = await fetch(`http://localhost:8000/api/isAdmin/?user_id=${userId}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const adminData = await adminResponse.json();
            isAdmin = adminData;

            const orgAccountResponse = await fetch(`http://localhost:8000/api/user/${userId}/check-usertype/`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const orgAccountData = await orgAccountResponse.json();
            if (orgAccountData.user_type === 2) {
                isOrgAccount = true;
            }
        } catch (error) {
            console.error("Error al verificar permisos:", error);
        }

        return { isAdmin, isOrgAccount };
    };


    useEffect(() => {
        const fetchData2 = async () => {
            try {
                if (user.id) {
                    const { isAdmin, isOrgAccount } = await checkUserPermissions(user.id);
                    setIsAdmin(isAdmin);
                    setIsOrgAccount(isOrgAccount);
                    console.log(isAdmin, isOrgAccount);
                }
            } catch (error) {
                console.error("Error al verificar permisos:", error);
            }
        };
    
        fetchData2();
    }, [user]);
    
        useEffect(() => {
        // Get the current URL
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
    }, []);


    function handleEventCarouselMove(positive = true) {
        const carousel = eventCarouselRef.current;
        if (!carousel) return; // Ensure carousel exists
        const slideWidth = carousel.firstElementChild.clientWidth;
        carousel.scrollLeft = positive ? carousel.scrollLeft + slideWidth : carousel.scrollLeft - slideWidth;
    }

    function handleTaskCarouselMove(positive = true) {
        const carousel = taskCarouselRef.current;
        if (!carousel) return; // Ensure carousel exists
        const slideWidth = carousel.firstElementChild.clientWidth;
        carousel.scrollLeft = positive ? carousel.scrollLeft + slideWidth : carousel.scrollLeft - slideWidth;
    }

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <Container fluid>
                <Row className='d-flex justify-content-center'>
                    <Col md={8} className='welcome-msg text-center'>
                        <div className='d-flex justify-content-center mt-80'>
                        <h4 className='h4-wel'>¡Bienvenido a Vaid, {user.first_name}!</h4><br></br>
                        </div>
                        <div className='d-flex justify-content-center mt-5'> 
                        <p className='p-wel'>Esperamos que tengas un gran dia de trabajo.</p>
                        </div>
                    </Col>
                </Row>

                {/* Carrusel de Eventos */}
                <Row className='event-list d-flex justify-content-center'>
                <Col md={1}>   
                        </Col>
                    <Col md={10}>
                        <h5>Eventos</h5>
                        <p>Próximos Eventos</p>
                    </Col>
                    <Col md={1}>   
                        </Col>

                    {events.length > 0 ? (
                        <>
                            <Col xs={1} className="d-flex align-items-center justify-content-center">
                                <Button
                                    variant="light"
                                    className="carousel-arrow"
                                    onClick={() => handleEventCarouselMove(false)}
                                >
                                    &#8249;
                                </Button>
                            </Col>
                            <Col xs={10}>
                                <div className="carousel-container" ref={eventCarouselRef}>
                                    {events.map((item, index) => (
                                        <Card className="carousel-slide user-card card-task" key={index} onClick={() => window.location.href = `http://localhost:3000/dashboard/${organizationId}/events/view/${item.id}`}>
                                            <Card.Body>
                                                <div className="user-cover-bg mt-30">
                                                    <Image 
                                                        src={cover1} 
                                                        alt="imagen" 
                                                        className="img-fluid img-task-list" 
                                                        width={300} 
                                                        height={50}
                                                    />
                                                </div>
                                                <div className="separator mb-3 d-flex justify-content-center mt-20">
                                                    <span className="task-name"><b>{item.name}</b></span>
                                                </div>
                                                <div>
                                                    <Form.Group>
                                                        <Row>
                                                            <Col>
                                                                <Form.Control type="date" defaultValue={item.date} readOnly/>
                                                            </Col>
                                                            <Col>
                                                                <Form.Control type="time" defaultValue={item.time} readOnly/>
                                                            </Col>
                                                        </Row>
                                                    </Form.Group>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </Col>
                            <Col xs={1} className="d-flex align-items-center justify-content-center">
                                <Button
                                    variant="light"
                                    className="carousel-arrow"
                                    onClick={() => handleEventCarouselMove(true)}
                                >
                                    &#8250;
                                </Button>
                            </Col>
                        </>
                    ) : (
                        <Col xs={12} className="no-events-message d-flex justify-content-center mb-100">
                            <div className=''>
                            <p className="p-history"><b>No hay eventos disponibles.</b></p>
                            {isAdmin || isOrgAccount ? (
                            <button className='mt-20 btn-create-sm theme-btn style-two'
                            onClick={() => window.location.href = `${window.location.origin}/dashboard/${organizationId}/events/create`}>Crear Evento</button>
                        ) : <></>}
                            </div>
                        </Col>
                    )}
                </Row>

                {/* Carrusel de Tareas */}
                <Row className='event-list my-20 d-flex justify-content-center'>
                    <Col md={1}>   
                        </Col>

                    <Col md={10}>   
                        <h5>Tareas</h5>
                        <p>Tareas Pendientes</p>
                    </Col>

                    <Col md={1}>   
                    </Col>

                    {tasks.length > 0 ? (
                        <>
                            <Col xs={1} className="d-flex align-items-center justify-content-center">
                                <Button
                                    variant="light"
                                    className="carousel-arrow"
                                    onClick={() => handleTaskCarouselMove(false)}
                                >
                                    &#8249;
                                </Button>
                            </Col>
                            <Col xs={10}>
                                <div className="carousel-container" ref={taskCarouselRef}>
                                    {tasks.map((item, index) => (
                                        <Card className="carousel-slide user-card card-task" key={index} onClick={() => window.location.href = `http://localhost:3000/dashboard/${organizationId}/events/view/${item.id}`}>
                                            <Card.Body>
                                                <div className="user-cover-bg mt-30">
                                                    <Image 
                                                        src={cover1} 
                                                        alt="imagen" 
                                                        className="img-fluid img-task-list" 
                                                        width={300} 
                                                        height={50}
                                                    />
                                                </div>
                                                <div className="separator mb-3 d-flex justify-content-center mt-20">
                                                    <span className="task-name"><b>{item.name}</b></span>
                                                </div>
                                                <div>
                                                    <Form.Group>
                                                        <Row>
                                                            <Col>
                                                                <Form.Control type="date" defaultValue={item.date} readOnly/>
                                                            </Col>
                                                            <Col>
                                                                <Form.Control type="time" defaultValue={item.time} readOnly/>
                                                            </Col>
                                                        </Row>
                                                    </Form.Group>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            </Col>
                            <Col xs={1} className="d-flex align-items-center justify-content-center">
                                <Button
                                    variant="light"
                                    className="carousel-arrow"
                                    onClick={() => handleTaskCarouselMove(true)}
                                >
                                    &#8250;
                                </Button>
                            </Col>
                        </>
                    ) : (
                        <Col xs={12} className="no-events-message d-flex justify-content-center mb-50">
                            <div className=''>
                            <p className="p-history"><b>No hay tareas disponibles.</b></p>
                            {isAdmin || isOrgAccount ? (
                            <button className='mt-20 btn-create-sm theme-btn style-two'     
                            onClick={() => window.location.href = `${window.location.origin}/dashboard/${organizationId}/tasks/create`} >Crear Tarea</button>
                            ) : <></>}
                            </div>
                        </Col>  
                    )}
                </Row>
            </Container>
        </Layout>
    );
};

export default Page;
