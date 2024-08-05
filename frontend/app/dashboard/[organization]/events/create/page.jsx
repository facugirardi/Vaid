
"use client"

import React, { useState, useEffect } from 'react';
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import FeatherIcon from "feather-icons-react";
import './create.css';
import { ToastContainer, toast } from 'react-toastify';

const CreateTaskPage = () => {
    const { data: user, isLoading, isError } = useRetrieveUserQuery();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        endDate: '',
        time: '',
        endTime: '',
        file: null,
    });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [organizationId, setOrganizationId] = useState("");

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFormData({
                ...formData,
                file: event.target.files[0],
            });
            setPreview(URL.createObjectURL(event.target.files[0]));
        } else {
            setFormData({
                ...formData,
                file: null,
            });
            setPreview(null);
        }
    };

const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, description, date, endDate, time, endTime, file } = formData;
    const newErrors = {};

    if (!name) newErrors.name = 'Name is required';
    if (!description) newErrors.description = 'Description is required';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';
    if (!endDate) newErrors.endDate = 'End Date is required';
    if (!endTime) newErrors.endTime = 'End Time is required';

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('date', date); // Date only
    data.append('time', time);
    data.append('endTime', endTime);
    data.append('endDate', endDate); // Date only
    if (file) {
        data.append('file', file);
    }

    try {
        const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/events/`, {
            method: 'POST',
            headers: {
            },
            body: data,
        });

        const responseText = await response.text(); // Get the full response text

        try {
            const responseData = JSON.parse(responseText); // Try to parse as JSON

            if (!response.ok) {
                console.error('Error creating task:', responseData);
                setErrors(responseData);
            } else {
                toast.success('Event created successfully!')
                // Clear the form
                setFormData({
                    name: '',
                    description: '',
                    date: '',
                    time: '',
                    endTime: '',
                    endDate: '',
                    file: null,
                });
                setPreview(null);
                setErrors({});
            }
        } catch (error) {
            // If parsing as JSON fails, show the full response
            console.error('Server response is not valid JSON:', responseText);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};
    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Dashboard" subTitle="Event" />
            <Row>
                <Card>
                    <div id="sticky-action" className="sticky-action">
                        <Card.Header>
                            <Row className="align-items-center">
                                <Col sm={6}>
                                    <h4>Create Event</h4>
                                </Col>
                            </Row>
                        </Card.Header>
                    </div>

                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col md={4} className="d-flex flex-column align-items-center">
                                    <label htmlFor="upload-button" className="upload-button">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="preview-img" />
                                        ) : (
                                            <div className="icon-container">
                                                <FeatherIcon icon="upload" />
                                            </div>
                                        )}
                                        <input
                                            id="upload-button"
                                            type="file"
                                            name="file"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </Col>
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label className="form-group-label">Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Enter a title"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <small className="text-danger">{errors.name}</small>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="form-group-label">Description</Form.Label>
                                        <Form.Control
                                            className="textarea-task"
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            placeholder="Enter a description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        {errors.description && <small className="text-danger">{errors.description}</small>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label className="form-label-2">Category</Form.Label>
                                <Form.Control as="select" className="form-select" name="category" value={formData.category} onChange={handleChange}>
                                    <option>a</option>
                                    <option>b</option>
                                    <option>c</option>
                                </Form.Control>
                            </Form.Group>
                            <Row className="form-group-2">
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Start Date</Form.Label>
                                    <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
                                    {errors.date && <small className="text-danger">{errors.date}</small>}
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">End Date</Form.Label>
                                    <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                                    {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Start Time</Form.Label>
                                    <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} />
                                    {errors.time && <small className="text-danger">{errors.time}</small>}
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">End Time</Form.Label>
                                    <Form.Control type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
                                    {errors.endTime && <small className="text-danger">{errors.endTime}</small>}
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-center mt-50'>
                            <Button variant="success" type="submit" className="botontask submit-task">
                                Submit
                            </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </Layout>
    );
};

export default CreateTaskPage;
