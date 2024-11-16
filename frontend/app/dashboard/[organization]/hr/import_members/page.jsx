"use client";

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import './style.css';
import { Row, Spinner } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import sad from "@/public/assets/images/image.png";
import Image from "next/image";
import { toast } from "react-toastify";

const Page = () => {
    const [organizationId, setOrganizationId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null); // Estado para almacenar la respuesta de la API
    const { data: user } = useRetrieveUserQuery();

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
    }, []);



    const handleCreateMembers = async () => {
        if (!data || data.length === 0) {
            toast.error("No hay miembros procesados para subir.");
            return;
        }
    
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/create_members/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    organizationId, // Extraído desde la URL
                    members: data, // Miembros procesados desde el archivo
                }),
            });
    
            if (response.ok) {
                toast.success("Miembros creados exitosamente.");
                setData(null); // Limpia los datos después de enviarlos
            } else {
                const errorData = await response.json();
                console.error("Error al crear miembros:", errorData);
                toast.error("Hubo un error al crear los miembros.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            toast.error("Error al conectar con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileUpload = async (file) => {
        if (!file) return;
    
        setIsLoading(true); // Mostrar el loader mientras se procesa
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch("http://localhost:8000/api/import_members/", {
                method: "POST",
                body: formData,
            });
    
            const result = await response.json(); // Parsear la respuesta JSON
            console.log("Raw Response from API:", result);
    
            if (result.extracted_data) {
                // Parsear la cadena JSON en el campo `extracted_data`
                const parsedData = JSON.parse(result.extracted_data);
                console.log("Parsed Data:", parsedData);
    
                if (Array.isArray(parsedData)) {
                    setData(parsedData); // Almacenar los datos parseados en el estado
                } else {
                    console.error("Parsed data is not an array:", parsedData);
                    setData([]);
                }
            } else {
                console.error("Unexpected response format:", result);
                setData([]);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setData([]); // Fallback a un array vacío en caso de error
        } finally {
            setIsLoading(false); // Ocultar el loader después de procesar
        }
    };
        
    const handleFileInputChange = (event) => {
        const file = event?.target?.files?.[0]; // Manejar el acceso al archivo de forma segura
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (isLoading) return; // Prevenir drop mientras carga
        const file = event.dataTransfer?.files?.[0]; // Manejar el acceso al archivo de forma segura
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Recursos Humano" subTitle="Importar Miembros" />
            <Row className='d-flex justify-content-center'>
                {!data ? ( // Mostrar el formulario si no hay datos
                    <div
                        className="card p-4 text-center upload-card"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="icon-container mb-3">
                            <svg className='svg-file' width="36" height="41" viewBox="0 0 36 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="27" height="36" rx="3" fill="#2A50CF" stroke="white" strokeWidth="2" />
                                <line x1="6.25" y1="7.75" x2="22.75" y2="7.75" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="6.25" y1="14.75" x2="22.75" y2="14.75" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="23.5" cy="28.5" r="12.5" fill="#2A50CF" />
                                <circle cx="23.5" cy="28.5" r="10.5" fill="white" />
                                <path d="M23.8518 22.9649L23.7712 33.9989" stroke="#2A50CF" strokeWidth="2" strokeLinecap="round" />
                                <path d="M23.8153 22.9999L27.5137 26.526" stroke="#2A50CF" strokeWidth="2" strokeLinecap="round" />
                                <path d="M23.8153 22.9999L20.5139 26.4749" stroke="#2A50CF" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h5 className="mb-3 h5-file">Arrastra aquí tu documento</h5>
                        <h3 className="mb-3 h3-file">o</h3>
                        <div className='d-flex justify-content-center'>
                            <button
                                className="btn btn-primary mb-3 btn-file-up"
                                onClick={() => document.getElementById("fileInput").click()}
                                disabled={isLoading} // Desactivar botón mientras carga
                            >
                                <svg className='clip' width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.9733 8.74792L9.69792 16.0233C8.80663 16.9146 7.59778 17.4154 6.3373 17.4154C5.07682 17.4154 3.86797 16.9146 2.97667 16.0233C2.08538 15.132 1.58466 13.9232 1.58466 12.6627C1.58466 11.4022 2.08538 10.1934 2.97667 9.30208L10.2521 2.02667C10.8463 1.43247 11.6522 1.09866 12.4925 1.09866C13.3328 1.09866 14.1387 1.43247 14.7329 2.02667C15.3271 2.62086 15.6609 3.42676 15.6609 4.26708C15.6609 5.1074 15.3271 5.91331 14.7329 6.5075L7.44959 13.7829C7.15249 14.08 6.74954 14.2469 6.32938 14.2469C5.90922 14.2469 5.50627 14.08 5.20917 13.7829C4.91207 13.4858 4.74517 13.0829 4.74517 12.6627C4.74517 12.2425 4.91207 11.8396 5.20917 11.5425L11.9304 4.82917" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Seleccionar archivo
                            </button>
                            <input
                                type="file"
                                id="fileInput"
                                accept=".doc,.docx,.txt,.xls,.xlsx"
                                style={{ display: "none" }}
                                onChange={handleFileInputChange}
                                disabled={isLoading} // Prevenir selección desde input mientras carga
                            />
                        </div>
                        {isLoading && (
                            <div className="text-center mt-3">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </Spinner>
                            </div>
                        )}
                        <p className="text-muted tct">Sube un archivo con el nombre, apellido y email de cada miembro.<br />El formato debe ser: doc, docx, txt, xls o xlsx.</p>
                    </div>
                ) : Array.isArray(data) && data.length > 0 ? (
                    <>
                    <div className="card card-list-2 p-4 text-center">
                        <table className="table tabla-upload">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            {data.map((member, index) => (
                                <tr key={index}>
                                    <td>
                                        {member.isEditing ? (
                                            <input
                                                type="text"
                                                value={member.first_name}
                                                onChange={(e) => {
                                                    const newData = [...data];
                                                    newData[index].first_name = e.target.value; // Update first_name
                                                    setData(newData);
                                                }}
                                                className="form-control"
                                            />
                                        ) : (
                                            member.first_name
                                        )}
                                    </td>
                                    <td>
                                        {member.isEditing ? (
                                            <input
                                                type="text"
                                                value={member.last_name}
                                                onChange={(e) => {
                                                    const newData = [...data];
                                                    newData[index].last_name = e.target.value; // Update last_name
                                                    setData(newData);
                                                }}
                                                className="form-control"
                                            />
                                        ) : (
                                            member.last_name
                                        )}
                                    </td>
                                    <td>
                                        {member.isEditing ? (
                                            <input
                                                type="text"
                                                value={member.email}
                                                onChange={(e) => {
                                                    const newData = [...data];
                                                    newData[index].email = e.target.value; // Update email
                                                    setData(newData);
                                                }}
                                                className="form-control"
                                            />
                                        ) : (
                                            member.email
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            {!member.isEditing ? (
                                                <div
                                                    className="edit-button-uplist"
                                                    onClick={() => {
                                                        const newData = [...data];
                                                        newData[index].isEditing = true; // Set isEditing to true
                                                        setData(newData);
                                                    }}
                                                >
                                                    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M9.5 15.8333H16.625"
                                                            stroke="#272727"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M13.0625 2.77084C13.3774 2.4559 13.8046 2.27896 14.25 2.27896C14.4705 2.27896 14.6889 2.3224 14.8927 2.4068C15.0964 2.49119 15.2816 2.61489 15.4375 2.77084C15.5934 2.92678 15.7171 3.11192 15.8015 3.31567C15.8859 3.51942 15.9294 3.7378 15.9294 3.95834C15.9294 4.17888 15.8859 4.39726 15.8015 4.60101C15.7171 4.80476 15.5934 4.98989 15.4375 5.14584L5.54167 15.0417L2.375 15.8333L3.16667 12.6667L13.0625 2.77084Z"
                                                            stroke="#272727"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div
                                                    className="edit-button-uplist"
                                                    onClick={() => {
                                                        const newData = [...data];
                                                        newData[index].isEditing = false; // Set isEditing to false
                                                        setData(newData);
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 6L9 17L4 12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                                </div>
                                            )}
                                            <div
                                                className="trash-button-uplist"
                                                onClick={() => {
                                                    const newData = [...data];
                                                    newData.splice(index, 1); // Remove the item at the current index
                                                    setData(newData); // Update the state with the new data
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M3 5H4.52047H16.6842"
                                                        stroke="#25282B"
                                                        strokeWidth="1.7"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M7.29326 5.05264V3.57895C7.29326 3.18811 7.43585 2.81327 7.68966 2.5369C7.94346 2.26053 8.2877 2.10527 8.64664 2.10527H11.3534C11.7123 2.10527 12.0566 2.26053 12.3104 2.5369C12.5642 2.81327 12.7068 3.18811 12.7068 3.57895V5.05264M14.7369 5.05264V15.3684C14.7369 15.7593 14.5943 16.1341 14.3405 16.4105C14.0867 16.6868 13.7424 16.8421 13.3835 16.8421H6.61657C6.25763 16.8421 5.91339 16.6868 5.65958 16.4105C5.40577 16.1341 5.26318 15.7593 5.26318 15.3684V5.05264H14.7369Z"
                                                        stroke="#25282B"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        </table>
                    </div>
                    <div className='d-flex justify-content-center'>
                    <button
                        className="btn btn-primary mb-3 btn-file-up2"
                        onClick={handleCreateMembers}
                        disabled={isLoading}
                    >
                        <svg className='clip clip2' width="19" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.125 11.875V15.0417C17.125 15.4616 16.9582 15.8643 16.6613 16.1613C16.3643 16.4582 15.9616 16.625 15.5417 16.625H4.45833C4.03841 16.625 3.63568 16.4582 3.33875 16.1613C3.04181 15.8643 2.875 15.4616 2.875 15.0417V11.875" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13.9582 6.33333L9.99984 2.375L6.0415 6.33333" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 2.375V11.875" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        Subir
                    </button>
                    </div>
                    </>
                ) : (
                    <div className="card upload-card p-4 text-center">
                    <div className="mt-50 mb-20 d-flex justify-content-center">

                    <Image 
                        src={sad} 
                        alt="image" 
                        className="" 
                        width={102} 
                        height={130}
                    />

                    </div>
                    <p className="mb-50 text-black">
                    <b>No encontramos miembros en el archivo subido.<br></br>
                    Intentelo de nuevo.</b></p>
                    <div className="d-flex justify-content-center">
                    <button
                                className="btn btn-primary mb-3 btn-file-up"
                                onClick={() => window.location.reload()} // Recargar la página
                                >
                        Volver a Intentar
                    </button>
                    </div>
                    </div>

                )}
            </Row>
        </Layout>
    );
};

export default Page;
