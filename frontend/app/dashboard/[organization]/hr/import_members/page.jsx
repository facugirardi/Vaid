"use client"

import React, { useState, useEffect } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Image from "next/image";
import './style.css';
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import cover1 from "@/public/assets/images/wallpaper_event.jpg";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { PlusCircle } from "phosphor-react";

const Page = () => {
    const [organizationId, setOrganizationId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOrgAccount, setIsOrgAccount] = useState(false);
    const { data: user, isError, isLoading } = useRetrieveUserQuery();

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
            console.error("Error al verificar los permisos del usuario:", error);
        }
    
        return { isAdmin, isOrgAccount };
    };
    
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
            try {
                if (user.id) {
                    const { isAdmin, isOrgAccount } = await checkUserPermissions(user.id);
                    setIsAdmin(isAdmin);
                    setIsOrgAccount(isOrgAccount);
                    console.log("isAdmin", isAdmin);
                    console.log("isOrgAccount", isOrgAccount);
                }
            } catch (error) {
                console.error("Error al verificar los permisos:", error);
            }
        };

        fetchData();
    }, [user.id]);

    return (
        <Layout>
              <BreadcrumbItem mainTitle="Recursos Humano" subTitle="Importar Miembros" />
            <Row className='d-flex justify-content-center'>
              <div className="card p-4 text-center upload-card">
                <div className="icon-container mb-3">
            
                  <svg className='svg-file' width="36" height="41" viewBox="0 0 36 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="27" height="36" rx="3" fill="#2A50CF" stroke="white" stroke-width="2"/>
                    <line x1="6.25" y1="7.75" x2="22.75" y2="7.75" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="6.25" y1="14.75" x2="22.75" y2="14.75" stroke="white" stroke-width="2.5" stroke-linecap="round"/> 
                    <circle cx="23.5" cy="28.5" r="12.5" fill="#2A50CF"/>
                    <circle cx="23.5" cy="28.5" r="10.5" fill="white"/> 
                    <path d="M23.8518 22.9649L23.7712 33.9989" stroke="#2A50CF" stroke-width="2" stroke-linecap="round"/> 
                    <path d="M23.8153 22.9999L27.5137 26.526" stroke="#2A50CF" stroke-width="2" stroke-linecap="round"/> 
                    <path d="M23.8153 22.9999L20.5139 26.4749" stroke="#2A50CF" stroke-width="2" stroke-linecap="round"/>
                  </svg>

                </div>
                <h5 className="mb-3 h5-file">Arrastra aquí tu documento</h5>
                <h3 className="mb-3 h3-file">o</h3>
                <div className='d-flex justify-content-center'> 
                  <button className="btn btn-primary mb-3 btn-file-up">
                    <svg className='clip' width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.9733 8.74792L9.69792 16.0233C8.80663 16.9146 7.59778 17.4154 6.3373 17.4154C5.07682 17.4154 3.86797 16.9146 2.97667 16.0233C2.08538 15.132 1.58466 13.9232 1.58466 12.6627C1.58466 11.4022 2.08538 10.1934 2.97667 9.30208L10.2521 2.02667C10.8463 1.43247 11.6522 1.09866 12.4925 1.09866C13.3328 1.09866 14.1387 1.43247 14.7329 2.02667C15.3271 2.62086 15.6609 3.42676 15.6609 4.26708C15.6609 5.1074 15.3271 5.91331 14.7329 6.5075L7.44959 13.7829C7.15249 14.08 6.74954 14.2469 6.32938 14.2469C5.90922 14.2469 5.50627 14.08 5.20917 13.7829C4.91207 13.4858 4.74517 13.0829 4.74517 12.6627C4.74517 12.2425 4.91207 11.8396 5.20917 11.5425L11.9304 4.82917" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Seleccionar archivo
                  </button>
                </div>
                <p className="text-muted tct">Sube un archivo con el nombre, apellido y email de cada miembro.<br/>El formato debe ser: doc, docx, txt, xls o xlsx.</p>
              </div>
            </Row>
        </Layout>
    );
}

export default Page;

