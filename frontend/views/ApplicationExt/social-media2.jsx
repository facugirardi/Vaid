import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import Link from "next/link";

import '@/app/dashboard/profile.css'
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import profileCover from "@/public/assets/images/backgrounds/counter.png"
import avatar from "@/public/assets/images/user/avatar-5.jpg";

const SocialProfile = () => {
  const { data: user, isFetching } = useRetrieveUserQuery();
  const [avatar2, setImage] = useState(avatar);
  const [organization, setOrganization] = useState(null);
  const [userType, setUserType] = useState(null);
  const backendUrl = 'http://localhost:8000'; // Cambia esto a la URL de tu backend
  const [organizationId, setOrganizationId] = useState(null);
  const { push } = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [isMember, setIsMember] = useState(false);
  
  useEffect(() => {
    const checkMembership = async () => {
      if (user?.id && organizationId) {
        try {
          // Enviando los valores como query params
          const response = await fetch(`http://localhost:8000/api/check-membership/?organization_id=${organizationId}&user_id=${user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Error al verificar la membresía');
          }

          const data = await response.json();
          setIsMember(data.is_member);
        } catch (error) {
          toast.error(`Error: ${error.message}`);
        }
      }
    };

    if (user?.id && organizationId) {
      checkMembership();
    }
  }, [user, organizationId]);

const handleEnter = () => {
  const url = `${window.location.origin}/dashboard/${organizationId}/home`;
  window.location.href = url;
};
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user.id) {
        try {
          const response = await fetch(`http://localhost:8000/api/person/${user.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 404) {
            push('/not-found');
            return;
          }
          if (!response.ok) {
            throw new Error('La respuesta de la red no fue satisfactoria');
          }

          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          toast.error(`Error al recuperar el usuario. Error: ${error.message}`);
        }
      }
    };

    if (user.id) {
      fetchUserDetails();
    }
  }, [user.id]);

    const handleApply = async (orgId) => {
        if (userDetails.user.is_form === true) {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${user.id}/apply-org/${orgId}`);
                const data = await response.json();
                if (response.ok) {
                    toast.success('¡Solicitud para unirse enviada con éxito! ¡Espera la aprobación!');
                } else {
                    toast.error('Error al enviar la solicitud. Contacta con soporte.');
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        } else {
            push('/complete/form');
        }
    };


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
          throw new Error('Error al verificar el estado de finalización');
        }

        const data = await response.json();
        setUserType(data.user_type);
      } catch (error) {
        console.error('Ocurrió un error:', error);
      }
    }
  };

  useEffect(() => {
    checkComplete();
  }, [user]);

  useEffect(() => {
    // Obtener la URL actual
    const currentUrl = window.location.href;
    // Usar el constructor de URL para analizar la URL
    const url = new URL(currentUrl);
    // Dividir el pathname en segmentos
    const pathSegments = url.pathname.split('/');
    // Buscar el segmento después de 'dashboard'
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
            const imageUrl = `${backendUrl}${data.images[0].image}`;

            if (imageUrl) {
              setImage(imageUrl); // Asegúrate de usar la propiedad correcta
            } else {
              setImage(avatar); // Usar imagen por defecto si no se encuentra imagen
            }
          } else {
            toast.error('No se encontró imagen para el usuario especificado');
          }
        } else {
          toast.error('Error al recuperar la imagen');
        }
      } catch (error) {
        toast.error('Error al recuperar la imagen');
      }
    }
  };

    const handleLeave = async (organizationId) => {
        try {
            await fetch(`http://localhost:8000/api/person-organization-details-leave/${user.id}/${organizationId}/delete/`, {
                method: 'DELETE',
            });
            toast.success('Abandonaste la organización.')
            setIsMember(false)
            
        } catch (error) {
            toast.error('Error al eliminar:', error);
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
          throw new Error('Error al obtener la organización');
        }

        const data = await response.json();
        setOrganization(data);
      } catch (error) {
        console.error('Ocurrió un error:', error);
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
              <Image className="img-fluid img-profile-avtar" src={avatar2} width={100} height={100} alt="Imagen de usuario" />
            </div>
            <div className="col">
              <Row className="justify-content-between align-items-end">
                <Col md={5} xl={6} className="soc-profile-data">
                  <h5 className="mb-1">{organization ? organization.name : 'Cargando...'}</h5>
                  <p className="mb-0">‎<a href="#" className="link-primary"></a></p>
                </Col>


                  {userType === 1 && (
                    isMember ? (
                  <Col md={6} xl={4} xxl={4}>
                  <Row className="g-1 text-center d-flex justify-content-center">
                    <Col xs={6}>
                        <div className="d-flex btns">
                          <button className="btn btn-primary me-2" onClick={handleEnter}>
                          Entrar
                          </button>
                          <button className="btn btn-secondary" onClick={() => handleLeave(organizationId)}>
                          Abandonar
                          </button>
                        </div>

                        </Col>
                      </Row>
                    </Col>
                        ) : (
                    <Col md={3} xl={2} xxl={2}>
                      <Row className="g-1 text-center">
                        <Col xs={6}>
                          <button className="btn btn-primary" onClick={() => handleApply(organizationId)}>
                            Unirse
                          </button>
                          </Col>
                      </Row>
                    </Col>
                        )
                      )}

              </Row>
            </div>
          </Row>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default SocialProfile;
