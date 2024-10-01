// page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import Layout from '@/layouts/dashboard/index2';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './profile.css';
import Friends from "@/views/Application/Friend";
import FriendsRequest from "@/views/Application/friendRequest";
import FormDetails from "@/views/Application/formDetails";
import SocialTab from "@/views/Application/social-tab";
import SocialProfile from "@/views/Application/social-media";
import Suggestions from "@/views/Application/suggests";
import { Col, Row, Tab } from "react-bootstrap";

const Page = () => {
  const { data: user, isError, isLoading } = useRetrieveUserQuery();
  const [userType, setUserType] = useState(null);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !user) return <p>Error loading user data!</p>;

  const checkComplete = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${user.id}/check-usertype`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch completion status');
        }

        const data = await response.json();
        setUserType(data.user_type);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  useEffect(() => {
    checkComplete();
  }, [user]);

  return (
    <Layout>
      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <SocialProfile />
          {userType === 1 ? (
            <Tab.Container defaultActiveKey="friendsRequests">
              <SocialTab />
              <Row>
                <Tab.Content>
                  <FriendsRequest />
                  <Friends />
                  <Suggestions />
                  <FormDetails />
                </Tab.Content>
              </Row>
            </Tab.Container>
          ) : userType === 2 ? (
            <Tab.Container defaultActiveKey="friendsRequest">
              <SocialTab />
              <Row>
                <Tab.Content>
                  <FriendsRequest />
                </Tab.Content>
              </Row>
            </Tab.Container>
          ) : (
            <p>Tipo de usuario no reconocido</p>
          )}
        </Col>
        <Col sm={2}></Col>
      </Row>
    </Layout>
  );
};

export default Page;
