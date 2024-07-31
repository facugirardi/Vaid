// page.jsx
'use client'

import React,  { ReactElement } from "react";
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { Card, Button, Form, InputGroup, Col, Row, Link} from 'react-bootstrap';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useState } from 'react';
import './create.css';




const page = () => {
    const { data: user, isLoading, isError } = useRetrieveUserQuery();

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
                                <Button variant="success" type="reset">
                                    Submit
                                </Button>
                                <Button variant="light-secondary" type="reset">
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Card.Header>
                </div>
                
                <Card.Body>

                    <h5>Form controls</h5>
                    <hr />
                    <Row>
                        <Col md={6}>
                            <Form onSubmit={(event) => event.preventDefault()}>
                                <div className="form-group">
                                    <Col md={6}>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="title"
                                        placeholder="Enter a title"
                                    />
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="description"
                                        placeholder="Enter a description"
                                    />
                                    <label className="form-label">Category</label>
                                        <select className="form-select">
                                        <option>a</option>
                                        <option>b</option>
                                        <option>c</option>
                                        </select>
                                    </Col>
                            
                                </div>

                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            </Row>
        </Layout>
    ); 
} 
export default page;