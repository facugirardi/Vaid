'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './viewTask.css';
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Importar el icono X
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from "react-toastify";

const Page = () => {
    const [task, setTask] = useState(null);
    const [organizationId, setOrganizationId] = useState("");
    const [taskId, setTaskId] = useState("");
    const [isAdmin, setIsAdmin] = useState(false); // Verificar si es administrador
    const [isOrgAccount, setIsOrgAccount] = useState(false); // Verificar si es cuenta de organización
    const [isTaken, setIsTaken] = useState(false); // Estado para saber si la tarea está tomada
    const { data: user, isError, isLoading } = useRetrieveUserQuery();

    // Obtener el organizationId y el taskId de la URL
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
            setTaskId(pathSegments[viewIndex + 1]); // Aquí obtienes el ID de la tarea
        }
    }, []);

    // Fetch de la tarea por su ID
    useEffect(() => {
        if (organizationId && taskId) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/tasks/${taskId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    setTask(data);
                } catch (error) {
                    console.error("Error fetching task:", error);
                }
            };

            fetchData();
        }
    }, [organizationId, taskId]);

    // Verificar si el usuario es administrador y si ya tomó la tarea
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/isAdmin/?user_id=${user.id}`, { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setIsAdmin(data); // Asigna el valor de isAdmin
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        const checkOrgAccountStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${user.id}/check-usertype/`, { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.user_type === 2) {
                    setIsOrgAccount(true); // Asigna isOrgAccount si el user_type es 2
                }
            } catch (error) {
                console.error("Error checking organization account status:", error);
            }
        };

        const checkIfTaskTaken = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/organizations/tasks/participation/?person_id=${user.id}&task_id=${taskId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsTaken(data.is_taken); // Si el backend devuelve que la tarea está tomada, actualizar el estado.
                }
            } catch (error) {
                console.error("Error checking task participation:", error);
            }
        };

        if (user && taskId) {
            checkAdminStatus();
            checkOrgAccountStatus();
            checkIfTaskTaken();
        }
    }, [user, taskId]);

    // Función para manejar la redirección
    const handleRedirect = () => {
        window.location.href = `http://localhost:3000/dashboard/${organizationId}/tasks/view`; // Redireccionar
    };


    const handleMarkAsDone = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/mark-as-done/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                toast.success('¡Tarea marcada como hecha!');
                setTask({ ...task, state: 'Finalizado' });
            } else {
                toast.error('Error al marcar la tarea como hecha');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para marcar la tarea como pendiente
    const handleMarkAsPending = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/mark-as-pending/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                toast.success('¡Tarea marcada como pendiente!');
                setTask({ ...task, state: 'Pendiente' });
            } else {
                toast.error('Error al marcar la tarea como pendiente');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para eliminar la tarea
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/organizations/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                toast.success('Tarea eliminada con éxito');
                handleRedirect();
            } else {
                console.error('Error al eliminar la tarea:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleTakeOrUntake = async () => {
        try {
            const action = isTaken ? 'delete' : 'post';
            const response = await fetch(`http://localhost:8000/api/organizations/tasks/participation/?person_id=${user.id}&task_id=${taskId}`, {
                method: action.toUpperCase(),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                const successMessage = isTaken ? 'Tarea dejada exitosamente' : 'Tarea tomada exitosamente';
                toast.success(successMessage);
                setIsTaken(!isTaken); 
            } else {
                const errorMessage = isTaken ? 'Error al dejar la tarea' : 'Error al tomar la tarea';
                toast.error(errorMessage);
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <Layout>
            <BreadcrumbItem mainTitle="Tareas" subTitle="Ver Tareas"/>
            {task && (
                <div className="d-flex">
                    <div className='container event-cont position-relative mt-30'>
                        {/* Botón de cierre (X) */}
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
                            <div className="image-container col-12 col-md-5 d-flex justify-content-center">
                                <Image 
                                    src={cover1} 
                                    alt="imagen" 
                                    className="img-fluid img-popup-event" 
                                    width={300} 
                                    height={300}
                                />
                            </div>
                            <div className="details-container col-md-7">
                            <div className="cover-data">
                                        <div className="d-inline-flex align-items-center mb-10">
                                            <span className="text-dark"> {task.state}</span>
                                            <i className={`chat-badge ${task.state === 'Finalizado' ? 'bg-success' : 'bg-danger'}`}></i>
                                        </div>
                                    </div> 
                                <p className='title2-modal'>Título </p>
                                <p class='title-modal-13'>{task.name}</p>
                                <p className='title3-modal'>Descripción</p>
                                <p className='title-modal-12'>{task.description}</p>
                                <Form.Group className='form-group-all'>
                                    <div className="row">
                                        <div className='col-md-3'>
                                            <p className='title-dates'>Fecha de inicio</p>
                                            <Form.Control type="date" defaultValue={task.date} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Fecha de fin</p>
                                            <Form.Control type="date" defaultValue={task.endDate} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Hora de inicio</p>
                                            <Form.Control type="time" defaultValue={task.time} readOnly/>
                                        </div>
                                        <div className="col-md-3">
                                            <p className='title-dates'>Hora de fin</p>
                                            <Form.Control type="time" defaultValue={task.endTime} readOnly/>
                                        </div>
                                    </div>
                                </Form.Group>

                            </div>
                            <div className="d-flex justify-content-center mt-4 btn-cont-all">
                                {isAdmin || isOrgAccount ? (
                                    <>
                                    <Button 
                                        className="button-take btn-delete-task mx-2" 
                                        onClick={handleDelete}
                                    >
                                        Eliminar
                                    </Button>
                                </>
                                ) : (
                                    <Button 
                                        className="button-take mx-2 size-btn-big" 
                                        onClick={handleTakeOrUntake}
                                    >
                                        {isTaken ? "Dejar" : "Tomar"}
                                    </Button>
                                )}
                                {task.state === 'Finalizado' ? (
                                    <Button 
                                        className="button-close btn-close-task mx-2" 
                                        onClick={handleMarkAsPending}
                                    >
                                        Pendiente
                                    </Button>
                                ) : (
                                    <Button 
                                        className="button-close btn-close-task mx-2" 
                                        onClick={handleMarkAsDone}
                                    >
                                      Hecho
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default Page;
