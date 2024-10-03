"use client";

import React, { useState, useEffect } from 'react';
import './donation.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Form, Col, Row } from 'react-bootstrap';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [organizationId, setOrganizationId] = useState("");

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
    fetchDonations();
  }, [organizationId]);

  const fetchDonations = async () => {
    if (organizationId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/donations/`, {
          params: {
            org_id: organizationId
          }
        });
        setDonations(response.data);
      } catch (error) {
        console.error('Error al obtener las donaciones:', error);
      }
    }
  };
  
  const deleteDonation = async (donationId) => {
    try {
        await axios.delete('http://localhost:8000/api/donation/detail/', {
            params: {
                org_id: organizationId,
                donation_id: donationId
            }
        });
        setDonations(donations.filter(item => item.id !== donationId));
        handleDeleteProductModalClose();
    } catch (error) {
        console.error('Error al eliminar la donación:', error);
    }
};

  const handleInventoryModalClose = () => setShowInventoryModal(false);
  const handleInventoryModalShow = () => setShowInventoryModal(true);

  const handleProductModalShow = (product) => {
    setSelectedProduct(product);
    console.log(selectedProduct)
    setShowProductModal(true);
  };

  const handleProductModalClose = () => setShowProductModal(false);

  const handleDeleteProductModalShow = (product) => {
    setSelectedProduct(product);
    setShowDeleteProductModal(true);
  };

  const handleDeleteProductModalClose = () => setShowDeleteProductModal(false);

  const handleAddDonation = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
  
    const donationData = {
      description: formData.get('description'),
      date: formData.get('expDate'),
      type: formData.get('Category'),
      quantity: formData.get('quantity')
    };
  
    try {
      await axios.post(`http://localhost:8000/api/donations/`, donationData, {
        params: {
          org_id: organizationId,
        },
      });
      fetchDonations(); 
      handleInventoryModalClose();
    } catch (error) {
      console.error('Error al agregar la donación:', error);
    }
  };
  
  return (
    <div className="card">
      <h2>Donaciones</h2>
      {donations.length === 0 ? (
        <>
          <br />
          <p>No se encontraron registros.</p>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th className='text-center'>Descripción</th>
                <th className='text-center'>Unidades</th>
                <th className='text-center'>Fecha</th>
                <th className='text-center'>Categoría</th>
                <th className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(item => (
                <tr key={item.id}>
                  <td className='text-center p-donation'><b>{item.description}</b></td>
                  <td className="text-center p-donation">
                    {item.type === "Dinero" ? `$ ${item.quantity}` : item.quantity}
                  </td>
                  <td className='text-center p-donation'><b>{item.date}</b></td>
                  <td
                    className="text-center p-donation"
                    style={{
                      color:
                        item.type === "Comida"
                          ? "#795548"
                          : item.type === "Herramientas"
                          ? "#2196F3"
                          : item.type === "Bebidas"
                          ? "#FF9800"
                          : item.type === "Dinero"
                          ? "#2BC155"
                          : item.type === "Otro"
                          ? "#9E9E9E"
                          : item.type === "Medicamentos"
                          ? "#FF3E3E"
                          : item.type === "Ropa"
                          ? "#9C27B0"
                          : "inherit", 
                    }}
                  >
                    {item.type}
                  </td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item)}>
                      <i className='ph-duotone ph-eye hover-button'></i>
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.id)}>
                      <i className='ph-duotone ph-trash hover-button-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      )}
        
      {/* Modal para agregar inventario */}
      <Modal show={showInventoryModal} onHide={handleInventoryModalClose} backdropClassName="modal-backdrop" centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Donación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddDonation}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="productName" className="form-label">Descripción</label>
                  <input type="text" className="form-control" id="description" name="description" placeholder='Agregar Nombre' required />
                </div>
                <div className="mb-3 col-md-3">
                <label htmlFor="productType" className="form-label">Tipo</label>
                  <Form.Control as="select" className="form-select" id="Category" name="Category">
                                    <option>Ropa</option>
                                    <option>Comida</option>
                                    <option>Bebidas</option>
                                    <option>Medicamentos</option>
                                    <option>Herramientas</option>
                                    <option>Otro</option>
                                    <option>Dinero</option>
                  </Form.Control>
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Cantidad</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="expDate" className="form-label">Fecha</label>
                  <input type="date" className="form-control" id="expDate" name="expDate" />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='col-md-3 mt-40'>
                  Agregar Donación
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal de detalles del producto */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Donación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedProduct && (
          <div>
            <p><strong>Descripción:</strong> {selectedProduct.description}</p>
            <p><strong>Fecha:</strong> {selectedProduct.date}</p>
            <p><strong>Cantidad:</strong> {selectedProduct.quantity}</p>
            <p><strong>Tipo:</strong> {selectedProduct.type}</p>
          </div>
        )}
      </Modal.Body>
      </Modal>

      {/* Modal para eliminar producto */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Donación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar esta donación?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => deleteDonation(selectedProduct)}>
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const BuySell = () => {
  const [buysell, setBuysell] = useState([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [organizationId, setOrganizationId] = useState("");

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
    fetchBuySell();
  }, [organizationId]);

  const fetchBuySell = async () => {
    if (organizationId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/organization/${organizationId}/operation`, {
        });
        setBuysell(response.data);
      } catch (error) {
        console.error('Error al obtener las operaciones de compra/venta:', error);
      }
    }
  };

  const deleteBuySell = async (buySellId) => {
    try {
      await axios.delete(`/api/buysell/${buySellId}`);
      setBuysell(buysell.filter(item => item.id !== buySellId));
      handleDeleteProductModalClose();
    } catch (error) {
      console.error('Error al eliminar compra/venta:', error);
    }
  };

  const handleInventoryModalClose = () => setShowInventoryModal(false);
  const handleInventoryModalShow = () => setShowInventoryModal(true);

  const handleProductModalShow = (product) => {
    setSelectedProduct(product);
    console.log(product)
    setShowProductModal(true);
  };

  const handleProductModalClose = () => setShowProductModal(false);

  const handleDeleteProductModalShow = (product) => {
    setSelectedProduct(product);
    setShowDeleteProductModal(true);
  };

  const handleDeleteProductModalClose = () => setShowDeleteProductModal(false);

  const handleAddOperation = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
  
    const operationData = {
      description: formData.get('description'),
      date: formData.get('date'),
      type: formData.get('type'),
      quantity: formData.get('quantity'),
      amount: formData.get('amount'),
    };
  
    try {
      await axios.post(`http://localhost:8000/api/organization/${organizationId}/operation/`, operationData);
      fetchBuySell(); 
      handleInventoryModalClose();
    } catch (error) {
      console.error('Error al agregar la operación:', error);
    }
  };
  
  const handleDeleteOperation = async (operationId) => {
    try {
      await axios.delete(`http://localhost:8000/api/organization/${organizationId}/operation/${operationId}/`);
      setBuysell(buysell.filter(item => item.id !== operationId));
      handleDeleteProductModalClose();
    } catch (error) {
      console.error('Error al eliminar la operación:', error);
    }
  };
  
  return (
    <div className="card">
      <h2>Compra/Venta</h2>
      {buysell.length === 0 ? (
        <>
          <br />
          <p>No se encontraron registros.</p>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th className='text-center'>Nombre</th>
                <th className='text-center'>Unidades</th>
                <th className='text-center'>Monto</th>
                <th className='text-center'>Fecha</th>
                <th className='text-center'>Operación</th>
                <th className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {buysell.map(item => (
                <tr key={item.id}>
                  <td className='text-center p-donation'><b>{item.description}</b></td>
                  <td className='text-center p-donation'>{item.quantity}</td>
                  <td className='text-center p-donation'>$ {item.amount}</td>
                  <td className='text-center p-donation'><b>{item.date}</b></td>
                  <td className={`text-center p-donation ${item.type === 'Compra' ? 'text-green' : 'text-red'}`}>
                    {item.type === 'Compra' ? (
                      <>
                        <i className="fa fa-arrow-up text-green"></i> {item.type}
                      </>
                    ) : (
                      <>
                        <i className="fa fa-arrow-down text-red"></i> {item.type}
                      </>
                    )}
                  </td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item)}>
                      <i className='ph-duotone ph-eye hover-button'></i>
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item)}>
                      <i className='ph-duotone ph-trash hover-button-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      )}

      {/* Modal para agregar inventario */}
      <Modal show={showInventoryModal} onHide={handleInventoryModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Operación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddOperation}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-8">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <input type="text" className="form-control" id="description" name="description" placeholder='Nombre del Producto' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Cantidad</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Monto Total</label>
                  <input type="number" className="form-control" id="amount" name="amount" placeholder='$ 1' required />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="date" className="form-label">Fecha</label>
                  <input type="date" className="form-control" id="date" name="date" required/>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="type" className="form-label">Tipo de Operación</label>
                  <Form.Control as="select" className="form-select" name="type">
                                    <option>Compra</option>
                                    <option>Venta</option>
                  </Form.Control>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='mt-10'>
                  Agregar Operación
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal de detalles del producto */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Operación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p><strong>Descripción:</strong> {selectedProduct.description}</p>
              <p><strong>Cantidad:</strong> {selectedProduct.quantity}</p>
              <p><strong>Monto:</strong> {selectedProduct.amount}</p>
              <p><strong>Fecha:</strong> {selectedProduct.date}</p>
              <p><strong>Tipo:</strong> {selectedProduct.type}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para eliminar producto */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Operación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar esta operación?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => handleDeleteOperation(selectedProduct.id)}>
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const Page = () => {
  return (
    <Layout>
      <BreadcrumbItem mainTitle="Gestión de Recursos" subTitle="Operaciones" />
      <div className="container both-cont">
        <div className='row'>
          <div className="col-md-6">
            <Donations />
          </div>
          <div className="col-md-6">
            <BuySell />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
