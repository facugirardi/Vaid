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
    // Buscar el segmento después de 'dashboard'
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      setOrganizationId(pathSegments[dashboardIndex + 1]);
    }
  }, []);


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
            
        <Tab.Pane eventKey="friendsRequest" id="friends" role="tabpanel" aria-labelledby="friends-tab">
          <Card>
            <Card.Header>
              <h5>Detalles</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-0 text-muted">Nombre de la Organización</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{organization ? organization.name : 'Cargando...'}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">País</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{organization ? organization.country : 'Cargando...'}</h6>
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
                  <h6 className="mb-0">{organization ? organization.description : 'Cargando...'}</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab.Pane>
    </React.Fragment>
  );
}

export default FriendsRequest;
