
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/candidate-details');
                console.log('Fetched candidates:', response.data);
                setCandidates(response.data);
            } catch (error) {
                console.error('Error fetching candidate details:', error);
            }
        };
        fetchData();
    }, []);

    const handleShowModal = (candidate) => {
        setSelectedCandidate(candidate);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCandidate(null);
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
                    )
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
                header: "Age",
                accessorKey: "Age",
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
                            {
                                cellProps.getValue() === "Yes" ?
                                    <span className="badge bg-light-success">{cellProps.getValue()}</span>
                                    :
                                    <span className="badge bg-light-danger">{cellProps.getValue()}</span>
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
                    )
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
                            <TableContainer
                                columns={(columns || [])}
                                data={(candidates || [])}
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

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Candidate Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCandidate && (
                        <div>
                            <p><strong>Name:</strong> {selectedCandidate.first_name} {selectedCandidate.last_name}</p>
                            <p><strong>Disponibility:</strong> {selectedCandidate.disponibility}</p>
                            <p><strong>Country:</strong> {selectedCandidate.country}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="button-cancel" onClick={handleCloseModal}>
                        Reject
                    </Button>

                    <Button variant="secondary" className="button-ok" onClick={handleCloseModal}>
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
};

export default Page;
