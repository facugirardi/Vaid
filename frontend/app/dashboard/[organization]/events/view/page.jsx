'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './viewEvent.css';
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";

const Page = () => {
    const [tasks, setTasks] = useState([]);
    const [organizationId, setOrganizationId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        // Get the current URL
        const currentUrl = window.location.href;
        // Use URL constructor to parse the URL
        const url = new URL(currentUrl);
        // Split the pathname into segments
        const pathSegments = url.pathname.split('/');
        // Find the segment after 'dashboard'
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

    const handleArrowClick = () => {
        // Lógica para lo que deseas que haga el botón de flecha
        console.log('Arrow button clicked');
    };

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Events" subTitle="View Events" />
            <Row>
                {
                    (tasks || []).map((item, index) => (
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
                }
            </Row>

            {/* Modal Component */}
            <Modal show={showModal} onHide={handleCloseModal} centered size='xl' backdropClassName="modal-backdrop">
                <Modal.Header >
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
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
                            <div>
                          <div className='d-flex justify-content-center'>
                           <button className="button-take">
                              Join
                          </button>
                          <button className="button-close" onClick={handleCloseModal}>
                            Close
                          </button>
                          </div>
                          </div>
                            </div>
                            <div className="details-container col-md-7">
                                <p className='title-modal-12'>Title</p><p className='title2-modal'>{selectedTask.name}</p>
                                <p className='title-modal-12'>Description</p><p className='title3-modal'>{selectedTask.description}</p>
                                <Form.Group className='form-group-all'>
                                    <div className="row">
                                        <div className='col-md-3'>
                                          <p className='title-dates'>Start Date</p>
                                            <Form.Control type="date" defaultValue={selectedTask.date} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                          <p className='title-dates'>End Date</p>
                                          <Form.Control type="date" defaultValue={selectedTask.endDate} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Start Time</p>
                                            <Form.Control type="time" defaultValue={selectedTask.time} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>End Time</p>
                                            <Form.Control type="time" defaultValue={selectedTask.endTime} readOnly/>
                                        </div>
                                        <div className="d-flex justify-content-end align-items-center w-100">
                                            <button className="arrow-button ms-2">
                                            →
                                            </button>
                                        </div>
                                    </div>
                                    
                                </Form.Group>
                                    <p className='<title-modal-12'>Attendance</p><p className='title3-modal'>No attendance found!</p>
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
