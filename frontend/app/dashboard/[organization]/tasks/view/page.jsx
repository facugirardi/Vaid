'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './viewTask.css';
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { PlusCircle } from 'phosphor-react';

const Page = () => {
    const [tasks, setTasks] = useState([]);
    const [organizationId, setOrganizationId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const { data: user, isError, isLoading } = useRetrieveUserQuery();
    const [isOrgAccount, setIsOrgAccount] = useState(false);

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

            fetchData();
        }
    }, [organizationId]);

    const handleShowModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };
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

    return (
        <Layout>
            <div className="header">
            <BreadcrumbItem mainTitle="Tareas" subTitle="Ver Tareas" />
            {isAdmin || isOrgAccount ? (
                <button className="button-add-task" onClick={() => window.location.href = `/dashboard/${organizationId}/tasks/create`}>
                    Añadir <PlusCircle className='hover-button plus-icon' size={20} weight="bold" />
                </button>) : <></>}
            </div>
            <Row>
                {tasks.length === 0 ? (
                    <div className="no-tasks-message">
                        <p className="p-history">No hay tareas disponibles. Comienza añadiendo tu primera tarea usando el botón 'añadir'.</p>
                    </div>
                ) : (
                    tasks.map((item, index) => (
                        <Col md={6} xl={4} key={index}>
                            <Card className="user-card">
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
                                                <i className={`chat-badge ${item.state === 'Hecho' ? 'bg-success' : 'bg-danger'}`}></i>
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
                                                    <Form.Control type="date" defaultValue={item.date} />
                                                </Col>
                                                <Col>
                                                    <Form.Control type="time" defaultValue={item.time} />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </div>
                                    <div className="saprator my-2">
                                        <span className='ver-mas' onClick={() => window.location.href = `http://localhost:3000/dashboard/${organizationId}/tasks/view/${item.id}`}>ver más</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} centered size='xl' backdropClassName="modal-backdrop">
                <Modal.Header />
                <Modal.Body>
                    {selectedTask && (
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
                                <p className='title-modal-12'>Título</p><p className='title2-modal'>{selectedTask.name}</p>
                                <p className='title-modal-12'>Descripción</p><p className='title3-modal'>{selectedTask.description}</p>
                                <Form.Group className='form-group-all'>
                                    <div className="row">
                                        <div className='col-md-3'>
                                          <p className='title-dates'>Fecha de inicio</p>
                                            <Form.Control type="date" defaultValue={selectedTask.date} />
                                        </div>
                                        <div className="col-md-3">
                                          <p className='title-dates'>Fecha de fin</p>
                                          <Form.Control type="date" defaultValue={selectedTask.endDate} />
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Hora de inicio</p>
                                            <Form.Control type="time" defaultValue={selectedTask.time} />
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Hora de fin</p>
                                            <Form.Control type="time" defaultValue={selectedTask.endTime} />
                                        </div>
                                    </div>
                                </Form.Group>
                                    </div>
                                    </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <button className="button-take">
                        Tomar
                    </button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
}

export default Page;
