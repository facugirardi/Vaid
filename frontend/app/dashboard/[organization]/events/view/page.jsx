'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './viewEvent.css';
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";

const Page = () => {
    const [events, setEvents] = useState([]);
    const [organizationId, setOrganizationId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
    }, []);

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
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [organizationId]);

    const handleShowModal = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    return (
        <Layout>
            <div className="header">
                <BreadcrumbItem mainTitle="Events" subTitle="View Events" />
                <button className="button-add-task" onClick={() => window.location.href = `/dashboard/${organizationId}/events/create`}>
                    add <i className='ph-duotone ph-plus-circle plus-icon'></i>
                </button>
            </div>
            <Row>
                {events.length === 0 ? (
                    <div className="no-events-message">
                        <p className="p-history">No events available. Start by adding your first event using the 'add' button.</p>
                    </div>
                ) : (
                    events.map((item, index) => (
                        <Col md={6} xl={4} key={index}>
                            <Card className="user-card card-task">
                                <Card.Body>
                                    <div className="user-cover-bg">
                                        <Image 
                                            src={cover1} 
                                            alt="image" 
                                            className="img-fluid img-task-list" 
                                            width={500} 
                                            height={200}
                                        />
                                        <div className="cover-data">
                                            <div className="d-inline-flex align-items-center">
                                                <span className="text-white"> {item.state}</span>
                                                <i className={`chat-badge ${item.state === 'Done' ? 'bg-success' : 'bg-danger'}`}></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="separator mb-3">
                                        <span className="task-name">{item.name}</span>
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
                                    <div className="saprator my-2">
                                        <span className='ver-mas' onClick={() => handleShowModal(item)}>view more</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Modal de Visualización */}
            <Modal show={showModal} onHide={handleCloseModal} centered size='xl' backdropClassName="modal-backdrop">
                <Modal.Header>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        <div className="d-flex">
                            <div className='container'>
                                <div className="row">
                                    <div className="image-container col-12 col-md-5">
                                        <Image 
                                            src={cover1} 
                                            alt="image" 
                                            className="img-fluid img-popup-event" 
                                            width={300} 
                                            height={300}
                                        />
                                    </div>
                                    <div className="details-container col-md-7">
                                        <p className='title-modal-12'>Title</p><p class='title2-modal'>{selectedEvent.name}</p>
                                        <p className='title-modal-12'>Description</p><p className='title3-modal'>{selectedEvent.description}</p>
                                        <Form.Group className='form-group-all'>
                                            <div className="row">
                                                <div className='col-md-3'>
                                                    <p className='title-dates'>Start Date</p>
                                                    <Form.Control type="date" defaultValue={selectedEvent.date} readOnly/>
                                                </div>
                                                <div className="col-md-3">
                                                    <p className='title-dates'>End Date</p>
                                                    <Form.Control type="date" defaultValue={selectedEvent.endDate} readOnly/>
                                                </div>
                                                <div className="col-md-3">
                                                    <p className='title-dates'>Start Time</p>
                                                    <Form.Control type="time" defaultValue={selectedEvent.time} readOnly/>
                                                </div>
                                                <div className="col-md-3">
                                                    <p className='title-dates'>End Time</p>
                                                    <Form.Control type="time" defaultValue={selectedEvent.endTime} readOnly/>
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Layout>
    );
}

export default Page;
