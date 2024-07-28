// page.jsx
'use client'

import React, {useEffect, useState} from 'react';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';


const Page = () => {
    
    const [organizationId, setOrganizationId] = useState("");

    useEffect(() => {
        // Get the current URL
        const currentUrl = window.location.href;
        // Use URL constructor to parse the URL
        const url = new URL(currentUrl);
        // Split the pathname into segments
        const pathSegments = url.pathname.split('/');
        // Find the segment after 'dashboard'
        const dashboardIndex = pathSegments.indexOf('dashboard');
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
    }, []);

    const { data: user, isError, isLoading } = useRetrieveUserQuery();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Dashboard" subTitle="Home" />
            <h4>{organizationId}</h4>
            <p>ID: {user.id} | Name: {user.first_name} {user.last_name} | Email: {user.email}</p>
        </Layout>
    );
};

export default Page;



