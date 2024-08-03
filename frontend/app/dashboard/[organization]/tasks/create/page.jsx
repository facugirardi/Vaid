// page.jsx
'use client'

import React, { ReactElement, useState } from "react";
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import FeatherIcon from "feather-icons-react";
import './create.css';

const page = () => {
    const { data: user, isLoading, isError } = useRetrieveUserQuery();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const onFileChange = event => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setPreview(URL.createObjectURL(event.target.files[0]));
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Dashboard" subTitle="Task" />
            <Row>
                <Card>
                    <div id="sticky-action" className="sticky-action">
                        <Card.Header>
                            <Row className="align-items-center">
                                <Col sm={6}>
                                    <h4>Create Task</h4>
                                </Col>
                                <Col sm={6} className="text-sm-end mt-3 mt-sm-0">
                                    <Button variant="success" type="reset" className="botontask">
                                        Submit
                                    </Button>
                                    <Button variant="light-secondary" type="reset" className="botontask">
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Header>
                    </div>
                    
                    <Card.Body>
                        <Form onSubmit={(event) => event.preventDefault()}>
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
                                        <input id="upload-button" type="file" onChange={onFileChange} style={{ display: 'none' }} />
                                    </label>
                                </Col>
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label className="form-group-label">Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter a title"
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="form-group-label">Description</Form.Label>
                                        <Form.Control
                                            className="textarea-task"
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter a description"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label className="form-label-2">Category</Form.Label>
                                <Form.Control as="select" className="form-select">
                                    <option>a</option>
                                    <option>b</option>
                                    <option>c</option>
                                </Form.Control>
                            </Form.Group>
                            <Row className="form-group-2">
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Start Date</Form.Label>
                                    <Form.Control type="date" />
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">End Date</Form.Label>
                                    <Form.Control type="date" />
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Start Time</Form.Label>
                                    <Form.Control type="time" />
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">End Time</Form.Label>
                                    <Form.Control type="time" />
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </Layout>
    ); 
} 

export default page;
