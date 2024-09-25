"use client"

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './viewEvent.css';
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const Page = () => {
    const [events, setEvents] = useState([]);
    const [organizationId, setOrganizationId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOrgAccount, setIsOrgAccount] = useState(false);
    const { data: user, isError, isLoading } = useRetrieveUserQuery();

    const checkUserPermissions = async (userId) => {
        let isAdmin = false;
        let isOrgAccount = false;
    
        try {
            // Verificar si el usuario es administrador
            const adminResponse = await fetch(`http://localhost:8000/api/isAdmin/?user_id=${userId}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const adminData = await adminResponse.json();
            isAdmin = adminData;
    
            // Verificar si el usuario pertenece a una cuenta de organización
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
            console.error("Error al verificar los permisos del usuario:", error);
        }
    
        return { isAdmin, isOrgAccount };
    };
    
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
        const fetchData = async () => {
            try {
                if (user.id) {
                    const { isAdmin, isOrgAccount } = await checkUserPermissions(user.id);
                    setIsAdmin(isAdmin);
                    setIsOrgAccount(isOrgAccount);
                    console.log("isAdmin", isAdmin);
                    console.log("isOrgAccount", isOrgAccount);
                }
            } catch (error) {
                console.error("Error al verificar los permisos:", error);
            }
        };

        fetchData();
    }, [user.id]);

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
                <BreadcrumbItem mainTitle="Eventos" subTitle="Ver Eventos" />
                {isAdmin || isOrgAccount ? (
                <button className="button-add-task" onClick={() => window.location.href = `/dashboard/${organizationId}/events/create`}>
                    añadir <i className='ph-duotone ph-plus-circle plus-icon'></i>
                </button>) : <></>}
            </div>
            <Row>
                {events.length === 0 ? (
                    <div className="no-events-message">
                        {isAdmin || isOrgAccount ? (
                        <p className="p-history">No hay eventos disponibles. Comienza agregando tu primer evento usando el botón 'añadir'.</p>
                    ) : 
                    <p className="p-history">No hay eventos disponibles.</p>
                }
                    </div>
                ) : (
                    events.map((item, index) => (
                        <Col md={6} xl={4} key={index}>
                            <Card className="user-card card-task">
                                <Card.Body>
                                    <div className="user-cover-bg">
                                        <Image 
                                            src={cover1} 
                                            alt="imagen" 
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
                                    <span className='ver-mas' onClick={() => window.location.href = `http://localhost:3000/dashboard/${organizationId}/events/view/${item.id}`}>ver más</span>
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
                                            alt="imagen" 
                                            className="img-fluid img-popup-event" 
                                            width={300} 
                                            height={300}
                                        />
                                    </div>
                                    <div className="details-container col-md-7">
                                        <p className='title-modal-12'>Título</p><p class='title2-modal'>{selectedEvent.name}</p>
                                        <p className='title-modal-12'>Descripción</p><p className='title3-modal'>{selectedEvent.description}</p>
                                        <Form.Group className='form-group-all'>
                                            <div className="row">
                                                <div className='col-md-3'>
                                                    <p className='title-dates'>Fecha de inicio</p>
                                                    <Form.Control type="date" defaultValue={selectedEvent.date} readOnly/>
                                                </div>
                                                <div className="col-md-3">
                                                    <p className='title-dates'>Fecha de finalización</p>
                                                    <Form.Control type="date" defaultValue={selectedEvent.endDate} readOnly/>
                                                </div>
                                                <div className="col-md-3">
                                                    <p className='title-dates'>Hora de inicio</p>
                                                    <Form.Control type="time" defaultValue={selectedEvent.time} readOnly/>
                                                </div>
                                                <div className="col-md-3">
                                                    <p className='title-dates'>Hora de finalización</p>
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
