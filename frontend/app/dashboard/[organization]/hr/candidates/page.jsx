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
                console.error('Error al obtener detalles de los candidatos:', error);
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
            console.error('Error al aprobar candidato:', error);
        }
    };

    const handleReject = async () => {
        if (!selectedCandidate) return;
        try {
            await axios.delete(`http://localhost:8000/api/candidate/${selectedCandidate.id}/reject/`);
            setCandidates(candidates.filter(candidate => candidate.id !== selectedCandidate.id));
            handleCloseModal();
        } catch (error) {
            console.error('Error al rechazar candidato:', error);
        }
    };

    const columns = useMemo(
        () => [
            {
                header: "Nombre",
                enableColumnFilter: false,
                accessorKey: "avatar",
                cell: (cellProps) => {
                    const row = cellProps.row.original;
                    return (
                        <div className="d-inline-block align-middle">
                            <div className="d-inline-block">
                                <h6 className="m-b-0">{row.first_name} {row.last_name}</h6>
                                <p className="m-b-0 text-primary">Candidato</p>
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "Disponibilidad",
                accessorKey: "disponibility",
                enableColumnFilter: false,
                cell: (cellProps) => {
                    const dayMap = {
                        'Mon': 'Lunes',
                        'Tue': 'Martes',
                        'Wed': 'Miércoles',
                        'Thu': 'Jueves',
                        'Fri': 'Viernes',
                        'Sat': 'Sábado',
                        'Sun': 'Domingo',
                    };
            
                    let disponibility = cellProps.getValue();
            
                    if (typeof disponibility === 'string' && disponibility.startsWith('[') && disponibility.endsWith(']')) {
                        try {
                            disponibility = disponibility
                                .slice(1, -1)
                                .replace(/'/g, '')
                                .split(',')
                                .map(day => day.trim());
                        } catch (error) {
                            console.error('Error al procesar la disponibilidad:', error);
                            disponibility = [];
                        }
                    }
            
                    if (Array.isArray(disponibility)) {
                        const fullDays = disponibility.map(day => dayMap[day] || day);
                        return <span>{fullDays.join(', ')}</span>;
                    }
            
                    return <span>No hay datos de disponibilidad</span>;
                }
            },            
            {
                header: "País",
                accessorKey: "country",
                enableColumnFilter: false,
            },
            {
                header: "Nacimiento",
                accessorKey: "born_date",
                enableColumnFilter: false,
            },
            {
                header: "Fecha de Solicitud",
                accessorKey: "request_date",
                enableColumnFilter: false,
            },
            {
                header: "Entrevistado",
                enableColumnFilter: false,
                accessorKey: "interviewed",
                cell: (cellProps) => {
                    return (
                        <>
                            {cellProps.getValue() === "True" ?
                                <span className="badge bg-light-success">Sí</span>
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

    if (isLoading) return <p>Cargando...</p>;
    if (isError || !user) return <p>¡Error al cargar los datos del usuario!</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Recursos Humanos" subTitle="Lista de Candidatos" />

            <Row>
                <Col sm={12}>
                    <Card className="border-0 table-card user-profile-list">
                        <Card.Body>
                            {candidates.length === 0 ? (
                                <p className="text-center p-donation">No hay candidatos disponibles.</p>
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
                    <Modal.Title>Información del Candidato</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCandidate && (
                        <div>
                            <p><strong>Nombre:</strong> {selectedCandidate.first_name} {selectedCandidate.last_name}</p>
                            <p><strong>País:</strong> {selectedCandidate.country}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {selectedCandidate.born_date}</p>
                            <p><strong>Fecha de Solicitud:</strong> {selectedCandidate.request_date}</p>
                            <p><strong>Calle:</strong> {selectedCandidate.street_name} {selectedCandidate.street_number}</p>
                            <p><strong>Ciudad:</strong> {selectedCandidate.city}</p>
                            <p><strong>Profesión:</strong> {selectedCandidate.profession}</p>
                            <p><strong>Experiencia:</strong> {selectedCandidate.experience}</p>
                            <p><strong>Modalidad:</strong> {selectedCandidate.modality}</p>
                            <p><strong>Temas de interés:</strong> {selectedCandidate.topics}</p>
                            <p><strong>Objetivos:</strong> {selectedCandidate.goals}</p>
                            <p><strong>Motivaciones:</strong> {selectedCandidate.motivations}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="button-cancel" onClick={handleReject}>
                        Rechazar
                    </Button>

                    <Button variant="secondary" className="button-ok" onClick={handleApprove}>
                        Aprobar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
};

export default Page;
