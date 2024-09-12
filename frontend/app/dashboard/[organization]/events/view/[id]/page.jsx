'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import Image from "next/image";
import './viewEvent.css';
import { Button, Form } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from "react-toastify";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

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
                    console.error("Error fetching event data:", error);
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
                    console.error("Error checking permissions:", error);
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
            toast.success('Your attendance status has changed successfully!');
        } catch (error) {
            console.error('Error toggling attendance:', error);
            toast.error('Error toggling attendance.');
        }
    };


    // Manejo de cambios en el formulario de nuevo invitado
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGuest({ ...newGuest, [name]: value });
    };

    // Agregar invitado al evento
    const handleAddGuest = async (e) => {
        e.preventDefault();
        const currentGuests = Array.isArray(guests) ? guests : [];

        // Verificar si el email ya existe en la lista de invitados
        const emailExists = currentGuests.some(guest => guest.email === newGuest.email);
        if (emailExists) {
            toast.error('Guest with this email already exists.');
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
                    toast.success('Guest added!');
                } else {
                    toast.error("Guest data not found in the response.");
                }
            } else {
                const errorData = await response.json();
                toast.error("Error adding guest: " + errorData.error);
            }
        } catch (error) {
            toast.error("Error adding guest.");
        }
    };

    // Eliminar invitado
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
                toast.success('Guest deleted successfully!');
            } else {
                toast.error('Error deleting guest.');
            }
        } catch (error) {
            toast.error('Error deleting guest.');
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
                toast.success('Event finished successfully!');
                // Actualizar el estado del evento a 'Done' en el frontend
                setEvent({ ...event, state: 'Done' });
            } else {
                toast.error('Error finishing event.');
            }
        } catch (error) {
            toast.error('Error finishing event.');
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
                toast.success('Event deleted successfully!');
                // Redirigir o actualizar la página
                window.location.href = `/dashboard/${organizationId}/events/view`; // Redirige a la lista de eventos
            } else {
                toast.error('Error deleting event.');
            }
        } catch (error) {
            toast.error('Error deleting event.');
        }
    };
    
    
    // Eliminar miembro
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
                toast.success('Member deleted!');
            } else {
                toast.error('Error deleting member.');
            }
        } catch (error) {
            toast.error('Error deleting member.');
        }
    };

    useEffect(() => {
        // Verificar si el usuario ya está asistiendo al evento
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
                setIsAttending(data.is_attending);  // Actualizar el estado
            } catch (error) {
                console.error('Error checking attendance:', error);
            }
        }
        };
        checkAttendance();
        }, [eventId, user.id]);

    // Cambiar el estado del evento entre 'Pending' y 'Done'
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
            toast.success(`Event state changed to ${data.state}!`);
            // Actualizar el estado del evento en el frontend
            setEvent({ ...event, state: data.state });
        } else {
            toast.error('Error changing event state.');
        }
    } catch (error) {
        toast.error('Error changing event state.');
    }
};

