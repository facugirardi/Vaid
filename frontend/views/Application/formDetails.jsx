import React, { useState, useEffect } from "react";
import { Card, Col, Row, Tab, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const FormDetails = () => {
  const { data: user } = useRetrieveUserQuery();  
  const [userType, setUserType] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editedValues, setEditedValues] = useState({});
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

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleFieldChange = (field, value, isCheckbox = false) => {
    if (isCheckbox) {
      setEditedValues((prev) => ({
        ...prev,
        [field]: prev[field]?.includes(value)
          ? prev[field].filter(item => item !== value)
          : [...(prev[field] || []), value],
      }));
    } else {
      setEditedValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const saveChanges = async (field) => {
    try {
      // Enviar todos los campos, asegurando que los valores no editados permanezcan sin cambios.
      const updatedData = {
        dateOfBirth: editedValues.dateOfBirth || userDetails?.person?.dateOfBirth,  // Si no está editado, toma el valor original
        profession: editedValues.profession || userDetails?.person?.profession,
        experience: editedValues.experience || userDetails?.person?.experience,
        street: editedValues.street_name || userDetails?.person?.street_name,
        city: editedValues.city || userDetails?.person?.city,
        availableDays: editedValues.available_days || userDetails?.person?.available_days,
        availableTimes: editedValues.available_times || userDetails?.person?.available_times,
        modality: editedValues.modality || userDetails?.person?.modality,
        topics: editedValues.topics || userDetails?.person?.topics,
        goals: editedValues.goals || userDetails?.person?.goals,
        motivations: editedValues.motivations || userDetails?.person?.motivations,
      };
  
      const response = await fetch(`http://localhost:8000/api/user/form/${user.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('No se pudo guardar los cambios');
      }
  
      const updatedUserDetails = await response.json();
  
      // Actualiza el estado local con los nuevos datos del backend
      setUserDetails((prev) => ({
        ...prev,
        person: {
          ...prev.person,
          ...updatedData, // Aquí actualizamos los campos editados en el estado local
        },
      }));
  
      // Reiniciar el modo de edición para este campo
      setEditMode((prev) => ({
        ...prev,
        [field]: false,  // Esto desactiva el modo de edición para el campo específico
      }));
  
      toast.success('Cambios guardados exitosamente');
    } catch (error) {
      toast.error(`Error guardando los cambios: ${error.message}`);
    }
  };

  const displayField = (field, fieldName, type = 'text') => {
    if (editMode[fieldName]) {
      if (type === 'selectDays') {
        const daysOptions = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        return (
          <Form.Group>
            {daysOptions.map((day) => (
              <Form.Check
                key={day}
                inline
                className="small-checkbox label-checkbox"
                type="checkbox"
                label={day}
                checked={editedValues.available_days?.includes(day)}
                onChange={(e) => handleFieldChange('available_days', day, true)}
              />
            ))}
          </Form.Group>
        );
      }

      if (type === 'selectModality') {
        return (
          <Form.Control
            as="select"
            value={editedValues.modality || userDetails?.person?.modality}
            onChange={(e) => handleFieldChange('modality', e.target.value)}
          >
            <option value="Virtual">Virtual</option>
            <option value="Presencial">Presencial</option>
            <option value="Ambos">Ambos</option>
          </Form.Control>
        );
      }

      if (type === 'selectTimes') {
        const timeOptions = ['Mañana', 'Tarde', 'Noche'];
        return (
          <Form.Group>
            {timeOptions.map((time) => (
              <Form.Check
                key={time}
                inline
                type="checkbox"
                className="small-checkbox label-checkbox"
                label={time}
                checked={editedValues.available_times?.includes(time)}
                onChange={(e) => handleFieldChange('available_times', time, true)}
              />
            ))}
          </Form.Group>
        );
      }

      return (
        <Form.Control
          type="text"
          value={editedValues[fieldName] || field}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
        />
      );
    }

    const fieldStr = String(field || 'No hay información').trim();
    return fieldStr !== '' ? fieldStr : 'No hay información';
  };

  const renderIcon = (field) => {
    if (editMode[field]) {
      return (
        <FontAwesomeIcon
          icon={faCheckCircle}
          onClick={() => saveChanges(field)} // Guarda los cambios cuando haces clic en el tick
          style={{ cursor: 'pointer'}}
        />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faPencilAlt}
          onClick={() => toggleEditMode(field)}
          style={{ cursor: 'pointer' }}
        />
      );
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
        <Tab.Pane eventKey="form" id="friends" role="tabpanel" aria-labelledby="friends-tab">
          <Card>
            <Card.Body>
              <Row className="g-3 mt-0 ">
                <Col md={12} className='d-flex justify-content-center'>
                  <button className="theme-btn style-two btn-actualizar" onClick={() => window.location.href = '/complete/form'}>
                    Ir al Formulario
                  </button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          {userDetails?.user?.is_form === true ? 
          (
          <>
          <Card>
            <Card.Header>
              <h5>Detalles</h5>
            </Card.Header>
            <Card.Body>
              {[
                { label: "Dias Disponibles", field: 'available_days', display: displayField(userDetails?.person?.available_days, 'available_days', 'selectDays') },
                { label: "Horarios Disponibles", field: 'available_times', display: displayField(userDetails?.person?.available_times, 'available_times', 'selectTimes') },
                { label: "Modalidad", field: 'modality', display: displayField(userDetails?.person?.modality, 'modality', 'selectModality') },
                { label: "Que te gusta hacer", field: 'topics', display: displayField(userDetails?.person?.topics, 'topics') },
                { label: "Objetivos", field: 'goals', display: displayField(userDetails?.person?.goals, 'goals') },
                { label: "Motivaciones", field: 'motivations', display: displayField(userDetails?.person?.motivations, 'motivations') },
                { label: "Experiencia", field: 'experience', display: displayField(userDetails?.person?.experience, 'experience') },
                { label: "Ocupación", field: 'profession', display: displayField(userDetails?.person?.profession, 'profession') },
              ].map(({ label, field, display }) => (
                <Row className="g-3 mt-0" key={field}>
                  <Col md={4}>
                    <p className="mb-0 text-muted">{label}</p>
                  </Col>
                  <Col md={6}>
                    <h6 className="mb-0">{display}</h6>
                  </Col>
                  <Col md={2}>
                    {renderIcon(field)}
                  </Col>
                </Row>
              ))}
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
                  <h6 className="mb-0">{displayField(userDetails?.person?.city, 'city')}</h6>
                </Col>
                <Col md={2}>
                  {renderIcon('city')}
                </Col>
              </Row>
              <Row className="g-3 mt-0">
                <Col md={4}>
                  <p className="mb-0 text-muted">Calle</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-0">
                    {displayField(userDetails?.person?.street_name, 'street_name')}
                  </h6>
                </Col>
                <Col md={2}>
                  {renderIcon('street_name')}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          </> ) : <></>
      }
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
                  <h6 className="mb-0">{displayField(organization?.name, 'name')}</h6>
                </Col>
                <Col md={2}>
                  {renderIcon('name')}
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
                  <h6 className="mb-0">{organization.country}</h6>
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

export default FormDetails;
