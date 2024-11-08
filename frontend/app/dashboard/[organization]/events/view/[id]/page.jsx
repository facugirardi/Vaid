'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import Image from "next/image";
import './viewEvent.css';
import { Button, Form, Modal } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Importar el icono X

const Page = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAttending, setIsAttending] = useState(false);
    const [isOrgAccount, setIsOrgAccount] = useState(false);
    const [event, setEvent] = useState(null);
    const [organizationId, setOrganizationId] = useState("");
    const [eventId, setEventId] = useState("");
    const [members, setMembers] = useState([]); // Estado para guardar los miembros
    const [guests, setGuests] = useState([]); // Estado para guardar los invitados
    const [newGuest, setNewGuest] = useState({
        name: "",
        email: "",
        role: ""
    }); // Estado para los nuevos datos de invitados
    const { data: user, isError, isLoading } = useRetrieveUserQuery();
    const [showModalMember, setShowModalMember] = useState(false); // Estado para controlar el modal
    const [selectedMember, setSelectedMember] = useState(null); // Estado para el miembro seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
    const [selectedGuest, setSelectedGuest] = useState(null); // Estado para el miembro seleccionado

    // Obtener el organizationId y el eventId de la URL
    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        const viewIndex = pathSegments.indexOf('view');
        
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
        if (viewIndex !== -1 && pathSegments.length > viewIndex + 1) {
            setEventId(pathSegments[viewIndex + 1]);
        }
    }, []);

    // Fetch del evento, miembros e invitados
    useEffect(() => {
        if (organizationId && eventId) {
            const fetchData = async () => {
                try {
                    // Fetch para obtener el evento
                    const eventResponse = await fetch(`http://localhost:8000/api/organizations/${organizationId}/events/${eventId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const eventData = await eventResponse.json();
                    setEvent(eventData);

                    // Fetch para obtener los miembros que asistieron al evento
                    const participantsResponse = await fetch(`http://localhost:8000/api/event/participants/?event_id=${eventId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const membersData = await participantsResponse.json();
                    setMembers(membersData);

                    // Fetch para obtener los invitados del evento
                    const guestsResponse = await fetch(`http://localhost:8000/api/organization/event/${eventId}/guests/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const guestsData = await guestsResponse.json();
                    setGuests(guestsData); 

                } catch (error) {
                    console.error("Error al obtener datos del evento:", error);
                }
            };

            fetchData();
    }
    }, [organizationId, eventId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.id) {
                    const { isAdmin, isOrgAccount } = await checkUserPermissions(user.id);
                    setIsAdmin(isAdmin);
                    setIsOrgAccount(isOrgAccount);
                }
            } catch (error) {
                console.error("Error al verificar permisos:", error);
            }
        };

        fetchData();
    }, [user.id]);

    const handleToggleAttendance = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/event/${eventId}/toggle-attendance/${user.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setIsAttending(!isAttending); 
            toast.success('¡Tu estado de asistencia ha cambiado exitosamente!');
        } catch (error) {
            console.error('Error al cambiar estado de asistencia:', error);
            toast.error('Error al cambiar estado de asistencia.');
        }
    };

    const handleShareLink = async () => {
        try {
            const invitationLink = `${window.location.origin}/dashboard/${organizationId}/events/view/${eventId}`;
            await navigator.clipboard.writeText(invitationLink);
            toast.success('¡Enlace de invitación copiado al portapapeles!', {
                autoClose: 10000, // 10 segundos
            });
        } catch (error) {
            toast.error('Error al copiar el enlace.');
        }
    };

    // Manejo de cambios en el formulario de nuevo invitado
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGuest({ ...newGuest, [name]: value });
    };

    const handleDeleteGuest = async (guest_id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/organization/event/guest/${guest_id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                setGuests(guests.filter(guest => guest.id !== guest_id));
                toast.success('¡Invitado eliminado exitosamente!');
            } else {
                toast.error('Error al eliminar invitado.');
            }
        } catch (error) {
            toast.error('Error al eliminar invitado.');
        }
    };

    const handleFinishEvent = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/organization/event/${eventId}/finish/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                toast.success('¡Evento finalizado exitosamente!');
                setEvent({ ...event, state: 'Finalizado' });
            } else {
                toast.error('Error al finalizar evento.');
            }
        } catch (error) {
            toast.error('Error al finalizar evento.');
        }
    };    

    const handleDeleteEvent = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/organization/event/${eventId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                toast.success('¡Evento eliminado exitosamente!');
                window.location.href = `/dashboard/${organizationId}/events/view`; // Redirige a la lista de eventos
            } else {
                toast.error('Error al eliminar evento.');
            }
        } catch (error) {
            toast.error('Error al eliminar evento.');
        }
    };
    
    const handleDeleteMember = async (memberId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/organization/event/member/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setMembers(members.filter(member => member.id !== memberId));
                toast.success('¡Miembro eliminado!');
            } else {
                toast.error('Error al eliminar miembro.');
            }
        } catch (error) {
            toast.error('Error al eliminar miembro.');
        }
    };

    useEffect(() => {
        const checkAttendance = async () => {
            if(user.id && eventId){
                try {
                    const response = await fetch(`http://localhost:8000/api/event/${eventId}/check-attendance/${user.id}/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setIsAttending(data.is_attending); 
                } catch (error) {
                    console.error('Error al verificar asistencia:', error);
                }
            }
        };
        checkAttendance();
    }, [eventId, user.id]);

    const handleToggleEventState = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/organization/event/${eventId}/toggle-state/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(`¡El estado del evento cambió a ${data.state}!`);
                setEvent({ ...event, state: data.state });
            } else {
                toast.error('Error al cambiar estado del evento.');
            }
        } catch (error) {
            toast.error('Error al cambiar estado del evento.');
        }
    };

    const checkUserPermissions = async (userId) => {
        let isAdmin = false;
        let isOrgAccount = false;

        try {
            const adminResponse = await fetch(`http://localhost:8000/api/isAdmin/?user_id=${userId}`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const adminData = await adminResponse.json();
            isAdmin = adminData;

            const orgAccountResponse = await fetch(`http://localhost:8000/api/user/${userId}/check-usertype/`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const orgAccountData = await orgAccountResponse.json();
            if (orgAccountData.user_type === 2) {
                isOrgAccount = true;
            }
        } catch (error) {
            console.error("Error al verificar permisos:", error);
        }

        return { isAdmin, isOrgAccount };
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            if (user.id) {
                const { isAdmin, isOrgAccount } = await checkUserPermissions(user.id);
                setIsAdmin(isAdmin);
                setIsOrgAccount(isOrgAccount);
            }
        };

        fetchPermissions();
    }, [user.id]);

    const handleInput = (e) => {
        const textarea = e.target;
        // Restablecer el tamaño del textarea para recalcular la altura
        textarea.style.height = 'auto';
        // Ajustar la altura en función del contenido
        textarea.style.height = textarea.scrollHeight + 'px';
      };

    const handleShowModalMember = (member) => {
        setSelectedMember(member); // Guardar el miembro seleccionado
        setShowModalMember(true); // Mostrar el modal
    };

    const handleCloseModalMember = () => {
        setShowModalMember(false); // Cerrar el modal
        setSelectedMember(null); // Limpiar el miembro seleccionado
    };

    const handleShowModal = (guest) => {
        setSelectedGuest(guest); // Guardar el miembro seleccionado
        setShowModal(true); // Mostrar el modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal
        setSelectedGuest(null); // Limpiar el miembro seleccionado
    };


