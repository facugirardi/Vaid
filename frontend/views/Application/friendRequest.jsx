import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const FriendsRequest = () => {
  const { data: user } = useRetrieveUserQuery();  
  const [userType, setUserType] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [error, setError] = useState(null);

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
          throw new Error('No se pudo obtener el estado de finalización');
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
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/person/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('La respuesta de la red no fue satisfactoria');
        }

        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        toast.error(`No se pudo obtener el usuario. Error: ${error.message}`);
      }
    };

    if (user && user.id && userType === 1) {
      fetchUserDetails();
    }
  }, [user, userType]);

  const fetchOrganization = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`http://localhost:8000/api/organization/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo obtener la organización');
        }

        const data = await response.json();
        setOrganization(data);
      } catch (error) {
        console.error('Ocurrió un error:', error);
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    if (user && userType === 2) {
      fetchOrganization();
    }
  }, [user, userType]);

  if (userType === 1 && (!user || !userDetails)) {
    return <p>Cargando...</p>;
  }

  if (userType === 2 && (!user || !organization)) {
    return <p>Cargando...</p>;
  }

  return (
    <React.Fragment>
      {userType === 1 ? (
        <Tab.Pane eventKey="friendsRequest" id="friends" role="tabpanel" aria-labelledby="friends-tab">
          <Card>
            <Card.Header>
              <h5>Detalles Personales</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-0 text-muted">Nombre Completo</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{user.first_name} {user.last_name}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">País</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails.person.country}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Teléfono</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{userDetails.person.phone_number}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Correo Electrónico</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0"><a href={`mailto:${user.email}`} className="link-primary">{user.email}</a></h6>
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
                  <h6 className="mb-0">{userDetails.person.description}</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab.Pane>
      ) : userType === 2 ? (
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
                  <h6 className="mb-0">{organization.country}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Correo Electrónico</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0"><a href={`mailto:${user.email}`} className="link-primary">{user.email}</a></h6>
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
      ) : (
        <p>Tipo de usuario no reconocido</p>
      )}
    </React.Fragment>
  );
}

export default FriendsRequest;
