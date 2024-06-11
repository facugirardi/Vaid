// page.jsx
'use client'

import React from 'react';
import { Provider } from 'react-redux';
import { wrapper } from '@/redux/store'; // Asegúrate de que la ruta al store es correcta
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const Page = () => {
    const { data: user, isError, isLoading } = useRetrieveUserQuery();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Dashboard" subTitle="Home" />
            <p>ID: {user.id} | Name: {user.first_name} {user.last_name} | Email: {user.email}</p>
        </Layout>
    );
};

export default Page;
