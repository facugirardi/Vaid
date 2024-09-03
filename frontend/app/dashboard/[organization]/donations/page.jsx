"use client";

import React, { useState, useEffect } from 'react';
import './donation.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import {Form, Col, Row } from 'react-bootstrap';

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
        console.error('Error fetching donations:', error);
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
        console.error('Error deleting donation:', error);
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
      console.error('Error adding donation:', error);
    }
  };
  
  return (
    <div className="card">
      <h2>Donations</h2>
      {donations.length === 0 ? (
        <>
          <br />
          <p>No record found.</p>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th className='text-center'>Description</th>
                <th className='text-center'>Units</th>
                <th className='text-center'>Date</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(item => (
                <tr key={item.id}>
                  <td className='text-center p-donation'>{item.description}</td>
                  <td className='text-center p-donation'>{item.quantity}</td>
                  <td className='text-center p-donation'>{item.date}</td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item)}>
                      <FontAwesomeIcon icon={faEye} className='hover-button' />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.id)}>
                      <FontAwesomeIcon icon={faTrash} className='hover-button-trash' />
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

      {/* Add Inventory Modal */}
      <Modal show={showInventoryModal} onHide={handleInventoryModalClose} backdropClassName="modal-backdrop" centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Add Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddDonation}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="productName" className="form-label">Donation Description</label>
                  <input type="text" className="form-control" id="description" name="description" placeholder='Add Description' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="productType" className="form-label">Type</label>
                  <input type="text" className="form-control" id="Category" name="Category" placeholder='Product Type' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Quantity / Amount</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="expDate" className="form-label">Date</label>
                  <input type="date" className="form-control" id="expDate" name="expDate" />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='col-md-3 mt-40'>
                  Add Donation
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Product Details Modal */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Donation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedProduct && (
          <div>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Date:</strong> {selectedProduct.date}</p>
            <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
          </div>
        )}
      </Modal.Body>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Delete Donation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the donation?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteDonation(selectedProduct)}>
              Delete
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
        console.error('Error fetching donations:', error);
      }
    }
  };

  const deleteBuySell = async (buySellId) => {
    try {
      await axios.delete(`/api/buysell/${buySellId}`); // URL del endpoint para eliminar compra/venta
      setBuysell(buysell.filter(item => item.id !== buySellId));
      handleDeleteProductModalClose();
    } catch (error) {
      console.error('Error deleting buy/sell:', error);
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
      fetchBuySell(); // Refrescar la lista de operaciones
      handleInventoryModalClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error adding operation:', error);
    }
  };
  
  const handleDeleteOperation = async (operationId) => {
    try {
      await axios.delete(`http://localhost:8000/api/organization/${organizationId}/operation/${operationId}/`);
      setBuysell(buysell.filter(item => item.id !== operationId)); // Actualizar la lista de operaciones en el estado
      handleDeleteProductModalClose(); // Cerrar el modal de confirmación
    } catch (error) {
      console.error('Error deleting operation:', error);
    }
  };
  
  return (
    <div className="card">
      <h2>Buy/Sell</h2>
      {buysell.length === 0 ? (
        <>
          <br />
          <p>No record found.</p>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th className='text-center'>Name</th>
                <th className='text-center'>Units</th>
                <th className='text-center'>Amount</th>
                <th className='text-center'>Date</th>
                <th className='text-center'>Operation</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buysell.map(item => (
                <tr key={item.id}>
                  <td className='text-center p-donation'>{item.description}</td>
                  <td className='text-center p-donation'>{item.quantity}</td>
                  <td className='text-center p-donation'>$ {item.amount}</td>
                  <td className='text-center p-donation'>{item.date}</td>
                  <td className={`text-center p-donation ${item.type === 'Sale' ? 'text-green' : 'text-red'}`}>
                    {item.type === 'Sale' ? (
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
                      <FontAwesomeIcon icon={faEye} className='hover-button' />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item)}>
                      <FontAwesomeIcon icon={faTrash} className='hover-button-trash' />
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

      {/* Add Inventory Modal */}
      <Modal show={showInventoryModal} onHide={handleInventoryModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add Operation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddOperation}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-8">
                  <label htmlFor="description" className="form-label">Product Name</label>
                  <input type="text" className="form-control" id="description" name="description" placeholder='Product Name' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Amount</label>
                  <input type="number" className="form-control" id="amount" name="amount" placeholder='$ 1' required />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="date" className="form-label">Date</label>
                  <input type="date" className="form-control" id="date" name="date" required/>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="type" className="form-label">Operation Type</label>
                  <Form.Control as="select" className="form-select" name="type">
                                    <option>Purchase</option>
                                    <option>Sale</option>
                  </Form.Control>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='mt-10'>
                  Add Operation
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Product Details Modal */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Operation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
              <p><strong>Amount:</strong> {selectedProduct.amount}</p>
              <p><strong>Date:</strong> {selectedProduct.date}</p>
              <p><strong>Type:</strong> {selectedProduct.type}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Delete Operation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this operation?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDeleteOperation(selectedProduct.id)}>
              Delete
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
      <BreadcrumbItem mainTitle="Resource Management" subTitle="Operations" />
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
