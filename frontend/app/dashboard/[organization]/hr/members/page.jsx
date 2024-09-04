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

const Page = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [showTagModal, setShowTagModal] = useState(false);
    const [showTagModalAssign, setShowTagModalAssign] = useState(false); // Nuevo estado para TagModalAssign
    const [organizationId, setOrganizationId] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);

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
        const fetchData = async () => {
            if (organizationId) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/organizations/${organizationId}/members`);
                    console.log('Fetched candidates:', response.data);
                    setCandidates(response.data);
                } catch (error) {
                    toast.error('Error fetching candidate details:', error);
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
        console.log('Search keyword:', keyword);
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
            toast.error('Error deleting:', error);
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
                header: "Born Date",
                accessorKey: "born_date",
                enableColumnFilter: false,
            },
            {
                header: "Country",
                accessorKey: "country",
                enableColumnFilter: false,
            },
            {
                header: "User Tags",
                accessorKey: "status",
                enableColumnFilter: false,
                cell: (cellProps) => {
                    return (
                        <>
                            <div className="overlay-edit-3">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item m-0">
                                        <Button className="btn-action avtar avtar-s btn btn-secondary" onClick={() => handleShowTagModalAssign(cellProps.row.original)}>
                                            <i className="ph-duotone ph-tag f-18 icon-action"></i>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    );
                },
            },
            {
                header: "Information",
                enableColumnFilter: false,
                accessorKey: "status",
                cell: (cellProps) => {
                    return (
                        <>
                            <div className="overlay-edit-3">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item m-0">
                                        <Button className="btn-action avtar avtar-s btn btn-primary" onClick={() => handleShowModal(cellProps.row.original)}>
                                            <i className="ph-duotone ph-info f-18 icon-action"></i>
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
                            <div className="container">
                                <div className="row">
                                    <button className="col-md-2 btn-tags-create theme-btn style-two" onClick={() => handleShowInviteModal()}>Invite Users <span>
                                    <i className="ph-duotone ph-user"></i> 
                                        </span></button>
                                    <div className="col-md-8"></div>
                                    <button className="col-md-2 btn-tags-create theme-btn style-one" onClick={() => handleShowTagModal()}>View Tags <span>
                                    <i className="ph-duotone ph-tag"></i> 
                                        </span></button>
                                </div>
                            </div>
                        {candidates.length === 0 ? (
                            <div className="text-center mt-4">
                                <p className='p-history'>No members available.</p>
                            </div>
                        ) : (
                            <TableContainer
                                columns={columns}
                                data={candidates}
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

            {/* Render TagModal */}
            <TagModal show={showTagModal} handleClose={handleCloseTagModal} organizationId={organizationId} handleSearch={handleSearch} selectedCandidate={selectedCandidate} />

            {/* Render TagModalAssign */}
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
            toast.success('Invitation sent successfully!');
            setInviteEmail("");
            handleClose();
        } catch (error) {
            toast.error('Error sending invitation');
      
        }
    };

    return (
         <Modal show={show} onHide={handleClose} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Invite User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleInviteUser}>
                    <div className="container">
                        <div className='row justify-content-between'>

                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-7 mt-user-email">
                                <h6>Email Address</h6>
                            </div>
                            <div className='d-grid col-md-4'></div>
                        </div>
 
                        <div className="row mb-4 justify-content-between">
                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-7 mt-btn">
                                <input
                                  
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter user's email address"
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
                                    Invite
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

    useEffect(() => {
        const fetchTags = async () => {
            if (show && organizationId) { // Hace fetch solo cuando el modal se muestra y hay una organización seleccionada
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8000/api/organizations/${organizationId}/tags/`);
                    setTags(response.data);
                    setFilteredTags(response.data);
                } catch (error) {
                    toast.error('Error fetching tags:', error);
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
            toast.success('Tag deleted successfully!')
        } catch (error) {
            toast.error('Error deleting tag:', error);
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
            toast.error('Error creating tag:', error);
        }
    };

    const handleAssignTag = async (tagId) => {
        if (!selectedCandidate) return;

        try {
            await axios.post(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/`, {
                tags: [tagId]
            });
            toast.success('Tag Added Successfully!')
            handleClose();  // Cierra el modal después de asignar la tag
        } catch (error) {
            toast.error('Error assigning tag to member:', error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>View Tags</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row mb-4 justify-content-between">
                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-7 mt-btn">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search a Keyword"
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
                                    New Tag
                                </button>
                            </div>
                            <div className="d-grid col-md-1"></div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        {loading ? (
                            <p className="text-center">Loading tags...</p>
                        ) : filteredTags.length === 0 ? (
                            <p className="text-center">No tags available.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Tags</th>
                                        <th className="text-center">Type</th>
                                        <th className="text-center">Members</th>
                                        <th className="text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTags.map((tag) => (
                                        <tr key={tag.id} className='tr-tags'>
                                            <td className="text-center">{tag.name}</td>
                                            <td className="text-center">{tag.isAdmin ? 'Member' : 'Administrator'}</td>
                                            <td className="text-center"><i className="ti ti-user"></i> {tag.member_count}</td>
                                            <td className="text-center">
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
                    <Modal.Title className='title-tag-cnt'>Create Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleTagSubmit} className="tag-form">
                        <Form.Group controlId="formTagName" className="me-3 flex-grow-1 d-flex align-items-center">
                            <div className="container cont-ctall">
                                <div className="row">
                                    <div className="col-7 col-md-9">
                                        <Form.Control
                                            type="text"
                                            placeholder="Tag Name"
                                            value={tagName}
                                            onChange={(e) => setTagName(e.target.value)}
                                            required
                                            className="me-3" // Ajuste para el margen entre el campo de texto y el switch
                                        />
                                    </div>
                                    <div className="col-1 col-md-1 icon-switch">
                                        <i className="ph-duotone ph-user-gear icon-admin"></i>
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
                                        <i className="ph-duotone ph-user icon-admin"></i>
                                    </div>
                                </div>
                            </div>
                        </Form.Group>
                        <div className="box-create-btn container">
                            <div className="row row-text-admin">
                                <span className='col-1 col-md-1 icon-span-adm'><i className="ph-duotone ph-user-gear icon-admin"></i></span>
                                <p className='col-3 col-md-5 p-adm1'>This is an administrator</p>
                                <span className='col-1 col-md-1 icon-span-adm p-adm2'><i className="ph-duotone ph-user icon-admin"></i></span>
                                <p className='col-3 col-md-5'>This is a member</p>
                            </div>
                            <div className="row">
                                <div className="col-2 col-md-4">
                                </div>
                                <div className="col-6 d-flex justify-content-center col-md-4">
                                    <Button variant="primary" type="submit" className="create-tag-btn">
                                        Create Tag
                                    </Button>
                                </div>

                                <div className="col-2 col-md-4">
                                </div>

                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

// Aquí está el nuevo TagModalAssign, que hace fetch de las tags cada vez que se muestra.

const TagModalAssign = ({ show, handleClose, handleSearch, organizationId, selectedCandidate }) => {
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [tagsNot, setTagsNot] = useState([]);
    const [filteredTagsNot, setFilteredTagsNot] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            if (show && selectedCandidate) { // Hace fetch solo cuando el modal se muestra y hay un candidato seleccionado
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/`);
                    setTags(response.data);
                    setFilteredTags(response.data);
                } catch (error) {
                    toast.error('Error fetching tags:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchUnassignedTags = async () => {
            if (show && selectedCandidate) { // Hace fetch solo cuando el modal se muestra y hay un candidato seleccionado
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:8000/api/user/${selectedCandidate.id}/unassigned-tags/`);
                    setTagsNot(response.data);  // Actualiza el estado con las tags no asignadas
                    setFilteredTagsNot(response.data);  // También actualiza los tags filtrados
                } catch (error) {
                    toast.error('Error fetching unassigned tags:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        fetchUnassignedTags();
        fetchTags();
    }, [show, selectedCandidate]); // Ejecutar cuando `show` o `selectedCandidate` cambian

    const handleTagSearch = (keyword) => {
        const filtered = tags.filter(tag => tag.name.toLowerCase().includes(keyword.toLowerCase()));
        setFilteredTags(filtered);
    };

    const handleDeleteTag = async (tagId) => {
        if (!selectedCandidate) return;
    
        try {
            await axios.delete(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/?tag_id=${tagId}`);
            const updatedTags = tags.filter(tag => tag.id !== tagId);
            setTags(updatedTags);
            setFilteredTags(updatedTags);
            toast.success('Tag unassigned successfully!');
        } catch (error) {
            toast.error('Error deleting tag:', error);
        }
    };
    
    const handleAssignTag = async (tagId) => {
        if (!selectedCandidate) return;

        try {
            await axios.post(`http://localhost:8000/api/user/${selectedCandidate.id}/tags/`, {
                tags: [tagId]
            });
            toast.success('Tag Added Successfully!')
    
        } catch (error) {
            toast.error('Error assigning tag to member:', error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>User Tags</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row mb-4 justify-content-between">
                            <div className="d-grid col-md-1"></div>
                            <div className="d-grid col-md-10 mt-btn">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search a Keyword"
                                    onChange={(event) => handleTagSearch(event.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="d-grid col-md-1"></div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        {loading ? (
                            <p className="text-center">Loading tags...</p>
                        ) : filteredTags.length === 0 ? (
                            <p className="text-center">No tags available.</p>
                        ) : (
                            <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Tags</th>
                                        <th className="text-center">Type</th>
                                        <th className="text-center">Members</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTags.map((tag) => (
                                        <tr key={tag.id} className='tr-tags tr-assigned'>
                                            <td className="text-center">{tag.name}</td>
                                            <td className="text-center">{tag.isAdmin ? 'Member' : 'Administrator'}</td>
                                            <td className="text-center"><i className="ti ti-user"></i> {tag.member_count}</td>
                                            <td className="text-center">
                                                <button className="icon-button btn btn-light btn-sm mx-1" onClick={() => handleDeleteTag(tag.id)}>
                                                    <i className="ti ti-x"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tbody>
                                    {filteredTagsNot.map((tag) => (
                                        <tr key={tag.id} className='tr-tags'>
                                            <td className="text-center">{tag.name}</td>
                                            <td className="text-center">{tag.isAdmin ? 'Administrator' : 'Member'}</td>
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
