import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Link from "next/link";

import '@/app/dashboard/profile.css'
import { toast } from "react-toastify";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
// img
import profileCover from "@/public/assets/images/backgrounds/counter.png"
import avatar from "@/public/assets/images/user/avatar-5.jpg";

const SocialProfile = () => {
  const { data: user, isFetching } = useRetrieveUserQuery();
  const [avatar2, setImage] = useState(avatar);
  const [organization, setOrganization] = useState(null);
  const [userType, setUserType] = useState(null);
  const backendUrl = 'http://localhost:8000'; // Cambia esto a la URL de tu backend
  const [organizationId, setOrganizationId] = useState(null);

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

  const fetchImage = async () => {
    if (organizationId) {
      try {
        const response = await fetch(`http://localhost:8000/api/retrieve-logo-org?user_id=${organizationId}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();

          if (data.images.length > 0) {
            console.log(data.images);
            const imageUrl = `${backendUrl}${data.images[0].image}`;

            if (imageUrl) {
              console.log("Image URL:", imageUrl); // Verificar la URL de la imagen en la consola
              setImage(imageUrl); // Asegúrate de usar la propiedad correcta
            } else {
              setImage(avatar); // Usar imagen por defecto si no se encuentra imagen
            }
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

  const fetchOrganization = async () => {
    if (organizationId) {
      try {
        const response = await fetch(`http://localhost:8000/api/organization-ext/${organizationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch organization');
        }

        const data = await response.json();
        setOrganization(data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchOrganization();
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
                  <h5 className="mb-1">{organization ? organization.name : 'Loading...'}</h5>
                  <p className="mb-0">‎<Link href="#" className="link-primary"></Link></p>
                </Col>
                <Col md={3} xl={2} xxl={2}>
                  <Row className="g-1 text-center">
                    <Col xs={6}>
                      {userType === 1 ? (
                        <a className="btn btn-primary" href={`/`}>Apply</a>
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
