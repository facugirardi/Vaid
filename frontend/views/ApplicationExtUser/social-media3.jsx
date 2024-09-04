import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import '@/app/dashboard/profile.css';
import { toast } from "react-toastify";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import profileCover from "@/public/assets/images/backgrounds/counter.png";
import avatar from "@/public/assets/images/user/avatar-5.jpg";

const SocialProfile = () => {
  const { data: user, isFetching } = useRetrieveUserQuery();
  const [avatar2, setImage] = useState(avatar);
  const [userType, setUserType] = useState(null);
  const backendUrl = 'http://localhost:8000'; // Change this to your backend URL
  const [organizationId, setOrganizationId] = useState(null);

  const { push } = useRouter();
  const [userDetails, setUserDetails] = useState(null);

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

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/');
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      setOrganizationId(pathSegments[dashboardIndex + 1]);
    }
  }, []);

  const fetchImage = async () => {
    if (organizationId) {
      try {
        const response = await fetch(`http://localhost:8000/api/retrieve-logo?user_id=${organizationId}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.images.length > 0) {
            const imageUrl = `${backendUrl}${data.images[0].image}`;
            setImage(imageUrl || avatar);
          } else {
            toast.error('No image found for the specified user');
          }
        } else {
          toast.error('Error fetching image');
        }
      } catch (error) {
        toast.error('Error fetching image');
      }
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchImage();
    }
  }, [organizationId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (organizationId) {
        try {
          const response = await fetch(`http://localhost:8000/api/person/${organizationId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 404) {
            window.location.href = '/not-found';
            return;
          }
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          toast.error(`Failed to retrieve user. Error: ${error.message}`);
        }
      }
    };

    if (organizationId) {
      fetchUserDetails();
    }
  }, [organizationId]);




  return (
    <React.Fragment>
      <Card className="social-profile">
        <Image src={profileCover} alt="" className="w-100 h-100 card-img-top" />
        <Card.Body className="pt-0">
          <Row className="align-items-end">
            <div className="col-md-auto text-md-start">
              <Image className="img-fluid img-profile-avtar" src={avatar2} width={100} height={100} alt="User image" />
            </div>
            <div className="col">
              <Row className="justify-content-between align-items-end">
                <Col md={5} xl={6} className="soc-profile-data">
                  <h5 className="mb-1">
                    {userDetails ? `${userDetails.user.first_name} ${userDetails.user.last_name}` : 'Loading...'}
                  </h5>
                  <p className="mb-0">
                    <a href="#" className="link-primary"></a>
                  </p>
                </Col>
                <Col md={3} xl={2} xxl={2}>
                  <Row className="g-1 text-center">
                    <Col xs={6}>
                      {userType === 2 ? (
                        <h5 className="mb-0">‎</h5>
                      ) : (
                        <h5 className="mb-0">‎</h5>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default SocialProfile;
