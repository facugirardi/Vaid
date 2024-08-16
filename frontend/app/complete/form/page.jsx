'use client'

import React, { ReactElement, useEffect, useState } from "react";
import Layout from '@/layouts/dashboard/index2';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { ProgressBar, TabContainer, Col, Form, Card, Nav, Row, Tab } from "react-bootstrap";
import './form.css';
import ava2 from "@/public/assets/images/user/avatar-2.jpg";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Page = () => {
    const { data: user, isError, isLoading } = useRetrieveUserQuery();
    const [key, setKey] = useState('tab-1');
    const [progress, setProgress] = useState(25);
    const totalTabs = 4;

    const { push } = useRouter();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        dateOfBirth: '',
        profession: '',
        experience: '',
        street: '',
        city: '',
        availableDays: [],
        availableTimes: [],
        modality: '',
        topics: '',
        goals: '',
        motivations: ''
    });

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked ? [...prevState[name], value] : prevState[name].filter(day => day !== value)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
        if (!formData.profession) newErrors.profession = "Profession is required";
        if (!formData.experience) newErrors.experience = "Experience is required";
        if (!formData.street) newErrors.street = "Street is required";
        if (!formData.city) newErrors.city = "City is required";
        if (formData.availableDays.length === 0) newErrors.availableDays = "At least one available day is required";
        if (formData.availableTimes.length === 0) newErrors.availableTimes = "At least one available time is required";
        if (!formData.modality) newErrors.modality = "Modality is required";
        if (!formData.topics) newErrors.topics = "Topics are required";
        if (!formData.goals) newErrors.goals = "Goals are required";
        if (!formData.motivations) newErrors.motivations = "Motivations are required";
        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstError = Object.values(newErrors)[0];
            toast.error(firstError);
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/user/form/${user.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save form data');
            }

            const data = await response.json();
            toast.success(data.message || 'Form data saved successfully!');
            push('/dashboard')

        } catch (error) {
            console.error('Failed to save form data', error);
            toast.error('Failed to save form data');
        }
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
                            <p className="text-muted mb-4">You need to complete your profile to continue.</p>
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
                                                    <span className="d-none d-sm-inline">Location and Availability</span>
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
                                                <div className="text-center">
                                                    <h3 className="mb-2">Who you are?</h3>
                                                    <small className="text-muted">Let us know more about your skills and background</small>
                                                </div>
                                                <div className="row mt-4">
                                                    <div className="col">
                                                        <div className="row">
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <Form.Label htmlFor="example-datemax">Date of Birth</Form.Label>
                                                                    <Form.Control type="date" id="example-datemax" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                    <label className="form-label">Profession</label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="profession"
                                                                        placeholder="Are you a professional? In what field?"
                                                                        value={formData.profession}
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="form-group">                                                            <label className="form-label">Did you have a volunteer expierience?</label>
                                                                    <select className="form-select height-checkbox">
                                                                        <option>Yes</option>
                                                                        <option>No</option>
                                                                    </select>                                                                    
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <div className="form-group">
                                                                        <label className="form-label">Tell us about your experience</label>
                                                                        <textarea
                                                                            className="form-control"
                                                                            name="experience"
                                                                            placeholder="Describe any relevant experience or skills."
                                                                            value={formData.experience}
                                                                            onChange={handleChange}
                                                                        />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="tab-2" className="tab-pane" id="jobDetail">
                                                <div className="text-center">
                                                    <h3 className="mb-2">Location and Availability</h3>
                                                    <small className="text-muted">Provide your location and when you're available to volunteer.</small>
                                                </div>
                                                <div className="row mt-4">
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Street</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="street"
                                                                placeholder="Enter Street"
                                                                value={formData.street}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label className="form-label">City</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="city"
                                                                placeholder="Enter City"
                                                                value={formData.city}
                                                                onChange={handleChange}
                                                            />
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
                                                                        name="availableDays"
                                                                        value="Mon"
                                                                        checked={formData.availableDays.includes("Mon")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh2"
                                                                        label="Tue"
                                                                        className="small-checkbox"
                                                                        name="availableDays"
                                                                        value="Tue"
                                                                        checked={formData.availableDays.includes("Tue")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh3"
                                                                        label="Wed"
                                                                        className="small-checkbox"
                                                                        name="availableDays"
                                                                        value="Wed"
                                                                        checked={formData.availableDays.includes("Wed")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh3"
                                                                        label="Thu"
                                                                        className="small-checkbox"
                                                                        name="availableDays"
                                                                        value="Thu"
                                                                        checked={formData.availableDays.includes("Thu")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh3"
                                                                        label="Fri"
                                                                        className="small-checkbox"
                                                                        name="availableDays"
                                                                        value="Fri"
                                                                        checked={formData.availableDays.includes("Fri")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh3"
                                                                        label="Sat"
                                                                        className="small-checkbox"
                                                                        name="availableDays"
                                                                        value="Sat"
                                                                        checked={formData.availableDays.includes("Sat")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh3"
                                                                        label="Sun"
                                                                        className="small-checkbox"
                                                                        name="availableDays"
                                                                        value="Sun"
                                                                        checked={formData.availableDays.includes("Sun")}
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="form-group row">
                                                            <label className="form-label">Times of the day</label>
                                                            <Col sm={10}>
                                                                <div className="label-checkbox">
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        label="Morning"
                                                                        className="small-checkbox"
                                                                        name="availableTimes"
                                                                        value="Morning"
                                                                        checked={formData.availableTimes.includes("Morning")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh2"
                                                                        label="Afternoon"
                                                                        className="small-checkbox"
                                                                        name="availableTimes"
                                                                        value="Afternoon"
                                                                        checked={formData.availableTimes.includes("Afternoon")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh3"
                                                                        label="Evening"
                                                                        className="small-checkbox"
                                                                        name="availableTimes"
                                                                        value="Evening"
                                                                        checked={formData.availableTimes.includes("Evening")}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="checkbox"
                                                                        id="customCheckinlh3"
                                                                        label="Night"
                                                                        className="small-checkbox"
                                                                        name="availableTimes"
                                                                        value="Night"
                                                                        checked={formData.availableTimes.includes("Night")}
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="tab-3" className="tab-pane" id="educationDetail">
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
                                                                        value="In-person"
                                                                        checked={formData.modality === "In-person"}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="radio"
                                                                        name="modality"
                                                                        id="customCheckinlh2"
                                                                        label="Virtual"
                                                                        className="small-checkbox"
                                                                        value="Virtual"
                                                                        checked={formData.modality === "Virtual"}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Form.Check
                                                                        inline
                                                                        type="radio"
                                                                        name="modality"
                                                                        id="customCheckinlh3"
                                                                        label="Both types"
                                                                        className="small-checkbox"
                                                                        value="Both types"
                                                                        checked={formData.modality === "Both types"}
                                                                        onChange={handleChange}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="schoolLocation">Preferred Topics</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="schoolLocation"
                                                                name="topics"
                                                                placeholder="Enter your preferred topic. Ex: abuse, environment, educational support, etc."
                                                                value={formData.topics}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab.Pane>

                                            <Tab.Pane eventKey="tab-4" className="tab-pane" id="finish">
                                                <form id="finishForm" onSubmit={handleSubmit}>
                                                    <div className="text-center">
                                                        <h3 className="mb-2">Your Goals</h3>
                                                        <small className="text-muted">Tell us about your goals and motivations for volunteering.</small>
                                                    </div>
                                                    <div className="row mt-4">
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                        <label className="form-label" htmlFor="goals">Volunteering Goals</label>
                                                            <textarea
                                                                    className="form-control"
                                                                    id="goals"
                                                                    name="goals"
                                                                    placeholder="What are your goals for volunteering?"
                                                                    value={formData.goals}
                                                                    onChange={handleChange}
                                                                />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="form-group">
                                                            <label className="form-label" htmlFor="motivations">Motivations</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    id="motivations"
                                                                    name="motivations"
                                                                    placeholder="What motivates you to volunteer?"
                                                                    value={formData.motivations}
                                                                    onChange={handleChange}
                                                                />
                                                        </div>
                                                    </div>
                                                    </div>
                                                </form>
                                            </Tab.Pane>
                                        </Tab.Content>
                                                          <div className="d-flex justify-content-center mt-30">
                                                            <div className="previous me-2">
                                                                <button
                                                                    className={`btn btn-secondary ${key === 'tab-1' ? 'disabled' : ''}`}
                                                                    onClick={handlePrevious}
                                                                    disabled={key === 'tab-1'}
                                                                >
                                                                    Back To Previous
                                                                </button>
                                                            </div>
                                                            <div className="d-flex next">
                                                                <button
                                                                    className="btn btn-secondary mt-3 mt-md-0"
                                                                    onClick={handleNext}
                                                                    disabled={key === `tab-${totalTabs}`}
                                                                >
                                                                    Next Step
                                                                </button>
                                                            </div>
                                                        </div>

                                    </div>
                                </Card>
                            </TabContainer>
                        </Col>
                    </div>
                </Col>
            </Row>
        </Layout>
    );
};

export default Page;
