"use client";

import React, { useState } from 'react';
import { Card, Button, Form, Col, Row, Table } from 'react-bootstrap';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const ProductTransactionPage = () => {
    const { data: user, isLoading, isError } = useRetrieveUserQuery();
    const [giverHQ, setGiverHQ] = useState("");
    const [receiverHQ, setReceiverHQ] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [sentProducts, setSentProducts] = useState([]);
    const [receivedProducts, setReceivedProducts] = useState([]); 
    const [availableProducts, setAvailableProducts] = useState([
        { name: 'Rice', units: 20, expiration: '16-01-2025', type: 'Food' },
        { name: 'Chocolate', units: 5, expiration: '01-04-2026', type: 'Food' },
        { name: 'Noodles', units: 12, expiration: '12-11-2025', type: 'Food' },
        { name: 'T-Shirts', units: 20, expiration: '-', type: 'Clothes' },
        { name: 'Pillows', units: 30, expiration: '-', type: 'Comfort' },
        { name: 'Jackets', units: 7, expiration: '-', type: 'Clothes' },
        { name: 'Shoes', units: 18, expiration: '-', type: 'Footwear' },
        { name: 'Milk', units: 58, expiration: '04-09-2027', type: 'Food' },
        { name: 'Sugar', units: 13, expiration: '19-03-2027', type: 'Food' },
        { name: 'Oil', units: 6, expiration: '11-12-2026', type: 'Food' },
        { name: 'Yerba Mate', units: 20, expiration: '-', type: 'Food' },
        { name: 'Soap', units: 15, expiration: '01-08-2025', type: 'Personal Care' },
        { name: 'Toothpaste', units: 25, expiration: '10-12-2026', type: 'Personal Care' },
        { name: 'Blankets', units: 12, expiration: '-', type: 'Comfort' },
        { name: 'Canned Beans', units: 40, expiration: '20-11-2024', type: 'Food' },
        { name: 'Shampoo', units: 30, expiration: '15-05-2026', type: 'Personal Care' },
    ]);

    const handleProductSelection = (product) => {
        const updatedProducts = [...availableProducts];
        const index = updatedProducts.findIndex(p => p.name === product.name);
    
        if (!updatedProducts[index].added && updatedProducts[index].units > 0) {
            updatedProducts[index] = { ...updatedProducts[index], added: true, quantityAdded: 1 };
            setSelectedProducts([...selectedProducts, updatedProducts[index]]);
        } else if (updatedProducts[index].units > updatedProducts[index].quantityAdded) {
            updatedProducts[index].quantityAdded += 1;
            setSelectedProducts(selectedProducts.map(p => p.name === product.name ? { ...p, quantityAdded: updatedProducts[index].quantityAdded } : p));
        }
    
        setAvailableProducts(updatedProducts);
    };
    const handleSendProducts = () => {
        // Verificar que los headquarters no sean los mismos
        if (giverHQ === receiverHQ) {
            toast.error("The Giver and Receiver headquarters cannot be the same.");
            return; // Detener el envío si los headquarters son iguales
        }
    
        // Verificar que los headquarters no estén vacíos y que haya productos seleccionados
        if (giverHQ && receiverHQ && selectedProducts.length > 0) {
            // Filtrar los productos con cantidad mayor que 0
            const validProductsToSend = selectedProducts.filter(product => product.quantityAdded > 0);
            
            if (validProductsToSend.length === 0) {
                toast.error("Cannot send products with zero quantity.");
                return; // Detener el envío si todos los productos tienen cantidad 0
            }
    
            const updatedProducts = availableProducts.map(product => {
                const selectedProduct = validProductsToSend.find(p => p.name === product.name);
                if (selectedProduct) {
                    product.units -= selectedProduct.quantityAdded;
                }
                return product;
            });
    
            // Eliminar productos con cantidad 0 de la lista de productos disponibles
            const productsWithStock = updatedProducts.filter(product => product.units > 0);
            setAvailableProducts(productsWithStock);
    
            // Actualizar los productos enviados y recibidos
            setSentProducts([...sentProducts, ...validProductsToSend]);
    
            const updatedReceivedProducts = [...receivedProducts];
            validProductsToSend.forEach((selectedProduct) => {
                const existingProduct = updatedReceivedProducts.find(
                    (p) => p.name === selectedProduct.name && p.expiration === selectedProduct.expiration
                );
                if (existingProduct) {
                    existingProduct.quantityAdded += selectedProduct.quantityAdded;
                } else {
                    updatedReceivedProducts.push({ ...selectedProduct });
                }
            });
            setReceivedProducts(updatedReceivedProducts);
    
            // Limpiar productos seleccionados
            setSelectedProducts([]);
            toast.success("Products sent successfully!");
        } else {
            toast.error("Please select a giver and receiver headquarters and at least one product.");
        }
    };
    const incrementQuantity = (product) => {
        const updatedProducts = [...availableProducts];
        const index = updatedProducts.findIndex(p => p.name === product.name);
        if (updatedProducts[index].quantityAdded < updatedProducts[index].units) {
            updatedProducts[index].quantityAdded += 1;
            setAvailableProducts(updatedProducts);
            setSelectedProducts(selectedProducts.map(p => p.name === product.name ? { ...p, quantityAdded: updatedProducts[index].quantityAdded } : p));
        }
    };

    const decrementQuantity = (product) => {
        const updatedProducts = [...availableProducts];
        const index = updatedProducts.findIndex(p => p.name === product.name);
    
        if (updatedProducts[index].quantityAdded > 0) {
            updatedProducts[index].quantityAdded -= 1;
    
            // Si la cantidad llega a 0, eliminamos el producto de la lista de seleccionados
            if (updatedProducts[index].quantityAdded === 0) {
                updatedProducts[index].added = false;
                setSelectedProducts(selectedProducts.filter(p => p.name !== updatedProducts[index].name));
            } else {
                // Actualizar solo si no es 0
                setSelectedProducts(selectedProducts.map(p => p.name === product.name ? { ...p, quantityAdded: updatedProducts[index].quantityAdded } : p));
            }
        }
    
        setAvailableProducts(updatedProducts);
    };
    
    const isProductSelected = (product) => {
        return selectedProducts.some(p => p.name === product.name);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading user data.</div>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Gestión de Recursos" subTitle="Transferir Productos" />
            <Row>
                <Col xs={1}></Col>
                <Col xs={4}>
                    <Form.Group>
                        <Form.Label>Giver Headquarter</Form.Label>
                        <Form.Control as="select" value={giverHQ} onChange={(e) => setGiverHQ(e.target.value)}>
                            <option>Choose Headquarter</option>
                            <option>HQ1</option>
                            <option>HQ2</option>
                        </Form.Control>
                    </Form.Group>

                    <Card className="mt-3">
                        <Card.Body>
                            <Table
                                hover
                                style={{
                                    border: 'none',
                                    borderCollapse: 'collapse',
                                    backgroundColor: 'transparent',
                                }}
                                className="table-borderless"
                            >
                                <tbody>
                                    {selectedProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.quantityAdded}</td>
                                            <td>{product.expiration}</td>
                                            <td>{product.type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Card className="mt-3">
                        <Card.Body>
                            <h5>Available Products</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Units</th>
                                        <th>Expiration</th>
                                        <th>Type</th>
                                        <th>Add</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {availableProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.units}</td>
                                            <td>{product.expiration}</td>
                                            <td>{product.type}</td>
                                            <td>
                                                {isProductSelected(product) ? (
                                                    <div>
                                                        <Button 
                                                            variant="secondary" 
                                                            onClick={() => decrementQuantity(product)}
                                                            style={{ 
                                                                marginRight: '5px', 
                                                                backgroundColor: 'transparent', 
                                                                borderColor: 'transparent',
                                                                color: 'inherit'
                                                            }}
                                                        >
                                                            -
                                                        </Button>
                                                        <span>{product.quantityAdded}</span>
                                                        <Button 
                                                            variant="secondary" 
                                                            onClick={() => incrementQuantity(product)}
                                                            style={{ 
                                                                marginLeft: '5px', 
                                                                backgroundColor: 'transparent', 
                                                                borderColor: 'transparent',
                                                                color: 'inherit'
                                                            }}
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button 
                                                        variant="primary" 
                                                        onClick={() => handleProductSelection(product)}
                                                    >
                                                        +
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={2} className="mx-auto">
                    <div className='d-flex justify-content-center'>
                        <Button variant="primary" onClick={handleSendProducts} className='mt-15+5'>Send ➔</Button>
                    </div>
                </Col>
                    <Col xs={4}>
                    <Form.Group>
                        <Form.Label>Receiver Headquarter</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={receiverHQ} 
                            onChange={(e) => {
                                setReceiverHQ(e.target.value);
                                setReceivedProducts([]);  // Limpiar productos recibidos al cambiar el headquarter
                            }}
                        >
                            <option>Choose Headquarter</option>
                            <option>HQ1</option>
                            <option>HQ2</option>
                        </Form.Control>
                    </Form.Group>

                        <Card className="mt-3">
                            <Card.Body>
                                <h5>Received Products</h5>
                                <Table striped bordered hover>
                                    <tbody>
                                        {receivedProducts.map((product, index) => (
                                            <tr key={index}>
                                                <td>{product.name}</td>
                                                <td>{product.quantityAdded}</td>
                                                <td>{product.expiration}</td>
                                                <td>{product.type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                <Col xs={1}></Col>
            </Row>
            <ToastContainer />
        </Layout>
    );
}

export default ProductTransactionPage;