// Función para verificar permisos
const checkUserPermissions = async (userId) => {
    let isAdmin = false;
    let isOrgAccount = false;

    try {
        // Verificar si el usuario es administrador
        const adminResponse = await fetch(`http://localhost:8000/api/isAdmin/?user_id=${userId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const adminData = await adminResponse.json();
        isAdmin = adminData;

        // Verificar si el usuario pertenece a una cuenta de organización
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
        console.error("Error checking user permissions:", error);
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

    return (
        <Layout>
            {event && (
                <div className="d-flex">
                    <div className='container event-cont'>
                        <div className="row">
                            <div className="image-container col-12 col-md-5">
                                <Image 
                                    src={cover1} 
                                    alt="image" 
                                    className="img-fluid img-popup-event" 
                                    width={300} 
                                    height={300}
                                />
                            </div>
                            <div className="details-container col-md-7">
                                <div className="d-inline-flex align-items-center mb-10">
                                    <span className="text-dark"> {event.state}</span>
                                    <i className={`chat-badge ${event.state === 'Done' ? 'bg-success' : 'bg-danger'}`}></i>
                                </div>
                                <p className='title2-modal'>Title</p><p className='title-modal-13'>{event.name}</p>
                                <p className='title3-modal'>Description</p><p className='title-modal-12'>{event.description}</p>
                                <Form.Group className='form-group-all'>
                                    <div className="row">
                                        <div className='col-md-3'>
                                            <p className='title-dates'>Start Date</p>
                                            <Form.Control type="date" defaultValue={event.date} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>End Date</p>
                                            <Form.Control type="date" defaultValue={event.endDate} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Start Time</p>
                                            <Form.Control type="time" defaultValue={event.time} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>End Time</p>
                                            <Form.Control type="time" defaultValue={event.endTime} readOnly/>
                                        </div>
                                    </div>
                                </Form.Group>
                            </div>


                            {isAdmin || isOrgAccount ? ( <>


                            <form onSubmit={handleAddGuest}>
                                <div className='container mt-50 add-guest-container'>
                                    <h5 className="add-guest-title mb-40">Add Guest</h5>
                                    <div className='row d-flex justify-content-center'>
                                        <div className="mb-3 col-md-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="name" 
                                                name="name" 
                                                placeholder='Add Name' 
                                                value={newGuest.name}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                name="email" 
                                                placeholder='Add Email' 
                                                value={newGuest.email}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="mb-3 col-md-3">
                                            <label htmlFor="role" className="form-label">Role</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="role" 
                                                name="role" 
                                                placeholder='Event Role' 
                                                value={newGuest.role}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className='col-md-2 d-flex justify-content-center align-items-center'>
                                            <Button variant="primary" type="submit" className='button-add-guest mt-10'>
                                                Add Guest
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="container table-guest-container">
                                <h5 className='add-member-title mb-40'>Guests List</h5>
                                <div className='row d-flex justify-content-center'>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>ID</th>
                                                <th className='text-center'>Name</th>
                                                <th className='text-center'>Role</th>
                                                <th className='text-center'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(members.length === 0 && guests.length === 0) ? (
                                                <>
                                                <tr>
                                                    <td colSpan="4" className="text-center">                                                           <br />
                                                    <br />
                                                    <b>No members or guests found for this event.</b></td>
                                                </tr>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Renderizar miembros */}
                                                    {Array.isArray(members) && members.length > 0 && members.map((member, index) => (
                                                        <tr key={member.id}>
                                                            <td className='text-center'>{index + 1}</td>
                                                            <td className='text-center'>{member.first_name} {member.last_name}</td>
                                                            <td className='text-center'>Member</td>
                                                            <td className='text-center'>
                                                                <button className="trash-event" onClick={() => handleDeleteMember(member.id)}>
                                                                    <FontAwesomeIcon icon={faTrash} className='hover-button-trash' />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                    {/* Renderizar invitados */}
                                                    {Array.isArray(guests) && guests.length > 0 && guests.map((guest, index) => (
                                                        <tr key={guest.id}>
                                                            <td className='text-center'>{index + 1}</td>
                                                            <td className='text-center'>{guest.name}</td>
                                                            <td className='text-center'>{guest.role}</td>
                                                            <td className='text-center'>
                                                                <button className="trash-event" onClick={() => handleDeleteGuest(guest.id)}>
                                                                    <FontAwesomeIcon icon={faTrash} className='hover-button-trash' />
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
                                    {event.state === 'Done' ? 'Mark as Pending' : 'Finish Event'}
                                </Button> ) :
                                <Button className="btn-close-task mx-2" onClick={handleToggleAttendance}>
                                    {isAttending ? 'Leave Event' : 'Assist'}
                                </Button>
                            }
                                {isAdmin || isOrgAccount ? (
                                <Button className="btn-close-task3 mx-2" onClick={handleDeleteEvent}>Delete</Button>
                                ) : <></>}
                                <Button className="btn-close-task2 mx-2">
                                    <i className="fa fa-share-alt" />
                                </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Page;
