import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const FriendsRequest = () => {
  const { data: user } = useRetrieveUserQuery();  
  const [userType, setUserType] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const [organizationId, setOrganizationId] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Obtener la URL actual
    const currentUrl = window.location.href;
    // Usar el constructor de URL para analizar la URL
    const url = new URL(currentUrl);
    // Dividir el pathname en segmentos
    const pathSegments = url.pathname.split('/');
    // Encontrar el segmento después de 'dashboard'
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      setOrganizationId(pathSegments[dashboardIndex + 1]);
    }
  }, []);
 
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
            push('/not-found');
            return;
          }
          if (!response.ok) {
            throw new Error('La respuesta de la red no fue satisfactoria');
          }

          const data = await response.json();
          console.log('Datos del usuario obtenidos:', data); // Registro de datos obtenidos
          setUserDetails(data);
        } catch (error) {
          toast.error(`Error al recuperar el usuario. Error: ${error.message}`);
        }
      }
    };

    if (organizationId) {
      fetchUserDetails();
      console.log(userDetails)
    }
  }, [organizationId]);


  return (
    <React.Fragment>
            
        <Tab.Pane eventKey="friendsRequest" id="friends" role="tabpanel" aria-labelledby="friends-tab">
          <Card>
            <Card.Header>
              <h5>Detalles</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-0 text-muted">Nombre</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">
                    {userDetails ? `${userDetails.user.first_name} ${userDetails.user.last_name}` : 'Cargando...'}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">País</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails ? userDetails.person.country : 'Cargando...'}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Correo Electrónico</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails ? userDetails.user.email : 'Cargando...'}</h6>
                </Col>
              </Row>

            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
              <h5>Otra Información</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-0 text-muted">Descripción</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails ? userDetails.person.description : 'Cargando...'}</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab.Pane>
    </React.Fragment>
  );
}

export default FriendsRequest;
