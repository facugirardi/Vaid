"use client"

import React, { useState, useMemo, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import './members.css';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import TableContainer from '@/common/TableContainer';
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';

const Page = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showTagModalAssign, setShowTagModalAssign] = useState(false); // Nuevo estado para TagModalAssign
    const [organizationId, setOrganizationId] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    const handleShowInviteModal = () => setShowInviteModal(true);
    const handleCloseInviteModal = () => setShowInviteModal(false);

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
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/organizations/${organizationId}/tags/`);
                const options = response.data.map(tag => ({ value: tag.id, label: tag.name }));
                console.log("Fetched Tags:", options);  // Debug: log fetched tags
                setAllTags(options);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
    
        fetchTags();
    }, [organizationId]);
    

    const handleTagChange = (selectedOptions) => {
        setSelectedTags(selectedOptions || []);
    };
    
    const filteredCandidates = useMemo(() => {
        if (selectedTags.length === 0) return candidates;
        return candidates.filter(candidate =>
            candidate.tags && Array.isArray(candidate.tags) && candidate.tags.some(tag => 
                selectedTags.map(t => t.value).includes(tag.id))
        );
    }, [candidates, selectedTags]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (organizationId) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/organizations/${organizationId}/members`);
                    console.log('Candidatos obtenidos:', response.data);
                    setCandidates(response.data);
                } catch (error) {
                    toast.error('Error al obtener los detalles de los candidatos:', error);
                }
            }
        };

        if (organizationId) {
            fetchData();
        }
    }, [organizationId]);

    const handleCloseTagModal = () => {
        setShowTagModal(false);
    };

    const handleCloseTagModalAssign = () => { // Función para cerrar TagModalAssign
        setShowTagModalAssign(false);
    };

    const handleSearch = (keyword) => {
        console.log('Palabra clave de búsqueda:', keyword);
    };

    const handleShowModal = (candidate) => {
        setSelectedCandidate(candidate);
        setShowModal(true);
    };

    const handleShowTagModal = (candidate) => {
        setSelectedCandidate(candidate);
        setShowTagModal(true);
    };

    const handleShowTagModalAssign = (candidate) => { // Función para mostrar TagModalAssign
        setSelectedCandidate(candidate);
        setShowTagModalAssign(true);
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
            toast.error('Error al eliminar:', error);
        }
    };

    const columns = useMemo(() => {
        if (isMobile) {
            // Columnas para dispositivos móviles
            return [
                {
                    header: "Nombre",
                    accessorKey: "name",
                    cell: (cellProps) => {
                        const row = cellProps.row.original;
                        return (
                            <div className="d-inline-block align-middle">
                                <h6 className="m-b-0">{row.first_name} {row.last_name}</h6>
                            </div>
                        );
                    },
                },
                {
                    header: "Acciones",
                    accessorKey: "actions",
                    cell: (cellProps) => {
                        const [menuOpen, setMenuOpen] = useState(false);
        
                        const toggleMenu = () => {
                            setMenuOpen(!menuOpen);
                        };
        
                        const handleOptionClick = (action) => {
                            setMenuOpen(false); // Cierra el menú
                            const candidate = cellProps.row.original;
        
                            switch (action) {
                                case 'eliminar':
                                    handleDelete(candidate);
                                    break;
                                case 'etiquetas':
                                    handleShowTagModalAssign(candidate);
                                    break;
                                case 'ver':
                                    handleShowModal(candidate);
                                    break;
                                case 'cerrar':
                                    setMenuOpen(false); // Cierra el menú al seleccionar "Cerrar menú"
                                    break;
                                default:
                                    break;
                            }
                        };
        
                        return (
                            <div className="btn-action-menu" style={{ position: 'relative' }}>
                                <button className="btn btn-light" onClick={toggleMenu}>
                                    ...
                                </button>
                                {menuOpen && (
                                    <div className="action-menu open" style={{ position: 'absolute', right: '0', background: '#fff', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', zIndex: 10, borderRadius: '8px', padding: '10px' }}>
                                        <button onClick={() => handleOptionClick('etiquetas')}>Etiquetas</button>
                                        <button onClick={() => handleOptionClick('ver')}>Ver Miembro</button>
                                        <button style={{ color: 'red' }} onClick={() => handleOptionClick('eliminar')}>Eliminar</button>
                                    </div>
                                )}
                            </div>
                        );
                    },
                },
            ];
        }
        

        // Columnas para escritorio
        return [
            {
                header: "Nombre",
                enableColumnFilter: false,
                accessorKey: "name",
                cell: (cellProps) => {
                    const row = cellProps.row.original;
                    return (
                        <div className="d-inline-block align-middle">
                            <h6 className="m-b-0">{row.first_name} {row.last_name}</h6>
                            <p className="m-b-0 text-primary">Miembro</p>
                        </div>
                    );
                },
            },
            {
                header: "Días Disponibles",
                accessorKey: "available_days",
                enableColumnFilter: false,
                cell: (cellProps) => {
                    const dayMap = {
                        'Lun': 'Lunes',
                        'Mar': 'Martes',
                        'Mie': 'Miércoles',
                        'Jue': 'Jueves',
                        'Vie': 'Viernes',
                        'Sab': 'Sábado',
                        'Dom': 'Domingo',
                    };

                    let availableDays = cellProps.getValue();

                    if (typeof availableDays === 'string' && availableDays.startsWith('[') && availableDays.endsWith(']')) {
                        try {
                            availableDays = availableDays
                                .slice(1, -1)
                                .replace(/'/g, '')
                                .split(',')
                                .map(day => day.trim());
                        } catch (error) {
                            console.error('Error al procesar los días disponibles:', error);
                            availableDays = [];
                        }
                    }

                    if (Array.isArray(availableDays)) {
                        const fullDays = availableDays.map(day => dayMap[day] || day);
                        return <span>{fullDays.join(', ')}</span>;
                    }

                    return <span>No hay datos de disponibilidad</span>;
                },
            },
            {
                header: "Horas Disponibles",
                accessorKey: "available_times",
                enableColumnFilter: false,
                cell: (cellProps) => {
                    let availableTimes = cellProps.getValue();

                    if (typeof availableTimes === 'string' && availableTimes.startsWith('[') && availableTimes.endsWith(']')) {
                        try {
                            availableTimes = availableTimes
                                .slice(1, -1)
                                .replace(/'/g, '')
                                .split(',')
                                .map(time => time.trim());
                        } catch (error) {
                            console.error('Error al procesar las horas disponibles:', error);
                            availableTimes = [];
                        }
                    }

                    if (Array.isArray(availableTimes)) {
                        return <span>{availableTimes.join(', ')}</span>;
                    }

                    return <span>No hay datos de horas disponibles</span>;
                },
            },
            {
                header: "Nacimiento",
                accessorKey: "born_date",
                enableColumnFilter: false,
            },
            {
                header: "País",
                accessorKey: "country",
                enableColumnFilter: false,
            },
            {
                header: "Etiquetas Usuario",
                accessorKey: "status",
                enableColumnFilter: false,
                cell: (cellProps) => {
                    return (
                        <div className="overlay-edit-3">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item m-0">
                                    <Button className="btn-action btn-action2 avtar avtar-s btn btn-secondary" onClick={() => handleShowTagModalAssign(cellProps.row.original)}>
                                        <i className="ph-duotone ph-tag f-18 icon-action"></i>
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    );
                },
            },
            {
                header: "Información",
                enableColumnFilter: false,
                accessorKey: "status",
                cell: (cellProps) => {
                    return (
                        <div className="overlay-edit-3">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item m-0">
                                    <Button className="btn-action avtar avtar-s btn btn-primary" onClick={() => handleShowModal(cellProps.row.original)}>
                                        <i className="ph-duotone ph-info f-18 icon-action"></i>
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    );
                },
            },
        ];
    }, [isMobile]);

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Recursos Humanos" subTitle="Lista de Miembros" />

            <Row>
                <Col sm={12}>
                    <Card className="border-0 table-card user-profile-list">
                        <Card.Body>
                            <div className="container">
                                <div className="row">
                                <button className="col-md-2 btn-tags-create theme-btn style-two" onClick={() => handleShowInviteModal()}>Invitar<span>
                                    <i className="ph-duotone ph-user"></i> 
                                        </span></button>
                                    <button className="col-md-2 btn-tags-create theme-btn style-one" onClick={() => handleShowTagModal()}>Etiquetas <span>
                                    <i className="ph-duotone ph-tag"></i> 
                                        </span></button>
                                </div>
                                <div className="row">
                                <div className="col-md-5"></div>
                                    <Col md={3}>
                                    {candidates.length === 0 ? (
                            <></>
                                ) : (
                                        <Select
                                            isMulti
                                            name="tags"
                                            options={allTags}
                                            className="basic-multi-select bms bap"
                                            classNamePrefix="select"
                                            placeholder="Filtrar por etiquetas"
                                            onChange={handleTagChange}
                                            value={selectedTags}
                                        />
                                )}
                                    </Col>
                                </div>

                            </div>
                        {candidates.length === 0 ? (
                            <div className="text-center mt-4">
                                <p className='p-history'>No hay miembros disponibles.</p>
                            </div>
                        ) : (
                            <TableContainer
                                columns={columns}
                                data={filteredCandidates}
                                isGlobalFilter={true}
                                isBordered={false}
                                customPageSize={10}
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
                    <Modal.Title>Información del Miembro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCandidate && (
                        <div>
                            <p><strong>Nombre:</strong> {selectedCandidate.first_name} {selectedCandidate.last_name}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {selectedCandidate.born_date}</p>
                            <p><strong>País:</strong> {selectedCandidate.country}</p>
                            <p><strong>Ciudad:</strong> {selectedCandidate.city}</p>
                            <p><strong>Calle:</strong> {selectedCandidate.street_name}</p>
                            <p><strong>Profesión:</strong> {selectedCandidate.profession}</p>
                            <p><strong>Experiencia:</strong> {selectedCandidate.experience}</p>
                            <p><strong>Disponibilidad:</strong> {selectedCandidate.available_days} / {selectedCandidate.available_times}</p>

                            <p>
                                <strong>Temas:</strong> {
                                    selectedCandidate.topics
                                        ? (() => {
                                            try {
                                                // Intenta convertir la cadena a un array
                                                const topicsArray = JSON.parse(selectedCandidate.topics.replace(/'/g, '"'));
                                                // Une los elementos con una coma y espacio
                                                return Array.isArray(topicsArray) ? topicsArray.join(', ') : selectedCandidate.topics;
                                            } catch (error) {
                                                console.error('Error al parsear los temas:', error);
                                                // Si hay un error al parsear, devuelve la cadena original sin cambios
                                                return selectedCandidate.topics;
                                            }
                                        })()
                                        : "No hay temas"
                                }
                            </p>
                            <p><strong>Objetivos:</strong> {selectedCandidate.goals}</p>
                            <p><strong>Motivaciones:</strong> {selectedCandidate.motivations}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="button-cancel" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
            

            {/* Renderizar TagModal */}
            <TagModal show={showTagModal} handleClose={handleCloseTagModal} organizationId={organizationId} handleSearch={handleSearch} selectedCandidate={selectedCandidate} />

            {/* Renderizar TagModalAssign */}
            <TagModalAssign show={showTagModalAssign} handleClose={handleCloseTagModalAssign} organizationId={organizationId} handleSearch={handleSearch} selectedCandidate={selectedCandidate} />

            <InviteUserModal
                show={showInviteModal}
                handleClose={handleCloseInviteModal}
                organizationId={organizationId}
            />
        </Layout>
    );
};

const InviteUserModal = ({ show, handleClose, organizationId }) => {
    const [inviteEmail, setInviteEmail] = useState("");

    const handleInviteUser = async (e) => {
        e.preventDefault();  // Previene el comportamiento por defecto del formulario

        if (!inviteEmail) return;

        try {
            await axios.post(`http://localhost:8000/api/send-email-plat/`, {
                email: inviteEmail,
                org_id: organizationId
            });
            toast.success('¡Invitación enviada con éxito!');
            setInviteEmail("");
            handleClose();
        } catch (error) {
            toast.error('Error al enviar la invitación');
      
        }
    };

    return (
         <Modal show={show} onHide={handleClose} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Invitar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleInviteUser}>
                    <div className="container">
                        <div className='row justify-content-between'>

                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-7 mt-user-email">
                                <h6>Dirección de Email</h6>
                            </div>
                            <div className='d-grid col-md-4'></div>
                        </div>
 
                        <div className="row mb-4 justify-content-between">
                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-7 mt-btn">
                                <input
                                  
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese la dirección de email del usuario"
                                    value={inviteEmail}
                                    required
                                    onChange={(e) => setInviteEmail(e.target.value)}
 
                                />
                            </div>
                            <div className="d-grid col-md-3 mt-btn">
                                <button
                                    className="btn btn-primary w-100"
                                    type="button"
                                    onClick={handleInviteUser} 
                                >
                                    Invitar
                                </button>
                            </div>
                            <div className="d-grid col-md-1"></div>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const TagModal = ({ show, handleClose, handleSearch, organizationId, selectedCandidate }) => {
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewTagModal, setShowNewTagModal] = useState(false);
    const [tagName, setTagName] = useState("");
    const [isInline, setIsInline] = useState(false);
    const [showEditTagModal, setShowEditTagModal] = useState(false);
    const [tagToEdit, setTagToEdit] = useState(null);
    
    // Verificar que la función esté definida correctamente y antes de ser usada en el JSX
    const handleShowEditTagModal = (tag) => {
        setTagToEdit(tag);
        setShowEditTagModal(true);
    };

    useEffect(() => {
        const fetchTags = async () => {
            if (show && organizationId) { // Hace fetch solo cuando el modal se muestra y hay una organización seleccionada
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8000/api/organizations/${organizationId}/tags/`);
                    setTags(response.data);
                    setFilteredTags(response.data);
                } catch (error) {
                    toast.error('Error al obtener etiquetas:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTags();
    }, [show, organizationId]); // Ejecutar cuando `show` o `organizationId` cambian

    const handleTagSearch = (keyword) => {
        const filtered = tags.filter(tag => tag.name.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredTags(filtered);
    };

    const handleDeleteTag = async (tagId) => {
        try {
            await axios.delete(`http://localhost:8000/api/organizations/${organizationId}/tags/${tagId}/`);
            const updatedTags = tags.filter(tag => tag.id !== tagId);
            setTags(updatedTags);
            setFilteredTags(updatedTags);
            toast.success('¡Etiqueta eliminada con éxito!')
        } catch (error) {
            toast.error('Error al eliminar etiqueta:', error);
        }
    };

    const handleShowNewTagModal = () => {
        setShowNewTagModal(true);
    };

    const handleCloseNewTagModal = () => {
        setShowNewTagModal(false);
        setTagName("");
        setIsInline(false);
    };

    const handleTagSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTag = { name: tagName, isAdmin: isInline };
            const response = await axios.post(`http://localhost:8000/api/organizations/${organizationId}/tags/`, newTag);
            setTags([...tags, response.data]);
            setFilteredTags([...filteredTags, response.data]);
            handleCloseNewTagModal();
        } catch (error) {
            toast.error('Error al crear la etiqueta:', error);
        }
    };

    const handleAssignTag = async (tagId) => {
        if (!selectedCandidate) return;

        try {
            await axios.post(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/`, {
                tags: [tagId]
            });
            toast.success('¡Etiqueta asignada con éxito!')
            handleClose();  // Cierra el modal después de asignar la etiqueta
        } catch (error) {
            toast.error('Error al asignar la etiqueta al miembro:', error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ver Etiquetas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row mb-4 justify-content-between">
                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-7 mt-btn">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar una palabra clave"
                                    onChange={(event) => handleTagSearch(event.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-grid col-md-3 mt-btn">
                                <button
                                    className="btn btn-primary w-100"
                                    type="button"
                                    onClick={handleShowNewTagModal}
                                    disabled={loading}
                                >
                                    Nueva Etiqueta
                                </button>
                            </div>
                            <div className="d-grid col-md-1"></div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        {loading ? (
                            <p className="text-center">Cargando etiquetas...</p>
                        ) : filteredTags.length === 0 ? (
                            <p className="text-center">No hay etiquetas disponibles.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Etiquetas</th>
                                        <th className="text-center">Tipo</th>
                                        <th className="text-center">Miembros</th>
                                        <th className="text-center">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTags.map((tag) => (
                                        <tr key={tag.id} className='tr-tags'>
                                            <td className="text-center">{tag.name}</td>
                                            <td className="text-center">{tag.isAdmin ? 'Administrador' : 'Miembro'}</td>
                                            <td className="text-center"><i className="ti ti-user"></i> {tag.member_count}</td>
                                            <td className="text-center">
                                                <button className="icon-button btn btn-light btn-sm mx-1" onClick={() => handleShowEditTagModal(tag)}>
                                                    <i className="ti ti-pencil"></i>
                                                </button>
                                                <button className="icon-button btn btn-light btn-sm mx-1" onClick={() => handleDeleteTag(tag.id)}>
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showNewTagModal} onHide={handleCloseNewTagModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='title-tag-cnt'>Crear Etiqueta</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleTagSubmit} className="tag-form">
                        <Form.Group controlId="formTagName" className="me-3 flex-grow-1 d-flex align-items-center">
                            <div className="container cont-ctall">
                                <div className="row">
                                    <div className="col-7 col-md-9">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre de la etiqueta"
                                            value={tagName}
                                            onChange={(e) => setTagName(e.target.value)}
                                            required
                                            className="me-3" // Ajuste para el margen entre el campo de texto y el switch
                                        />
                                    </div>
                                    <div className="col-1 col-md-1 icon-switch">
                                        <i className="ph-duotone ph-user icon-admin"></i>
                                    </div>
                                    <div className="col-1 col-md-1 icon-switch">
                                        <div className="">
                                            <Form.Check
                                                className="form-switch custom-switch-v1 form-check-inline"
                                                type="checkbox"
                                            >
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="input-primary"
                                                    id="customCheckinl2"
                                                    checked={isInline}
                                                    onChange={(e) => setIsInline(e.target.checked)}
                                                />
                                                <Form.Check.Label htmlFor="customCheckinl2"></Form.Check.Label>
                                            </Form.Check>
                                        </div>
                                    </div>
                                    <div className="col-1 col-md-1 icon-switch">
                                        <i className="ph-duotone ph-user-gear icon-admin"></i>
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                        <div className="box-create-btn container">
                            <div className="row row-text-admin">
                                <span className='col-1 col-md-1 icon-span-adm'><i className="ph-duotone ph-user-gear icon-admin"></i></span>
                                <p className='col-3 col-md-5 p-adm1'>Esto es administrador</p>
                                <span className='col-1 col-md-1 icon-span-adm p-adm2'><i className="ph-duotone ph-user icon-admin"></i></span>
                                <p className='col-3 col-md-5'>Esto es un miembro</p>
                            </div>
                            <div className="row">
                                <div className="col-2 col-md-4">
                                </div>
                                <div className="col-6 d-flex justify-content-center col-md-4">
                                    <Button variant="primary" type="submit" className="create-tag-btn">
                                        Crear Etiqueta
                                    </Button>
                                </div>

                                <div className="col-2 col-md-4">
                                </div>

                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <EditTagModal 
                show={showEditTagModal} 
                handleClose={() => setShowEditTagModal(false)} 
                organizationId={organizationId} 
                tagToEdit={tagToEdit}
            />

        </>
    );
};

const EditTagModal = ({ show, handleClose, organizationId, tagToEdit }) => {
    const [tagName, setTagName] = useState("");
    const [isInline, setIsInline] = useState(false);

    useEffect(() => {
        if (tagToEdit) {
            setTagName(tagToEdit.name);
            setIsInline(tagToEdit.isAdmin);
        }
    }, [tagToEdit]);

    const handleTagEdit = async (e) => {
        e.preventDefault();
        try {
            const tagData = { name: tagName, isAdmin: isInline };
            await axios.put(`http://localhost:8000/api/organizations/${organizationId}/tags/${tagToEdit.id}/`, tagData);
            toast.success('¡Etiqueta actualizada con éxito!');
            handleClose(); // Cierra el modal después de editar
        } catch (error) {
            toast.error('Error al actualizar la etiqueta:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Etiqueta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form onSubmit={handleTagEdit} className="tag-form">
                        <Form.Group controlId="formTagName" className="me-3 flex-grow-1 d-flex align-items-center">
                            <div className="container cont-ctall">
                                <div className="row">
                                    <div className="col-7 col-md-9">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nombre de la etiqueta"
                                            value={tagName}
                                            onChange={(e) => setTagName(e.target.value)}
                                            required
                                            className="me-3" // Ajuste para el margen entre el campo de texto y el switch
                                        />
                                    </div>
                                    <div className="col-1 col-md-1 icon-switch">
                                        <i className="ph-duotone ph-user icon-admin"></i>
                                    </div>
                                    <div className="col-1 col-md-1 icon-switch">
                                        <div className="">
                                            <Form.Check
                                                className="form-switch custom-switch-v1 form-check-inline"
                                                type="checkbox"
                                            >
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="input-primary"
                                                    id="customCheckinl2"
                                                    checked={isInline}
                                                    onChange={(e) => setIsInline(e.target.checked)}
                                                />
                                                <Form.Check.Label htmlFor="customCheckinl2"></Form.Check.Label>
                                            </Form.Check>
                                        </div>
                                    </div>
                                    <div className="col-1 col-md-1 icon-switch">
                                        <i className="ph-duotone ph-user-gear icon-admin"></i>
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                        <div className="box-create-btn container">
                            <div className="row row-text-admin">
                                <span className='col-1 col-md-1 icon-span-adm'><i className="ph-duotone ph-user-gear icon-admin"></i></span>
                                <p className='col-3 col-md-5 p-adm1'>Esto es administrador</p>
                                <span className='col-1 col-md-1 icon-span-adm p-adm2'><i className="ph-duotone ph-user icon-admin"></i></span>
                                <p className='col-3 col-md-5'>Esto es un miembro</p>
                            </div>
                            <div className="row">
                                <div className="col-2 col-md-4">
                                </div>
                                <div className="col-6 d-flex justify-content-center col-md-4">
                                    <Button variant="primary" type="submit" className="create-tag-btn">
                                        Guardar
                                    </Button>
                                </div>

                                <div className="col-2 col-md-4">
                                </div>

                            </div>
                        </div>
                    </Form>


            </Modal.Body>
        </Modal>
    );
};

const TagModalAssign = ({ show, handleClose, handleSearch, organizationId, selectedCandidate }) => {
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [tagsNot, setTagsNot] = useState([]);
    const [filteredTagsNot, setFilteredTagsNot] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            if (show && selectedCandidate) {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/`);
                    setTags(response.data);
                    setFilteredTags(response.data);
                } catch (error) {
                    toast.error('Error al obtener etiquetas:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchUnassignedTags = async () => {
            if (show && selectedCandidate) {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8000/api/user/${selectedCandidate.id}/unassigned-tags/`);
                    setTagsNot(response.data);
                    setFilteredTagsNot(response.data);
                    console.log(tagsNot);  // Para verificar que se están obteniendo las etiquetas no asignadas
                } catch (error) {
                    toast.error('Error al obtener etiquetas no asignadas:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTags();
        fetchUnassignedTags();
    }, [show, selectedCandidate]);

    const handleTagSearch = (keyword) => {
        const filtered = tags.filter(tag => tag.name.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredTags(filtered);

        const filteredNot = tagsNot.filter(tag => tag.name.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredTagsNot(filteredNot);
    };

    const handleDeleteTag = async (tagId) => {
        if (!selectedCandidate) return;

        try {
            await axios.delete(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/?tag_id=${tagId}`);
            const updatedTags = tags.filter(tag => tag.id !== tagId);
            setTags(updatedTags);
            setFilteredTags(updatedTags);
            toast.success('¡Etiqueta desasignada con éxito!');
        } catch (error) {
            toast.error('Error al desasignar la etiqueta:', error);
        }
    };

    const handleAssignTag = async (tagId) => {
        if (!selectedCandidate) return;

        try {
            await axios.post(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/`, {
                tags: [tagId]
            });
            toast.success('¡Etiqueta asignada con éxito!');
        } catch (error) {
            toast.error('Error al asignar la etiqueta al miembro:', error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Etiquetas de Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row mb-4 justify-content-between">
                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-10 mt-btn">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar una palabra clave"
                                    onChange={(event) => handleTagSearch(event.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-grid col-md-1"></div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        {loading ? (
                            <p className="text-center">Cargando etiquetas...</p>
                        ) : (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Etiquetas</th>
                                            <th className="text-center">Tipo</th>
                                            <th className="text-center">Miembros</th>
                                            <th className="text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Renderizar las etiquetas asignadas */}
                                        {filteredTags.length > 0 && filteredTags.map((tag) => (
                                            <tr key={tag.id} className='tr-tags tr-assigned'>
                                                <td className="text-center">{tag.name}</td>
                                                <td className="text-center">{tag.isAdmin ? 'Administrador' : 'Miembro'}</td>
                                                <td className="text-center"><i className="ti ti-user"></i> {tag.member_count}</td>
                                                <td className="text-center">
                                                    <button className="icon-button btn btn-light btn-sm mx-1" onClick={() => handleDeleteTag(tag.id)}>
                                                        <i className="ti ti-x"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Renderizar las etiquetas no asignadas */}
                                        {filteredTagsNot.length > 0 && filteredTagsNot.map((tag) => (
                                            <tr key={tag.id} className='tr-tags'>
                                                <td className="text-center">{tag.name}</td>
                                                <td className="text-center">{tag.isAdmin ? 'Administrador' : 'Miembro'}</td>
                                                <td className="text-center"><i className="ti ti-user"></i> {tag.member_count}</td>
                                                <td className="text-center">
                                                    <button className="icon-button btn btn-light btn-sm mx-1" onClick={() => handleAssignTag(tag.id)}>
                                                        <i className="ti ti-plus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};


export default Page;
