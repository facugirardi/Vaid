// page.jsx
'use client'

import React, { ReactElement, useEffect, useState } from "react";
import Layout from '@/layouts/dashboard/index2';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { ProgressBar, TabContainer, Col, Form, Card, Nav, Row, Tab } from "react-bootstrap";
import './form.css';
import ava2 from "@/public/assets/images/user/avatar-2.jpg";
import Image from "next/image";

const Page = () => {


    const { data: user, isError, isLoading } = useRetrieveUserQuery();
    const [key, setKey] = useState('tab-1');
    const [progress, setProgress] = useState(25);
    const totalTabs = 4;

    useEffect(() => {
        // Calculate progress when the component mounts
        const calculateProgress = () => {
          return ((parseInt(key.split('-')[1]) - 1) / (totalTabs - 1)) * 100;
        };
        setProgress(calculateProgress());
      }, [key, totalTabs]);

    const handleTabSelect = (k) => {
        setKey(k);
    };

    const handleNext = () => {
        const nextKey = parseInt(key.split('-')[1]) + 1;
        setKey(`tab-${nextKey}`);
    };

    const handlePrevious = () => {
        const previousKey = parseInt(key.split('-')[1]) - 1;
        setKey(`tab-${previousKey}`);
    };


    

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <Row>
                <Col>
                    <BreadcrumbItem />
                </Col>
            </Row>
        </Layout>
    ); 
}