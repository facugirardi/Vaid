'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Importamos componentes de Bootstrap
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './home.css';

const Page = () => {
    const [organizationId, setOrganizationId] = useState("");
    const eventCarouselRef = useRef(null); // Reference for the event carousel
    const taskCarouselRef = useRef(null); // Reference for the task carousel

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

    const { data: user, isError, isLoading } = useRetrieveUserQuery();

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
                    </Col>
                </Row>

                {/* Carrusel de Eventos */}
                <Row className='event-list'>
                    <Col xs={12}>
                        <h5>Eventos</h5>
                        <p>Próximos Eventos</p>
                    </Col>
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
                            <div className="carousel-slide">1</div>
                            <div className="carousel-slide">2</div>
                            <div className="carousel-slide">3</div>
                            <div className="carousel-slide">4</div>
                            <div className="carousel-slide">5</div>
                            <div className="carousel-slide">6</div>
                            <div className="carousel-slide">7</div>
                            <div className="carousel-slide">8</div>
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
                </Row>

                {/* Carrusel de Tareas */}
                <Row className='event-list my-5'>
                    <Col xs={12}>
                        <h5>Tareas</h5>
                        <p>Tareas Pendientes</p>
                    </Col>
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
                            <div className="carousel-slide">1</div>
                            <div className="carousel-slide">2</div>
                            <div className="carousel-slide">3</div>
                            <div className="carousel-slide">4</div>
                            <div className="carousel-slide">5</div>
                            <div className="carousel-slide">6</div>
                            <div className="carousel-slide">7</div>
                            <div className="carousel-slide">8</div>
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
                </Row>
            </Container>
        </Layout>
    );
};

export default Page;
