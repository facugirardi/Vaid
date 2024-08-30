'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import { Card, Col, Form, Row } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";

const Page = () => {
    const [tasks, setTasks] = useState([]);
    const [organizationId, setOrganizationId] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);

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
                  const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/events`, {
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

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    return (
        <Layout>
            <div className="header">
                <BreadcrumbItem mainTitle="Taks" subTitle="View Tasks" />
            </div>
                <div className="d-flex justify-content-center mt-4">
                    <div className="container event-details-container p-4 border rounded">
                        <div className="row">
                            <div className="image-container col-12 col-md-5">
                                <Image 
                                    src={cover1} 
                                    alt="image" 
                                    className="img-popup-event" 
                                    width={480} 
                                    height={305}
                                />
                            </div>
                            <div className="details-container col-md-7">
                                <p className='title-modal-12'>Title</p>
                                <p className='title2-modal'>{selectedTask?.name || 'No title available'}</p>
                                <p className='title-modal-12'>Description</p>
                                <p className='title3-modal'>{selectedTask?.description || 'No description available'}</p>
                                <p className='title-modal-12'>Location</p>
                                <p className='title3-modal'>{selectedTask?.location || 'No location available'}</p>
                                <Form.Group className='form-group-all'>
                                    <div className="row">
                                        <div className='col-md-3'>
                                            <p className='title-dates'>Start Date</p>
                                            <Form.Control type="date"  />
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>End Date</p>
                                            <Form.Control type="date"  />
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Start Time</p>
                                            <Form.Control type="time" />
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>End Time</p>
                                            <Form.Control type="time" />
                                        </div>
                                    </div>
                                </Form.Group>

                            </div>
                        </div>
                    </div>
                </div>
                
        </Layout>
    );
};

export default Page;