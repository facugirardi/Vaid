'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './viewEvent.css';
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";

const Page = () => {
    const [event, setEvent] = useState(null); // Cambié 'events' por 'event' porque solo buscas uno
    const [organizationId, setOrganizationId] = useState("");
    const [eventId, setEventId] = useState(""); // Nuevo estado para almacenar el ID del evento
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Obtener el organizationId y el eventId de la URL
    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        const viewIndex = pathSegments.indexOf('view');
        
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
        if (viewIndex !== -1 && pathSegments.length > viewIndex + 1) {
            setEventId(pathSegments[viewIndex + 1]); // Aquí obtienes el ID del evento
        }
    }, []);

    // Fetch del evento por su ID
    useEffect(() => {
        if (organizationId && eventId) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/events/${eventId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    setEvent(data); // Guardamos el evento específico en el estado
                } catch (error) {
                    console.error("Error fetching event:", error);
                }
            };

            fetchData();
        }
    }, [organizationId, eventId]);

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
            {event && (
                <div className="d-flex">
                    <div className='container event-cont'>
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
                                <p className='title2-modal'>Title</p><p className='title-modal-13'>{event.name}</p>
                                <p className='title3-modal'>Description</p><p className='title-modal-12'>{event.description}</p>
                                <Form.Group className='form-group-all'>
                                    <div className="row">
                                        <div className='col-md-3'>
                                            <p className='title-dates'>Start Date</p>
                                            <Form.Control type="date" defaultValue={event.date} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>End Date</p>
                                            <Form.Control type="date" defaultValue={event.endDate} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Start Time</p>
                                            <Form.Control type="time" defaultValue={event.time} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>End Time</p>
                                            <Form.Control type="time" defaultValue={event.endTime} readOnly/>
                                        </div>
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Page;
