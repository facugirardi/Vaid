// page.jsx
'use client'

import React, {useEffect} from 'react';
import Layout from '@/layouts/dashboard/index2';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './profile.css'
import Friends from "@/views/Application/Friend";
import FriendsRequest from "@/views/Application/friendRequest";
import SocialTab from "@/views/Application/social-tab";
import SocialProfile from "@/views/Application/social-media";
import Suggestions from "@/views/Application/suggests"; 
import { Col, Row, Tab } from "react-bootstrap";

const Page = () => {


    const { data: user, isError, isLoading } = useRetrieveUserQuery();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <Row>
                              
              <Col sm={2}></Col> 
              <Col sm={8}>
                    <SocialProfile />
                    <Tab.Container defaultActiveKey="friendsRequests">
                        <SocialTab />
                        <Row>
                                <Tab.Content>
                                    <FriendsRequest />
                                    <Friends />
                                    <Suggestions/>
                                </Tab.Content>

                        </Row>
                    </Tab.Container>
                </Col>
                <Col sm={2}></Col> 

            </Row >
        </Layout>
    );
};
export default Page;