// Modificar el handleAddGuest para incluir la validación y el envío del correo
const handleAddGuest = async (e) => {
    e.preventDefault();
    const currentGuests = Array.isArray(guests) ? guests : [];

    // Validar que se haya proporcionado un email
    if (!newGuest.email) {
        toast.error('El email es obligatorio para agregar un invitado.');
        return;
    }

    // Verificar si el email ya existe en la lista de invitados
    const emailExists = currentGuests.some(guest => guest.email === newGuest.email);
    if (emailExists) {
        toast.error('Este invitado ya existe.');
        return; 
    }

    try {
        const response = await fetch(`http://localhost:8000/api/organization/event/guest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_id: eventId,
                ...newGuest
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.guest) {
                setGuests((prevGuests) => Array.isArray(prevGuests) ? [...prevGuests, data.guest] : [data.guest]);
                setNewGuest({ name: "", email: "", role: "" });
                toast.success('¡Invitado añadido!');
                
                // Enviar el correo automáticamente después de añadir el invitado
                handleSendEmail(data.guest.email);
            } else {
                toast.error("No se encontraron datos del invitado en la respuesta.");
            }
        } else {
            const errorData = await response.json();
            toast.error("Error al añadir invitado: " + errorData.error);
        }
    } catch (error) {
        toast.error("Error al añadir invitado.");
    }
};

// Nueva función para enviar el correo
const handleSendEmail = async (email) => {
    if (!email) {
        toast.error('No se puede enviar el correo sin una dirección de email válida.');
        return;
    }

    try {
        await fetch(`http://localhost:8000/api/send-email/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                event_id: eventId,
                link: `${window.location.origin}/dashboard/${organizationId}/events/view/${eventId}`
            })
        });

        toast.success('¡Invitación enviada con éxito!');
    } catch (error) {
        toast.error('Error al enviar la invitación por correo.');
    }
};
const handleRedirect = () => {
    window.location.href = `http://localhost:3000/dashboard/${organizationId}/events/view`; // Redireccionar
};

    return (
        <Layout>
            {event && (
                <div className="d-flex">
                    <div className='container event-cont position-relative mt-30'>
                    <button 
                            onClick={handleRedirect} 
                            className="btn-close"
                            style={{ 
                                position: "absolute", 
                                top: "10px", 
                                right: "10px", 
                                background: "transparent", 
                                border: "none", 
                                fontSize: "20px", 
                                cursor: "pointer"
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <div className="row">
                            <div className="image-container col-12 col-md-12 col-lg-5 d-flex justify-content-center">
                                <Image 
                                    src={cover1} 
                                    alt="image" 
                                    className="img-fluid img-popup-event" 
                                    width={300} 
                                    height={300}
                                />
                            </div>
                            <div className="details-container col-md-12 col-lg-7">
                                <div className="d-inline-flex align-items-center mb-10">
                                    <span className="text-dark"> {event.state}</span>
                                    <i className={`chat-badge ${event.state === 'Finalizado' ? 'bg-success' : 'bg-danger'}`}></i>
                                </div>
                                <p className='title2-modal'>Título</p><p className='title-modal-13'>{event.name}</p>
                                <p className='title3-modal'>Descripción</p><p className='title-modal-12'>{event.description}</p>
                                <Form.Group className='form-group-all'>
                                    <div className="row">
                                        <div className='col-md-3'>
                                            <p className='title-dates fecha1'>Fecha de inicio</p>
                                            <Form.Control type="date" defaultValue={event.date} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates fecha1'>Fecha de fin</p>
                                            <Form.Control type="date" defaultValue={event.endDate} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates fecha1'>Hora de inicio</p>
                                            <Form.Control type="time" defaultValue={event.time} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates fecha1'>Hora de fin</p>
                                            <Form.Control type="time" defaultValue={event.endTime} readOnly/>
                                        </div>
                                    </div>
                                </Form.Group>
                            </div>

                            {isAdmin || isOrgAccount ? ( 
                            <>
                            <form onSubmit={handleAddGuest}>
                                <div className='container mt-50 add-guest-container'>
                                    <h5 className="add-guest-title mb-40">Añadir invitado</h5>
                                    <div className='row d-flex justify-content-center'>
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="name" className="form-label">Nombre</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="name" 
                                                name="name" 
                                                placeholder='Añadir nombre completo' 
                                                value={newGuest.name}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3 col-md-6">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                name="email" 
                                                placeholder='Añadir email' 
                                                value={newGuest.email}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-2 col-md-12">
                                            <label htmlFor="role" className="form-label">Observaciones</label>
                                            <textarea 
                                                type="text" 
                                                className="form-control" 
                                                id="role" 
                                                name="role" 
                                                placeholder='Observaciones del invitado' 
                                                onInput={handleInput}
                                                value={newGuest.role}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className='col-md-3 d-flex justify-content-center align-items-center'>
                                            <Button variant="primary" type="submit" className='button-add-guest mt-10'>
                                                Añadir invitado
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="container table-guest-container">
                                <h5 className='add-member-title mb-40'>Lista de invitados</h5>
                                <div className='row d-flex justify-content-center'>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>ID</th>
                                                <th className='text-center'>Nombre</th>
                                                <th className='text-center'>Email</th>
                                                <th className='text-center'>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(members.length === 0 && guests.length === 0) ? (
                                                <>
                                                <tr>
                                                    <td colSpan="4" className="text-center">                                                           <br />
                                                    <br />
                                                    <b>No se encontraron miembros ni invitados para este evento.</b></td>
                                                </tr>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Renderizar miembros */}
                                                    {Array.isArray(members) && members.length > 0 && members.map((member, index) => (
                                                        <tr key={member.id}>
                                                            <td className='text-center'>{index + 1}</td>
                                                            <td className='text-center'>{member.first_name} {member.last_name}</td>
                                                            <td className='text-center'>{member.email}</td>
                                                            <td className='text-center'>
                                                                <button className="trash-event" onClick={() => handleShowModalMember(member)}>
                                                                    <FontAwesomeIcon icon={faEye} className='hover-button-trash icon-eye-mr' />
                                                                </button>      
                                                                <button className="trash-event" onClick={() => handleDeleteMember(member.id)}>
                                                                    <FontAwesomeIcon icon={faTrash} className='hover-button-trash icon-trash-ml' />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {/* Renderizar invitados */}
                                                    {Array.isArray(guests) && guests.length > 0 && guests.map((guest, index) => (
                                                        <tr key={guest.id}>
                                                            <td className='text-center'>{index + 1}</td>
                                                            <td className='text-center'>{guest.name}</td>
                                                            <td className='text-center'>{guest.email}</td>
                                                            <td className='text-center'>
                                                               <button className="trash-event" onClick={() => handleShowModal(guest)}>
                                                                    <FontAwesomeIcon icon={faEye} className='hover-button-trash icon-eye-mr' />
                                                                </button>
                                                                <button className="trash-event" onClick={() => handleDeleteGuest(guest.id)}>
                                                                    <FontAwesomeIcon icon={faTrash} className='hover-button-trash icon-trash-ml' />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            </>) : <></>}

                            <div className='container last-container'>
                                <div className='row d-flex justify-content-center'>
                                {isAdmin || isOrgAccount ? (
                                <Button className="btn-close-task mx-2" onClick={handleToggleEventState}>
                                    {event.state === 'Finalizado' ? 'Pendiente' : 'Finalizar'}
                                </Button> ) :
                                <Button className="btn-close-task mx-2" onClick={handleToggleAttendance}>
                                    {isAttending ? 'Dejar' : 'Asistir'}
                                </Button>
                            }
                                {isAdmin || isOrgAccount ? (
                                <Button className="btn-close-task3 mx-2" onClick={handleDeleteEvent}>Eliminar</Button>
                                ) : <></>}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



              <Modal show={showModalMember} onHide={handleCloseModalMember} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Información del Miembro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMember && (
                        <div>
                            <p><strong>Nombre:</strong> {selectedMember.first_name} {selectedMember.last_name}</p>
                            <p><strong>Email:</strong> {selectedMember.email}</p>
                            <p><strong>Número de teléfono:</strong> {selectedMember.phone_number}</p>
                            <p><strong>Ciudad:</strong> {selectedMember.city}</p>
                            <p><strong>Calle:</strong> {selectedMember.street_name} {selectedMember.street_number}</p>
                            {/* Puedes agregar más información según lo que tengas disponible */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalMember}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Información del Miembro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedGuest && (
                        <div>
                          <p><strong>Nombre:</strong> {selectedGuest.name}</p>
                          <p><strong>Email:</strong> {selectedGuest.email}</p>
                          <p><strong>Observaciones:</strong> {selectedGuest.role}</p>

                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>


        </Layout>
    );
}

export default Page;
