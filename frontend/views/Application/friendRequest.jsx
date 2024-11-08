import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tab, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const FriendsRequest = () => {
  const { data: user } = useRetrieveUserQuery();  
  const [userType, setUserType] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [editMode, setEditMode] = useState({});  // Para manejar el estado de edición
  const [editedValues, setEditedValues] = useState({});  // Para almacenar los valores editados
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

  const handleFieldChange = (field, value) => {
    setEditedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const savePersonDetails = async () => {
    try {
      const updatedData = {
        phone_number: editedValues.phone_number || userDetails?.person?.phone_number,
        description: editedValues.description || userDetails?.person?.description,
      };

      const response = await fetch(`http://localhost:8000/api/person/${user.id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar los cambios');
      }

      const updatedPerson = await response.json();
      
      setUserDetails((prev) => ({
        ...prev,
        person: {
          ...prev.person,
          ...updatedPerson,
        },
      }));

      toast.success('Detalles guardados exitosamente');
      setEditMode({});  // Salir del modo de edición
    } catch (error) {
      toast.error(`Error guardando los cambios: ${error.message}`);
    }
  };

  const saveOrganizationDescription = async () => {
    try {
      const updatedData = {
        description: editedValues.description || organization?.description,
      };

      const response = await fetch(`http://localhost:8000/api/organization/${organization.id}/update-description/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar los cambios');
      }

      const updatedOrganization = await response.json();
      
      setOrganization((prev) => ({
        ...prev,
        ...updatedOrganization,
      }));

      toast.success('Descripción de la organización guardada exitosamente');
      setEditMode({});  // Salir del modo de edición
    } catch (error) {
      toast.error(`Error guardando los cambios: ${error.message}`);
    }
  };

  useEffect(() => {
    if (user && userType === 2) {
      fetchOrganization();
    }
  }, [user, userType]);

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
                  <h6 className="mb-0">{userDetails?.person?.country}</h6>
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
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Teléfono</p>
                </Col>
                <Col md={6} className='col-10'>
                  {editMode.phone_number ? (
                    <Form.Control
                      type="text"
                      value={editedValues.phone_number || userDetails?.person?.phone_number || ''}
                      onChange={(e) => handleFieldChange('phone_number', e.target.value)}
                    />
                  ) : (
                    <h6 className="mb-0">{userDetails?.person?.phone_number}</h6>
                  )}
                </Col>
                <Col md={2} className='col-2'>
                 <FontAwesomeIcon
                    icon={editMode.phone_number ? faCheckCircle : faPencilAlt}
                    onClick={editMode.phone_number ? savePersonDetails : () => toggleEditMode('phone_number')}
                    style={{ cursor: 'pointer' }}
                  />
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Descripción</p>
                </Col>
                <Col md={6} className='col-10'>
                  {editMode.description ? (
                    <Form.Control
                      as="textarea"
                      value={editedValues.description || userDetails?.person?.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                  ) : (
                    <h6 className="mb-0">{userDetails?.person?.description}</h6>
                  )}
                </Col>
                <Col md={2} className='col-2'>
                  <FontAwesomeIcon
                    icon={editMode.description ? faCheckCircle : faPencilAlt}
                    onClick={editMode.description ? savePersonDetails : () => toggleEditMode('description')}
                    style={{ cursor: 'pointer' }}
                  />
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
                  <h6 className="mb-0">{organization?.name}</h6>
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
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">País</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{organization?.country}</h6>
                </Col>
              </Row>

              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Descripción</p>
                </Col>
                <Col md={6} className='col-10'>
                  {editMode.description ? (
                    <Form.Control
                      as="textarea"
                      value={editedValues.description || organization?.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                  ) : (
                    <h6 className="mb-0">{organization?.description}</h6>
                  )}
                </Col>
                <Col md={2} className='col-2'>
                  <FontAwesomeIcon
                    icon={editMode.description ? faCheckCircle : faPencilAlt}
                    onClick={editMode.description ? saveOrganizationDescription : () => toggleEditMode('description')}
                    style={{ cursor: 'pointer' }}
                  />
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
};

export default FriendsRequest;
