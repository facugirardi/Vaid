

"use client"

import React, { useState, useMemo, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import './members.css';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import TableContainer from '@/common/TableContainer';
import { Card, Col, Row, Modal, Button } from "react-bootstrap";
import axios from 'axios';

const Page = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [candidates, setCandidates] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
        if(organizationId){
            try {
                const response = await axios.get(`http://localhost:8000/api/organizations/${organizationId}/members`);
                console.log('Fetched candidates:', response.data);
                setCandidates(response.data);
            } catch (error) {
                console.error('Error fetching candidate details:', error);
            }
        };
        
    }
      if(organizationId){
        fetchData();
    }
    }, [organizationId]);
    
  


    const handleShowModal = (candidate) => {
        setSelectedCandidate(candidate);
        console.log(candidate)
        console.log(selectedCandidate)
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCandidate(null);
    };
const handleDelete = async () => {
    if (!selectedCandidate) return;
    try {
        await fetch(`http://localhost:8000/api/person-organization-details/${selectedCandidate.id}/${organizationId}/delete/`, {
            method: 'DELETE',
        });
        setCandidates(candidates.filter(candidate => candidate.id !== selectedCandidate.id));
        handleCloseModal();
    } catch (error) {
        console.error('Error deleting PersonOrganizationDetails:', error);
    }
};
const columns = useMemo(
    () => [
        {
            header: "Name",
            enableColumnFilter: false,
            accessorKey: "name",
            cell: (cellProps) => {
                const row = cellProps.row.original;
                return (
                    <div className="d-inline-block align-middle">
                        <div className="d-inline-block">
                            <h6 className="m-b-0">{row.first_name} {row.last_name}</h6>
                            <p className="m-b-0 text-primary">Member</p>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Available Days",
            accessorKey: "available_days",
            enableColumnFilter: false,
        },
        {
            header: "Available Times",
            accessorKey: "available_times",
            enableColumnFilter: false,
        },
        {
            header: "Country",
            accessorKey: "country",
            enableColumnFilter: false,
        },
        {
            header: "Born Date",
            accessorKey: "born_date",
            enableColumnFilter: false,
        },
        {
            header: "Category",
            enableColumnFilter: false,
            accessorKey: "status",
            cell: (cellProps) => {
                return (
                    <>
                        <div className="overlay-edit">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item m-0">
                                    <Button className="avtar avtar-s btn btn-primary" onClick={() => handleShowModal(cellProps.row.original)}>
                                        <i className="ti ti-plus f-18"></i>
                                    </Button>
                                    <Button className="avtar avtar-s btn btn-secondary" onClick={() => handleShowModal(cellProps.row.original)}>
                                        <i className="ti ti-tag f-18"></i>
                                    </Button>

                                </li>
                            </ul>
                        </div>
                    </>
                );
            },
        },
    ], []
);

return (
    <Layout>
        <BreadcrumbItem mainTitle="Human Resources" subTitle="Members List" />

        <Row>
            <Col sm={12}>
                <Card className="border-0 table-card user-profile-list">
                    <Card.Body>
                        <TableContainer
                            columns={columns}
                            data={candidates}
                            isGlobalFilter={true}
                            isBordered={false}
                            customPageSize={5}
                            tableClass="table-hover"
                            theadClass="table-light"
                            isPagination={true}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        <Modal show={showModal} onHide={handleCloseModal} centered backdropClassName="modal-backdrop">
            <Modal.Header closeButton>
                <Modal.Title>Member Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedCandidate && (
                    <div>
                        <p><strong>Name:</strong> {selectedCandidate.first_name} {selectedCandidate.last_name}</p>
                        <p><strong>Available Days:</strong> {selectedCandidate.available_days}</p>
                        <p><strong>Available Times:</strong> {selectedCandidate.available_times}</p>              
                        <p><strong>Country:</strong> {selectedCandidate.country}</p>
                        <p><strong>City:</strong> {selectedCandidate.born_date}</p>
                        <p><strong>Street:</strong> {selectedCandidate.street_name}</p>
                        <p><strong>Profession:</strong> {selectedCandidate.profession}</p>
                        <p><strong>Experience:</strong> {selectedCandidate.experience}</p>
                        <p><strong>Topics:</strong> {selectedCandidate.topics}</p>
                        <p><strong>Goals:</strong> {selectedCandidate.goals}</p>
                        <p><strong>Motivations:</strong> {selectedCandidate.motivations}</p>

            </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="button-cancel" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    </Layout>
);
};

export default Page;
