// page.jsx
'use client'

import React, { ReactElement, useEffect, useState } from "react";
import Layout from '@/layouts/dashboard/index2';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { ProgressBar, TabContainer, Col, Form, Card, Nav, Row, Tab } from "react-bootstrap";
import './form.css';
import ava2 from "@/public/assets/images/user/avatar-2.jpg";
import Image from "next/image";


const Page = () => {


    const { data: user, isError, isLoading } = useRetrieveUserQuery();
    const [key, setKey] = useState('tab-1');
    const [progress, setProgress] = useState(25);
    const totalTabs = 4;

    useEffect(() => {
        // Calculate progress when the component mounts
        const calculateProgress = () => {
          return ((parseInt(key.split('-')[1]) - 1) / (totalTabs - 1)) * 100;
        };
        setProgress(calculateProgress());
      }, [key, totalTabs]);

    const handleTabSelect = (k) => {
        setKey(k);
    };

    const handleNext = () => {
        const nextKey = parseInt(key.split('-')[1]) + 1;
        setKey(`tab-${nextKey}`);
    };

    const handlePrevious = () => {
        const previousKey = parseInt(key.split('-')[1]) - 1;
        setKey(`tab-${previousKey}`);
    };


    

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <Row>

                <Col sm={12}>
                    <div id="basicwizard" className="form-wizard row justify-content-center">
                        <div className="col-sm-12 col-md-6 col-xxl-4 text-center">
                            <h3>Build Your Profile</h3>
                            <p className="text-muted mb-4">"Share more about who you are, what you do, your location, your interests, and your goals."</p>
                        </div>
                        <Col xs={12}>
                            <TabContainer defaultActiveKey="tab-1" activeKey={key} onSelect={handleTabSelect}>
                                <Card>
                                    <Card.Body className="p-3">
                                        <Nav className="nav-pills nav-justified">
                                            <Nav.Item as="li" className="nav-item" data-target-form="#contactDetailForm">
                                                <Nav.Link eventKey="tab-1" href="#contactDetail" data-bs-toggle="tab" data-toggle="tab">
                                                    <i className="ph-duotone ph-user-circle"></i>
                                                    <span className="d-none d-sm-inline">About me</span>
                                                </Nav.Link>
                                            </Nav.Item>

                                            <Nav.Item data-target-form="#jobDetailForm">
                                                <Nav.Link eventKey="tab-2" href="#jobDetail" data-bs-toggle="tab" data-toggle="tab" className="nav-link icon-btn">
                                                    <i className="ph-duotone ph-map-pin"></i>
                                                    <span className="d-none d-sm-inline">Address</span>
                                                </Nav.Link>
                                            </Nav.Item>

                                            <Nav.Item className="nav-item" data-target-form="#educationDetailForm">
                                                <Nav.Link eventKey="tab-3" href="#educationDetail" data-bs-toggle="tab" data-toggle="tab" className="nav-link icon-btn">
                                                    <i className="ph-duotone ph-user"></i>
                                                    <span className="d-none d-sm-inline">Volunteer Preferences</span>
                                                </Nav.Link>
                                            </Nav.Item>

                                            <Nav.Item>
                                                <Nav.Link eventKey="tab-4" href="#finish" data-bs-toggle="tab" data-toggle="tab" className="nav-link icon-btn">
                                                    <i className="ph-duotone ph-check-circle"></i>
                                                    <span className="d-none d-sm-inline">Goals and Motivations</span>
                                                </Nav.Link>
                                            </Nav.Item>

                                        </Nav>
                                    </Card.Body>
                                </Card>
                                <Card>
                                    <div className="card-body">
                                        <Tab.Content>

                                            <ProgressBar now={progress} className="mb-3" style={{ height: '7px' }} />


                                            <Tab.Pane eventKey="tab-1" className="tab-pane" id="contactDetail">
                                                <form id="contactForm" method="post" action="#">
                                                    <div className="text-center">
                                                        <h3 className="mb-2">Who you are?</h3>
                                                        <small className="text-muted">Let us know more about your skills and background</small>
                                                    </div>
                                                    <div className="row mt-4">
                                                        <div className="col">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    <div className="form-group">
                                                                        <Form.Label>Age</Form.Label>
                                                                        <Form.Control type="number" defaultValue="30" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <div className="form-group">
                                                                        <label className="form-label">Profession</label>
                                                                        <input type="text" className="form-control" placeholder="Are you a professional? In what field?"/>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                    <div className="height-checkbox">
                                                                        <label className="form-label">Relevant Experience or Skills</label>
                                                                        <textarea className="form-control" placeholder="Describe any relevant experience or skills." />
                                                                    </div>  
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="tab-2" className="tab-pane" id="jobDetail">
                                                <form id="jobForm" method="post" action="#">
                                                    <div className="text-center">
                                                        <h3 className="mb-2">Location and Availability</h3>
                                                        <small className="text-muted">Provide your location and when you're available to volunteer.</small>
                                                    </div>
                                                    <div className="row mt-4">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Street Name</label>
                                                                <input type="text" className="form-control" placeholder="Enter Street Name" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <Form.Label>Street Number</Form.Label>
                                                                <Form.Control type="number" defaultValue="30" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">City</label>
                                                                <input type="text" className="form-control" placeholder="Enter City" />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <label className="form-label">Country</label>
                                                                <select className="form-select">
                                                                    <option>Select Country</option>
                                                                    <option>India</option>
                                                                    <option>Rusia</option>
                                                                    <option>Dubai</option>
                                                                </select>
                                                            </div>
                                                        </div>


                                                        <div className="col-sm-6">
                                                        <div className="form-group row">
                                                        <label className="form-label">Available days</label>
                                                            <Col sm={13}>
                                                                <div className="label-checkbox">
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    label="Mon"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh2"
                                                                    label="Tue"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh3"
                                                                    label="Wed"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh3"
                                                                    label="Thu"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh3"
                                                                    label="Fri"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh3"
                                                                    label="Sat"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh3"
                                                                    label="Sun"
                                                                    className="small-checkbox"
                                                                />
                                                                </div>
                                                            </Col>
                                                        </div>
                                                        </div>


                                                        <div className="col-sm-6">
                                                            <div className="form-group row">
                                                        <label className="form-label">Times of de day</label>
                                                            <Col sm={10}>
                                                                <div className="label-checkbox">
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    label="Morning"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh2"
                                                                    label="Afternoon"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh3"
                                                                    label="Evening"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="checkbox"
                                                                    id="customCheckinlh3"
                                                                    label="Night"
                                                                    className="small-checkbox"
                                                                />
                                                                </div>
                                                            </Col>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="tab-3" className="tab-pane" id="educationDetail">
                                                <form id="educationForm" method="post" action="#">
                                                    <div className="text-center">
                                                        <h3 className="mb-2">Volunteer Preferences</h3>
                                                        <small className="text-muted">Tell us about your goals and motivations for volunteering.</small>
                                                    </div>
                                                    <div className="row">
                                                        
                                                    <div className="col-sm-6">
                                                        <div className="form-group row">
                                                        <label className="form-label">Modality Preference</label>
                                                            <Col sm={13}>
                                                                <div className="label-checkbox">
                                                                <Form.Check
                                                                    inline
                                                                    type="radio"
                                                                    name="modality"
                                                                    label="In-person"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="radio"
                                                                    name="modality"
                                                                    id="customCheckinlh2"
                                                                    label="Virtual"
                                                                    className="small-checkbox"
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="radio"
                                                                    name="modality"
                                                                    id="customCheckinlh3"
                                                                    label="Both types"
                                                                    className="small-checkbox"
                                                                />
                                                                </div>
                                                            </Col>
                                                        </div>
                                                    </div>

                                                        <div className="col-md-12">
                                                            <div className="mb-3">
                                                                <label className="form-label" htmlFor="schoolLocation">Preferred Topics</label>
                                                                <input type="text" className="form-control" id="schoolLocation"
                                                                    placeholder="Enter your preferred topic. Ex: abuse, enviroment, educational support, etc." />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="tab-4" className="tab-pane" id="finish">
                                                <div className="text-center">
                                                    <h3 className="mb-2">Your Goals</h3>
                                                    <small className="text-muted">Tell us about your goals and motivations for volunteering.</small>
                                                </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3">
                                                            <div className="height-checkbox">
                                                                <label className="form-label" htmlFor="schoolLocation">Volunteering Goals</label>
                                                                <textarea  className="form-control" id="schoolLocation"
                                                                    placeholder="What are your goals for volunteering?" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="mb-3">
                                                            <div className="height-checkbox">
                                                                <label className="form-label" htmlFor="schoolLocation">Motivations</label>
                                                                <textarea className="form-control" id="schoolLocation"
                                                                    placeholder="What motivates you to volunteer?" />
                                                            </div>
                                                        </div>
                                                    </div>
                                            </Tab.Pane>


                                            <div className="d-flex wizard justify-content-between mt-3">
                                                <div className="first">
                                                    <button
                                                        className={`btn btn-secondary ${key === 'tab-1' ? 'disabled' : ''}`}
                                                        onClick={() => setKey('tab-1')}
                                                        disabled={key === 'tab-1'}
                                                    >
                                                        First
                                                    </button>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="previous me-2">
                                                        <button
                                                            className={`btn btn-secondary ${key === 'tab-1' ? 'disabled' : ''}`}
                                                            onClick={handlePrevious}
                                                            disabled={key === 'tab-1'}
                                                        >
                                                            Back To Previous
                                                        </button>
                                                    </div>
                                                    <div className="next">
                                                        <button
                                                            className="btn btn-secondary mt-3 mt-md-0"
                                                            onClick={handleNext}
                                                            disabled={key === `tab-${totalTabs}`}
                                                        >
                                                            Next Step
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="last">
                                                    <button
                                                        className={`btn btn-secondary mt-3 mt-md-0 ${key === 'tab-4' ? 'disabled' : ''}`}
                                                        onClick={() => setKey(`tab-${totalTabs}`)}
                                                    // disabled={key !== `tab-${totalTabs}`}
                                                    >
                                                        Finish
                                                    </button>
                                                </div>
                                            </div>
                                        </Tab.Content>
                                    </div>
                                </Card>
                            </TabContainer>

                        </Col>
                    </div>
                </Col>
        

            </Row >
        </Layout>
    );
};
export default Page;