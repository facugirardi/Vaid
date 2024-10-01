import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import profileCover from "@/public/assets/images/backgrounds/counter.png";
import avatar from "@/public/assets/images/user/avatar-5.jpg";
import '@/app/dashboard/profile.css';

const SocialProfile = () => {
    const { data: user, isFetching } = useRetrieveUserQuery();
    const [avatar2, setImage] = useState(avatar);  // Estado para la imagen
    const [organization, setOrganization] = useState(null);
    const [userType, setUserType] = useState(null);
    const backendUrl = 'http://localhost:8000';  // URL del backend
    const inputFileRef = useRef(null);  // Referencia para el input file

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

    const fetchImage = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/retrieve-logo?user_id=${user.id}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.images.length > 0) {
                    const imageUrl = `${backendUrl}${data.images[0].image}`;
                    setImage(imageUrl);
                } else {
                    setImage(avatar);
                    toast.error('No se encontró ninguna imagen para el usuario especificado');
                }
            } else {
                toast.error('Error al obtener la imagen');
            }
        } catch (error) {
            toast.error('Error al obtener la imagen');
        }
    };

    useEffect(() => {
        if (!isFetching && user) {
            fetchImage();
        }
    }, [user]);

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
            }
        }
    };

    useEffect(() => {
        if (user && userType === 2) {
            fetchOrganization();
        }
    }, [user, userType]);

    // Manejar el clic en la imagen para abrir el input de archivo
    const handleImageClick = () => {
        inputFileRef.current.click();  // Simular el clic en el input de archivo
    };

    // Manejar el cambio de archivo y subir la nueva imagen
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user.id);

            try {
                const response = await fetch(`http://localhost:8000/api/upload-profile-image/`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    toast.success('Imagen de perfil actualizada');
                    setImage(data.image_url);  // Actualiza la imagen con la nueva URL
                } else {
                    toast.error('Error al actualizar la imagen de perfil');
                }
            } catch (error) {
                toast.error('Error al subir la imagen');
            }
        }
    };

    return (
        <React.Fragment>
            <Card className="social-profile">
                <Image src={profileCover} alt="" className="w-100 h-100 card-img-top" />
                <Card.Body className="pt-0">
                    <Row className="align-items-end">
                        <div className="col-md-auto text-md-start profilepic" onClick={handleImageClick}>
                            <Image
                                className="img-fluid img-profile-avtar changeimg profilepic__image"
                                src={avatar2}  // Mostrar la imagen actual
                                width={100}
                                height={100}
                                alt="Imagen del usuario"
                                onClick={handleImageClick}  // Al hacer clic, abrir el input
                                style={{ cursor: 'pointer' }}  // Añadir un estilo de cursor
                            />
                            <input
                                type="file"
                                ref={inputFileRef}  // Referencia para abrir el input desde el clic
                                style={{ display: 'none' }}  // Ocultar el input
                                onChange={handleFileChange}  // Manejar el cambio de archivo
                            />
                          <div class="profilepic__content" onClick={handleImageClick}>
                            <span class="profilepic__icon"><i class="fas ph-duotone ph-camera"></i></span>
                            <span class="profilepic__text">Edit Profile</span>
                          </div>
                        </div>
                        <div className="col">
                            <Row className="justify-content-between align-items-end">
                                <Col md={5} xl={6} className="soc-profile-data">
                                    {userType === 2 ? (
                                        <h5 className="mb-1">{organization ? organization.name : 'Cargando...'}</h5>
                                    ) : (
                                        <h5 className="mb-1">{user.first_name} {user.last_name}</h5>
                                    )}
                                    <p className="mb-0">‎<a href="#" className="link-primary"></a></p>
                                </Col>
                                <Col md={3} xl={2} xxl={2}>
                                    <Row className="g-1 text-center">
                                        <Col xs={12}>
                                            {userType === 2 ? (
                                                <a className="btn-dash-perf theme-btn style-two" href={`dashboard/${organization ? organization.id : ''}/home`}>Dashboard</a>
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
