"use client"

import React, { useState, useMemo, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import './candidates-list.css';
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
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
    }, []);

    useEffect(() => {
      if(organizationId){
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/candidate-details/${organizationId}/`);
                console.log('Fetched candidates:', response.data);
                setCandidates(response.data);
            } catch (error) {
                console.error('Error fetching candidate details:', error);
            }
        };
        fetchData();}
    }, [organizationId]);

    const handleShowModal = (candidate) => {
        setSelectedCandidate(candidate);
        console.log(candidate);
        console.log(selectedCandidate);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCandidate(null);
    };

    const handleApprove = async () => {
        if (!selectedCandidate) return;
        try {
            await axios.post(`http://localhost:8000/api/candidate/${selectedCandidate.id}/approve/`);
            setCandidates(candidates.filter(candidate => candidate.id !== selectedCandidate.id));
            handleCloseModal();
        } catch (error) {
            console.error('Error approving candidate:', error);
        }
    };

    const handleReject = async () => {
        if (!selectedCandidate) return;
        try {
            await axios.delete(`http://localhost:8000/api/candidate/${selectedCandidate.id}/reject/`);
            setCandidates(candidates.filter(candidate => candidate.id !== selectedCandidate.id));
            handleCloseModal();
        } catch (error) {
            console.error('Error rejecting candidate:', error);
        }
    };

    const columns = useMemo(
        () => [
            {
                header: "Name",
                enableColumnFilter: false,
                accessorKey: "avatar",
                cell: (cellProps) => {
                    const row = cellProps.row.original;
                    return (
                        <div className="d-inline-block align-middle">
                            <div className="d-inline-block">
                                <h6 className="m-b-0">{row.first_name} {row.last_name}</h6>
                                <p className="m-b-0 text-primary">Candidate</p>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Disponibility",
                accessorKey: "disponibility",
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
                header: "Request Date",
                accessorKey: "request_date",
                enableColumnFilter: false,
            },
            {
                header: "Interviewed",
                enableColumnFilter: false,
                accessorKey: "interviewed",
                cell: (cellProps) => {
                    return (
                        <>
                            {cellProps.getValue() === "True" ?
                                <span className="badge bg-light-success">Yes</span>
                                :
                                <span className="badge bg-light-danger">No</span>
                            }
                            <div className="overlay-edit">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item m-0">
                                        <Button className="avtar avtar-s btn btn-primary" onClick={() => handleShowModal(cellProps.row.original)}>
                                            <i className="ti ti-plus f-18"></i>
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

    const { data: user, isError, isLoading } = useRetrieveUserQuery();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Human Resources" subTitle="Candidate List" />

            <Row>
                <Col sm={12}>
                    <Card className="border-0 table-card user-profile-list">
                        <Card.Body>
                            {candidates.length === 0 ? (
                                <p className="text-center p-donation">No candidates available.</p>
                            ) : (
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
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} centered backdropClassName="modal-backdrop">
                <Modal.Header closeButton>
                    <Modal.Title>Candidate Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCandidate && (
                        <div>
                            <p><strong>Name:</strong> {selectedCandidate.first_name} {selectedCandidate.last_name}</p>
                            <p><strong>Disponibility:</strong> {selectedCandidate.disponibility}</p>
                            <p><strong>Country:</strong> {selectedCandidate.country}</p>
                            <p><strong>Born Date:</strong> {selectedCandidate.born_date}</p>
                            <p><strong>Request Date:</strong> {selectedCandidate.request_date}</p>
                            <p><strong>Form Responses:</strong></p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="button-cancel" onClick={handleReject}>
                        Reject
                    </Button>

                    <Button variant="secondary" className="button-ok" onClick={handleApprove}>
                        Approve
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
};

export default Page;
