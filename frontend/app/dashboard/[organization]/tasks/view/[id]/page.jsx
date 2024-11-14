'use client';

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './viewTask.css';
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Importar el icono X
import cover4 from "@/public/assets/images/4.png";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import cover2 from "@/public/assets/images/48.png";
import cover3 from "@/public/assets/images/98.png";
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
    const [history, setHistory] = useState([]); // Estado para almacenar el historial de cambios

    const [isOpen, setIsOpen] = useState(false); // Estado para abrir el modal

    const handleToggleModal = () => {
        setIsOpen(!isOpen);
    };
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
        const fetchTaskData = async () => {
            if (organizationId && taskId) {
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
            }
        };

        const fetchTaskHistory = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/task-history/${taskId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const historyData = await response.json();
                    setHistory(historyData); // Actualizar el estado del historial
                }
            } catch (error) {
                console.error("Error fetching task history:", error);
            }
        };

        fetchTaskData();
        fetchTaskHistory();
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


    // HISTORIAL DE CAMBIOS
    const markTaskAsUntaken = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/task-history/${taskId}/dejada/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: `${user.first_name} ${user.last_name} salió de la tarea.`
                }),
            });
    
            if (response.ok) {
                setIsTaken(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const markTaskAsTaken = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/task-history/${taskId}/tomada/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: `${user.first_name} ${user.last_name} se unió a la tarea.`
                }),
            });
    
            if (response.ok) {
                setIsTaken(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const markTaskAsPending = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/task-history/${taskId}/pendiente/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: `${user.first_name} ${user.last_name} marcó la tarea como pendiente.`
                }),
            });
    
            if (response.ok) {
                setTask({ ...task, state: 'Pendiente' });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const markTaskAsCompleted = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/task-history/${taskId}/completada/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: `${user.first_name} ${user.last_name} completó la tarea.`
                }),
            });
    
            if (response.ok) {
                setTask({ ...task, state: 'Completada' });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    // FIN DE HISTORIAL DE CAMBIOS        

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
                markTaskAsCompleted();
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
                markTaskAsPending();
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
                if (isTaken) {
                    markTaskAsTaken();
                } else {
                    markTaskAsUntaken();
                }
            } else {
                const errorMessage = isTaken ? 'Error al dejar la tarea' : 'Error al tomar la tarea';
                toast.error(errorMessage);
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const getStatusIcon = (description) => {
        if (description.includes("unió") || description.includes("completó")) {
            return (
                <svg width="30" height="30" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21.5" cy="21.5" r="21" stroke="#2BC155"/>
                    <path d="M21.7499 31.0093C21.7436 31.4235 21.4028 31.7541 20.9886 31.7478C20.5744 31.7415 20.2438 31.4007 20.2501 30.9865L21.7499 31.0093ZM20.7515 12.4617C21.0489 12.1733 21.5237 12.1805 21.8121 12.4778L26.5119 17.3228C26.8003 17.6201 26.7931 18.0949 26.4958 18.3833C26.1985 18.6718 25.7236 18.6645 25.4352 18.3672L21.2576 14.0605L16.9509 18.2382C16.6536 18.5266 16.1788 18.5194 15.8904 18.222C15.602 17.9247 15.6092 17.4499 15.9065 17.1615L20.7515 12.4617ZM20.2501 30.9865L20.5238 12.9886L22.0237 13.0114L21.7499 31.0093L20.2501 30.9865Z" fill="#2BC155"/>
                </svg>
            );
        } else if (description.includes("salió") || description.includes("pendiente")) {
            return (
                <svg width="30" height="30" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21.5002" cy="21.5001" r="21" transform="rotate(178.6 21.5002 21.5001)" stroke="#FF3E3E"/>
                    <path d="M21.0179 11.9996C21.014 11.5854 21.3467 11.2465 21.7609 11.2427C22.1751 11.2389 22.514 11.5716 22.5178 11.9858L21.0179 11.9996ZM22.469 30.5173C22.1788 30.8129 21.704 30.8173 21.4084 30.5271L16.5916 25.7984C16.296 25.5082 16.2917 25.0333 16.5818 24.7377C16.872 24.4422 17.3469 24.4378 17.6425 24.728L21.924 28.9313L26.1274 24.6497C26.4176 24.3541 26.8924 24.3497 27.188 24.6399C27.4836 24.9301 27.488 25.405 27.1978 25.7005L22.469 30.5173ZM22.5178 11.9858L22.6838 29.985L21.1839 29.9988L21.0179 11.9996L22.5178 11.9858Z" fill="#FF3E3E"/>
                </svg>
            );
        }
        return null;
    };

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Tareas" subTitle="Ver Tareas"/>
            {task && (
                <div className="d-flex">
                    <div className='container event-cont position-relative mt-30'>
                        {/* Nuevo div rectangular con imágenes de perfil y flecha */}
                        <div className="profile-container">
                            <div className="profile-images">
                                <Image src={cover4} alt="Perfil 1" width={27} height={27} className="rounded-circle" />
                                <Image src={cover2} alt="Perfil 2" width={27} height={27} className="rounded-circle img-tas" />
                                <Image src={cover3} alt="Perfil 3" width={27} height={27} className="rounded-circle img-tas" />
                            </div>
                            <button className="arrow-button" onClick={handleToggleModal}>
                            <svg width="18" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.0033 7.01343L9.49343 11.3081L13.9836 7.01343" stroke="#2a50cf" stroke-width="1.3" stroke-linecap="square" stroke-linejoin="round"/>
                            </svg>
                            </button>
                        </div>

                        {/* Modal para abrir contenido adicional */}
                        <Modal show={isOpen} onHide={handleToggleModal}>
                            <Modal.Header closeButton>
                                <Modal.Title>Información Adicional</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Aquí puedes mostrar contenido adicional o información detallada relacionada.</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleToggleModal}>Cerrar</Button>
                            </Modal.Footer>
                        </Modal>

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
                        <div className="row row-con">
                            <div className="image-container col-md-12 col-lg-5  d-flex justify-content-center">
                                <Image 
                                    src={cover1} 
                                    alt="imagen" 
                                    className="img-fluid img-popup-event" 
                                    width={300} 
                                    height={300}
                                />
                            </div>
                            <div className="details-container col-md-12 col-lg-7 ">
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
                                            <p className='title-dates fecha1'>Fecha de Inicio</p>
                                            <Form.Control type="date" defaultValue={task.date} readOnly/>
                                        </div>
                                        <div className="col-md-3 ">
                                            <p className='title-dates fecha1'>Fecha de Fin</p>
                                            <Form.Control type="date" defaultValue={task.endDate} readOnly/>
                                        </div>
                                        <div className="col-md-3 ">
                                            <p className='title-dates fecha1'>Hora de Inicio</p>
                                            <Form.Control type="time" defaultValue={task.time} readOnly/>
                                        </div>
                                        <div className="col-md-3 ">
                                            <p className='title-dates fecha1'>Hora de Fin</p>
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
                        <div className='hc-cont container event-cont position-relative mt-30'>
                            <p className="title-hc"><b>Historial de Cambios</b></p>
                            <div className="history-list">
                            {history.length > 0 ? (
                                    history.map((item, index) => (
                                        <div key={index} className="history-item d-flex align-items-center">
                                            {getStatusIcon(item.description)}
                                            <p className="description-hc">{item.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="title2-hc">No hay historial de cambios disponible.</p>
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
