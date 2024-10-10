'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { Card, Button, Form, Col, Row } from 'react-bootstrap';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import FeatherIcon from "feather-icons-react";
import './create.css';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';  // Importamos react-select

const CreateTaskPage = () => {
    const { data: user, isLoading, isError } = useRetrieveUserQuery();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        endDate: '',
        time: '',
        endTime: '',
        file: null,
        state: 'Pendiente',
        category: [] // Cambiado para manejar múltiples categorías
    });
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [organizationId, setOrganizationId] = useState("");
    const [categories, setCategories] = useState([]); // Estado para guardar las categorías de la organización

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            if (organizationId) {
                try {
                    const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/tags/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    const options = data.map(category => ({ value: category.id, label: category.name }));
                    setCategories(options); // Guardar las etiquetas en el estado
                } catch (error) {
                    console.error('Error al obtener las categorías:', error);
                }
            }
        };

        fetchCategories();
    }, [organizationId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryChange = (selectedOptions) => {
        // Verificar si la opción "Todas" está seleccionada
        const allSelected = selectedOptions && selectedOptions.some(option => option.value === 'all');
        if (allSelected) {
            // Si "Todas" está seleccionada, sólo mantener esa opción
            setFormData({
                ...formData,
                category: ['all']
            });
        } else {
            // Si no está seleccionada "Todas", almacenar las otras categorías
            setFormData({
                ...formData,
                category: selectedOptions ? selectedOptions.map(option => option.value) : []
            });
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFormData({
                ...formData,
                file: event.target.files[0],
            });
            setPreview(URL.createObjectURL(event.target.files[0]));
        } else {
            setFormData({
                ...formData,
                file: null,
            });
            setPreview(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { name, description, date, endDate, time, endTime, file, state, category } = formData;
        const newErrors = {};

        if (!name) newErrors.name = 'El nombre es obligatorio';
        if (!description) newErrors.description = 'La descripción es obligatoria';
        if (!date) newErrors.date = 'La fecha es obligatoria';
        if (!time) newErrors.time = 'La hora de inicio es obligatoria';
        if (!endDate) newErrors.endDate = 'La fecha de fin es obligatoria';
        if (!endTime) newErrors.endTime = 'La hora de fin es obligatoria';
        if (category.length === 0) newErrors.category = 'La categoría es obligatoria'; // Validación de categoría

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = new FormData();
        data.append('name', name);
        data.append('description', description);
        data.append('date', date); // Solo la fecha
        data.append('time', time);
        data.append('endTime', endTime);
        data.append('endDate', endDate); // Solo la fecha
        data.append('category', category); // Agregar categorías seleccionadas
        if (file) {
            data.append('file', file);
        }
        data.append('state', state);

        try {
            const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/tasks/`, {
                method: 'POST',
                headers: {},
                body: data,
            });

            if (!response.ok) {
                const responseData = await response.json();
                console.error('Error al crear la tarea:', responseData);
                setErrors(responseData);
            } else {
                toast.success('¡Tarea creada con éxito!');
                setFormData({
                    name: '',
                    description: '',
                    date: '',
                    time: '',
                    endTime: '',
                    endDate: '',
                    file: null,
                    state: 'Pendiente',
                    category: []  // Reiniciar la categoría seleccionada
                });
                setPreview(null);
                setErrors({});
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    if (isLoading) return <p>Cargando...</p>;
    if (isError || !user) return <p>Error al cargar los datos del usuario.</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Tareas" subTitle="Tarea" />
            <Row>
                <Card>
                    <div id="sticky-action" className="sticky-action">
                        <Card.Header>
                            <Row className="align-items-center">
                                <Col sm={6}>
                                    <h4>Crear Tarea</h4>
                                </Col>
                            </Row>
                        </Card.Header>
                    </div>

                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col md={4} className="d-flex flex-column align-items-center">
                                    <label htmlFor="upload-button" className="upload-button">
                                        {preview ? (
                                            <img src={preview} alt="Vista previa" className="preview-img" />
                                        ) : (
                                            <div className="icon-container">
                                                <FeatherIcon icon="upload" />
                                            </div>
                                        )}
                                        <input
                                            id="upload-button"
                                            type="file"
                                            name="file"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </Col>
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label className="form-group-label">Título <span className='asterisco-rojo'>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Ingrese un título"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <small className="text-danger">{errors.name}</small>}
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label className="form-group-label">Descripción <span className='asterisco-rojo'>*</span></Form.Label>
                                        <Form.Control
                                            className="textarea-task"
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            placeholder="Ingrese una descripción"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        {errors.description && <small className="text-danger">{errors.description}</small>}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Label className="form-label-2">Etiqueta <span className='asterisco-rojo'>*</span></Form.Label>
                                <Select
                                    name="category"
                                    options={[
                                        { value: 'all', label: 'Todas' },  // Opción fija "Todas"
                                        ...categories,  // Resto de las categorías dinámicas
                                    ]}
                                    isMulti
                                    onChange={handleCategoryChange}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isClearable
                                />
                                {errors.category && <small className="text-danger">{errors.category}</small>}
                            </Form.Group>
                            <Row className="form-group-2">
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Fecha de inicio <span className='asterisco-rojo'>*</span></Form.Label>
                                    <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
                                    {errors.date && <small className="text-danger">{errors.date}</small>}
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Fecha de fin <span className='asterisco-rojo'>*</span></Form.Label>
                                    <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                                    {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Hora de inicio <span className='asterisco-rojo'>*</span></Form.Label>
                                    <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} />
                                    {errors.time && <small className="text-danger">{errors.time}</small>}
                                </Col>
                                <Col sm={6} md={3}>
                                    <Form.Label className="form-label-2">Hora de fin <span className='asterisco-rojo'>*</span></Form.Label>
                                    <Form.Control type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
                                    {errors.endTime && <small className="text-danger">{errors.endTime}</small>}
                                </Col>
                            </Row>
                            <div className='d-flex justify-content-center mt-50'>
                                <Button variant="success" type="submit" className="botontask submit-task">
                                    Enviar
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </Layout>
    );
};

export default CreateTaskPage;
