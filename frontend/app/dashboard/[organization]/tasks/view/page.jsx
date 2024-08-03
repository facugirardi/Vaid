'use client';

import React from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import { userCard } from "@/common/JsonData"; 
import './viewTask.css';
import { Button, Card, Col, Collapse, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";

const Page = () => {
    return (
        <Layout>
            <BreadcrumbItem mainTitle="Tasks" subTitle="View Tasks" />
            <Row>
                {
                    (userCard || []).map((item, index) => (
                        <Col md={6} xl={4} key={index}>
                            <Card className="user-card">
                                <Card.Body>
                                    <div className="user-cover-bg">
                                        <Image 
                                            src={item.bgImage} 
                                            alt="image" 
                                            className="img-fluid" 
                                            width={500} 
                                            height={200}
                                        />
                                        <div className="cover-data">
                                            <div className="d-inline-flex align-items-center">
                                                <span className="text-white"> Pending</span>
                                                <i className="chat-badge bg-danger"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="separator mb-3">
                                        <span className="task-name">Task Name</span>
                                    </div>
                                    <div>
                                        <Form.Group>
                                            <Row>
                                                <Col>
                                                    <Form.Control type="date" />
                                                </Col>
                                                <Col>
                                                    <Form.Control type="time" />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </div>
                                    <div className="saprator my-2">
                                        <span className="ver-mas">view more</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </Layout>
    );
}

export default Page;
