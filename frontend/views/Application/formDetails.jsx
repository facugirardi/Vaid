import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const FormDetails = () => {
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


const daysMap = {
  "Sun": "Domingo",
  "Mon": "Lunes",
  "Tue": "Martes",
  "Wed": "Miércoles",
  "Thu": "Jueves",
  "Fri": "Viernes",
  "Sat": "Sábado"
};

const translateDays = (daysString) => {
  // Si el valor es null o undefined, devolver "No hay información"
  if (!daysString) {
    return "No hay información";
  }

  // Si el valor es un array, no necesitamos usar split
  if (Array.isArray(daysString)) {
    return daysString
      .map(day => daysMap[day.trim()] || day.trim())
      .join(', ');
  }

  // Si no es un string, convertir a string
  if (typeof daysString !== 'string') {
    daysString = String(daysString);
  }

  // Ahora que tenemos una cadena, separar los días por comas
  const daysArray = daysString.split(',');
  const translatedDays = daysArray.map(day => daysMap[day.trim()] || day.trim()); // Si no encuentra el día, mostrar el valor original
  return translatedDays.join(', ');
};

  useEffect(() => {
    if (user && userType === 2) {
      fetchOrganization();
    }
  }, [user, userType]);

const displayField = (field) => {
  if (field === null || field === undefined) {
    return 'No hay información';
  }

  // Convertir el valor a string si no lo es y luego aplicar trim()
  const fieldStr = String(field);
  return fieldStr.trim() !== '' ? fieldStr : 'No hay información';
};

  if (userType === 1 && (!user || !userDetails)) {
    return <p>Cargando...</p>;
  }

  if (userType === 2 && (!user || !organization)) {
    return <p>Cargando...</p>;
  }

const timeMap = {
  "Morning": "Mañana",
  "Afternoon": "Tarde",
  "Night": "Noche"
};

const modalityMap = {
  "Both types": "Ambos Tipos (Presencial y Virtual)",
  "In-person": "Presencial",
};

// Función para traducir los horarios
const translateTimes = (timesString) => {
  if (!timesString) {
    return "No hay información";
  }

  // Si el valor es un array, mapear directamente
  if (Array.isArray(timesString)) {
    return timesString.map(time => timeMap[time.trim()] || time.trim()).join(', ');
  }

  // Convertir a string si no lo es, y luego usar split()
  if (typeof timesString !== 'string') {
    timesString = String(timesString);
  }

  // Separar los tiempos por comas y traducir cada uno
  const timesArray = timesString.split(',');
  const translatedTimes = timesArray.map(time => timeMap[time.trim()] || time.trim());
  return translatedTimes.join(', ');
};

// Función para traducir las modalidades
const translateModality = (modalityString) => {
  return modalityString && modalityString.trim() !== ""
    ? (modalityMap[modalityString.trim()] || modalityString.trim())
    : "No hay información";
};
  return (
    <React.Fragment>
      {userType === 1 ? (
        <Tab.Pane eventKey="form" id="friends" role="tabpanel" aria-labelledby="friends-tab">
              <Card>
            <Card.Body>
              <Row className="g-3 mt-0 ">
                <Col md={12} className='d-flex justify-content-center'>
                  <button className="theme-btn style-two btn-actualizar" onClick={() => window.location.href = '/complete/form'}>
                    Actualizar Formulario</button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header>
            <h5>Detalles</h5>
            </Card.Header>
            <Card.Body>

              <Row className="g-3">
                <Col md={4}>
                  <p className="mb-0 text-muted">Dias Disponibles</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{translateDays(userDetails.person.available_days)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Horarios Disponibles</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{translateTimes(userDetails.person.available_times)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Modalidad</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{translateModality(userDetails.person.modality)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Temas de Interés</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(userDetails.person.topics)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Objetivos</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(userDetails.person.goals)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Motivaciones</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(userDetails.person.motivations)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Experiencia</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(userDetails.person.experience)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Ocupación</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(userDetails.person.profession)}</h6>
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
                  <p className="mb-0 text-muted">Ciudad</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(userDetails.person.city)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Calle</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(userDetails.person.street_name)} {displayField(userDetails.person.street_number)}</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab.Pane>
      ) : userType === 2 ? (
        <Tab.Pane eventKey="form" id="friends" role="tabpanel" aria-labelledby="friends-tab">
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
                  <h6 className="mb-0">{displayField(organization ? organization.name : 'Cargando...')}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">País</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">{displayField(organization.country)}</h6>
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Correo Electrónico</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0"><a href={`mailto:${user.email}`} className="link-primary">{displayField(user.email)}</a></h6>
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
                  <h6 className="mb-0">{displayField(organization ? organization.description : 'Cargando...')}</h6>
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

export default FormDetails;
