"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Col, Row, Table, Container } from 'react-bootstrap';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './transfer.css';

const ProductTransactionPage = () => {
    const { data: user, isLoading, isError } = useRetrieveUserQuery();
    const [giverHQ, setGiverHQ] = useState("");
    const [receiverHQ, setReceiverHQ] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [sentProducts, setSentProducts] = useState([]);
    const [receivedProducts, setReceivedProducts] = useState([]); 
    const [headquarters, setHeadquarters] = useState([]); 
    const [organizationId, setOrganizationId] = useState("");
    const [availableProducts, setAvailableProducts] = useState([]);

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
        if (organizationId) {
            fetch(`http://localhost:8000/api/headquarters/${organizationId}`)
                .then(response => response.json())
                .then(data => setHeadquarters(data))
                .catch(error => console.error('Error:', error));
        }
    }, [organizationId]);

    useEffect(() => {
        if (giverHQ) {
            fetchProducts(giverHQ);
        } else {
            setAvailableProducts([]);
        }
    }, [giverHQ]);

    const fetchProducts = async (headquarterId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/headquarters/${headquarterId}/products`);
            const data = await response.json();
            const productsWithQuantity = data.map(product => ({
                ...product,
                quantityAdded: 0,
                added: false
            }));
            setAvailableProducts(productsWithQuantity);
        } catch (error) {
            toast.error('Error al obtener los productos:', error);
            setAvailableProducts([]);
        }
    };
    
    const handleProductSelection = (product) => {
        const updatedProducts = [...availableProducts];
        const index = updatedProducts.findIndex(p => p.Product.name === product.Product.name);
    
        // Si el producto no ha sido añadido y tiene unidades disponibles
        if (!updatedProducts[index].added && updatedProducts[index].cuantity > 0) {
            updatedProducts[index] = { ...updatedProducts[index], added: true, quantityAdded: 1 };
            setSelectedProducts([...selectedProducts, updatedProducts[index]]);
        } 
        // Si el producto ya fue añadido y la cantidad es menor a las unidades disponibles
        else if (updatedProducts[index].cuantity > updatedProducts[index].quantityAdded) {
            updatedProducts[index].quantityAdded += 1;
            setSelectedProducts(
                selectedProducts.map(p =>
                    p.Product.name === product.Product.name
                        ? { ...p, quantityAdded: updatedProducts[index].quantityAdded }
                        : p
                )
            );
        }
    
        setAvailableProducts(updatedProducts);
    };

    const handleSendProducts = async () => {
        if (giverHQ === receiverHQ) {
            toast.error("La sede de origen y la de destino no pueden ser la misma.");
            return;
        }
    
        if (giverHQ && receiverHQ && selectedProducts.length > 0) {
            const validProductsToSend = selectedProducts.filter(product => product.quantityAdded > 0);
    
            if (validProductsToSend.length === 0) {
                toast.error("No se pueden enviar productos con cantidad cero.");
                return;
            }
    
            try {
                // Realizar las solicitudes de transferencia para cada producto seleccionado
                for (const product of validProductsToSend) {
                    const response = await fetch(
                        `http://localhost:8000/api/organization/transferProduct?product_id=${product.Product.id}&headquarter1_id=${giverHQ}&headquarter2_id=${receiverHQ}&quantity=${product.quantityAdded}`, 
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        toast.error(`Error al transferir el producto ${product.Product.name}: ${errorData.error}`);
                        return;
                    }
                }
    
                // Actualizar los estados después de una transferencia exitosa
                const updatedProducts = availableProducts.map(product => {
                    const selectedProduct = validProductsToSend.find(p => p.Product.id === product.Product.id);
                    if (selectedProduct) {
                        product.cuantity -= selectedProduct.quantityAdded;
                        product.added = false;
                    }
                    return product;
                });
    
                const productsWithStock = updatedProducts.filter(product => product.cuantity > 0);
                setAvailableProducts(productsWithStock);
                setSentProducts([...sentProducts, ...validProductsToSend]);
    
                const updatedReceivedProducts = [...receivedProducts];
                validProductsToSend.forEach((selectedProduct) => {
                    const existingProduct = updatedReceivedProducts.find(
                        (p) => p.Product.id === selectedProduct.Product.id && p.Product.expDate === selectedProduct.Product.expDate
                    );
                    if (existingProduct) {
                        existingProduct.quantityAdded += selectedProduct.quantityAdded;
                    } else {
                        updatedReceivedProducts.push({ ...selectedProduct });
                    }
                });
                setReceivedProducts(updatedReceivedProducts);
                setSelectedProducts([]);
                toast.success("¡Productos enviados exitosamente!");
            } catch (error) {
                toast.error('Error al realizar la transferencia de productos.');
                console.error('Error al transferir productos:', error);
            }
        } else {
            toast.error("Por favor, selecciona una sede de origen, una sede de destino y al menos un producto.");
        }
    };


    const incrementQuantity = (product) => {
        const updatedProducts = [...availableProducts];
        const index = updatedProducts.findIndex(p => p.Product.name === product.Product.name);
        
        if (updatedProducts[index].quantityAdded < updatedProducts[index].cuantity) {
            updatedProducts[index].quantityAdded += 1;
    
            // Actualizar los productos seleccionados también
            setSelectedProducts(
                selectedProducts.map(p =>
                    p.Product.name === product.Product.name
                        ? { ...p, quantityAdded: updatedProducts[index].quantityAdded }
                        : p
                )
            );
    
            setAvailableProducts(updatedProducts);
        }
    };
    
    const decrementQuantity = (product) => {
        const updatedProducts = [...availableProducts];
        const index = updatedProducts.findIndex(p => p.Product.name === product.Product.name);
    
        if (updatedProducts[index].quantityAdded > 1) {
            updatedProducts[index].quantityAdded -= 1;
    
            // Actualizar los productos seleccionados también
            setSelectedProducts(
                selectedProducts.map(p =>
                    p.Product.name === product.Product.name
                        ? { ...p, quantityAdded: updatedProducts[index].quantityAdded }
                        : p
                )
            );
        } else {
            // Si la cantidad llega a 0, remover el producto de la lista de seleccionados
            updatedProducts[index].added = false;
            setSelectedProducts(
                selectedProducts.filter(p => p.Product.name !== updatedProducts[index].Product.name)
            );
        }
    
        setAvailableProducts(updatedProducts);
    };
        
    const isProductSelected = (product) => {
        return selectedProducts.some(p => p.Product.name === product.Product.name);
    };
    
    if (isLoading) return <div>Cargando...</div>;
    if (isError) return <div>Error al cargar los datos del usuario.</div>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Gestión de Recursos" subTitle="Transferir Productos" />
            <Container>
                <Row className="mt-4">
                    <Col xs={12} md={5}>
                        <Form.Group>
                            <Form.Label className='h5p'>Sede de Origen</Form.Label>
                            <Form.Control as="select" value={giverHQ} onChange={(e) => setGiverHQ(e.target.value)}>
                                <option>Seleccionar Sede</option>
                                {headquarters.map((hq) => (
                                    <option key={hq.id} value={hq.id}>
                                        {hq.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <h5 className='mt-30 h5p'>Productos Agregados</h5>

                        <Card className="cardtp1 mt-3">
                            
                            <Card.Body className='cbpt'>
                                <Table className="table-borderless">
                                    <tbody>
                                        {selectedProducts.map((product, index) => (
                                            <>
                                            <tr key={index} className='tr-pat'>
                                                <td className='text-cbpt'>{product.Product.name}</td>
                                                <td className='text-cbpt'>{product.quantityAdded}</td>
                                                <td className='text-cbpt'>{product.Product.expDate}</td>
                                                <td className='text-cbpt'>{product.Product.category_name}</td>
                                            </tr>
                                            </>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <h5 className='mt-30 h5p'>Productos Disponibles</h5>
                        <Card className="bx-none-s mt-3">
                            <Card.Body>
                                <div className="table-responsive">
                                    <Table hover className="table-borderless product-table">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Producto</th>
                                                <th className='text-center'>Unidades</th>
                                                <th className='text-center'>Expiración</th>
                                                <th className='text-center'>Tipo</th>
                                                <th className='text-center'>Agregar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableProducts.map((product, index) => (
                                                <tr key={index} className=''>
                                                    <td className='text-center'>{product.Product.name}</td>
                                                    <td className='text-center'>{product.cuantity}</td>
                                                    <td className='text-center'>{product.Product.expDate}</td>
                                                    <td className='text-center'>{product.Product.category_name}</td>
                                                    <td className='text-center'>
                                                        {isProductSelected(product) ? (
                                                            <div>
                                                                <Button 
                                                                    onClick={() => decrementQuantity(product)}
                                                                    className="icon-button btn btn-light btn-sm mx-1 icbtn1"
                                                                >
                                                                    <i className="ti ti-minus"></i>
                                                                </Button>
                                                                <span>{product.quantityAdded}</span>
                                                                <Button 
                                                                    onClick={() => incrementQuantity(product)}
                                                                    className="icon-button btn btn-light btn-sm mx-1 icbtn2"
                                                                >
                                                                    <i className="ti ti-plus"></i>
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => handleProductSelection(product)}
                                                                className="icon-button btn btn-light btn-sm mx-1"
                                                            >
                                                                <i className="ti ti-plus"></i>

                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} md={2} className="d-flex justify-content-center">
                        <Button variant="primary" onClick={handleSendProducts} className="mt-3 mt-md-0 btn-send-trf">
                            Enviar ➔
                        </Button>
                    </Col>

                    <Col xs={12} md={5}>
                        <Form.Group>
                            <Form.Label className='h5p'>Sede de Destino</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={receiverHQ} 
                                onChange={(e) => {
                                    setReceiverHQ(e.target.value);
                                    setReceivedProducts([]);
                                }}
                            >
                                <option>Seleccionar Sede</option>
                                {headquarters.map((hq) => (
                                    <option key={hq.id} value={hq.id}>
                                        {hq.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <h5 className='mt-30 h5p'>Productos Recibidos</h5>
                        <Card className="cardtp1 mt-3">
                            <Card.Body className='cbpt'>
                                <Table hover className="table-borderless">
                                    <tbody>
                                        {receivedProducts.map((product, index) => (
                                            <tr key={index} className='tr-pat'>
                                                <td className='text-cbpt'>{product.Product.name}</td>
                                                <td className='text-cbpt'>{product.quantityAdded}</td>
                                                <td className='text-cbpt'>{product.Product.expDate}</td>
                                                <td className='text-cbpt'>{product.Product.category_name}</td>
                                            </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </Layout>
    );
}

export default ProductTransactionPage;
