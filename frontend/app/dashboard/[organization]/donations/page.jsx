"use client";

import React, { useState, useEffect } from 'react';
import './donation.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

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
    if(organizationId){
    try {
      const response = await axios.get(`http://localhost:8000/organizations/${organizationId}/tags/`); // URL del endpoint para obtener donaciones
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  }
  };

  const deleteDonation = async (donationId) => {
    try {
      await axios.delete(`/api/donations/${donationId}`); // URL del endpoint para eliminar una donación
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
    setShowProductModal(true);
  };

  const handleProductModalClose = () => setShowProductModal(false);

  const handleDeleteProductModalShow = (product) => {
    setSelectedProduct(product);
    setShowDeleteProductModal(true);
  };

  const handleDeleteProductModalClose = () => setShowDeleteProductModal(false);

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
                <th className='text-center'>Name</th>
                <th className='text-center'>Units</th>
                <th className='text-center'>Category</th>
                <th className='text-center'>Status</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(item => (
                <tr key={item.id}>
                  <td className='text-center'>{item.Product.name}</td>
                  <td className='text-center'>{item.cuantity}</td>
                  <td className='text-center'>{item.Product.category_name}</td>
                  <td className='text-center'>{item.Product.status_name}</td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item.Product)}>
                      <FontAwesomeIcon icon={faEye} className='hover-button' />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.Product)}>
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
          <Modal.Title>Add Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="productName" className="form-label">Name</label>
                  <input type="text" className="form-control" id="productName" name="name" placeholder='Product Name' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="expDate" className="form-label">Expiration Date (Optional)</label>
                  <input type="date" className="form-control" id="expDate" name="expDate" />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="productType" className="form-label">Type</label>
                  <input type="text" className="form-control" id="Category" name="Category" placeholder='Product Type' required />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='mt-10'>
                  Add Product
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Product Details Modal */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Category:</strong> {selectedProduct.category_name}</p>
              <p><strong>Status:</strong> {selectedProduct.status_name}</p>
              <p><strong>Expiration Date:</strong> {selectedProduct.expDate ? selectedProduct.expDate : '-'}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the product <strong>{selectedProduct?.name}</strong>?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteDonation(selectedProduct.id)}>
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
  }, []);

  const fetchBuySell = async () => {
    try {
      const response = await axios.get('/api/buysell'); // URL del endpoint para obtener compra/venta
      setBuysell(response.data);
    } catch (error) {
      console.error('Error fetching buy/sell:', error);
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
    setShowProductModal(true);
  };

  const handleProductModalClose = () => setShowProductModal(false);

  const handleDeleteProductModalShow = (product) => {
    setSelectedProduct(product);
    setShowDeleteProductModal(true);
  };

  const handleDeleteProductModalClose = () => setShowDeleteProductModal(false);

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
                <th className='text-center'>Category</th>
                <th className='text-center'>Status</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buysell.map(item => (
                <tr key={item.id}>
                  <td className='text-center'>{item.Product.name}</td>
                  <td className='text-center'>{item.cuantity}</td>
                  <td className='text-center'>{item.Product.category_name}</td>
                  <td className='text-center'>{item.Product.status_name}</td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item.Product)}>
                      <FontAwesomeIcon icon={faEye} className='hover-button' />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.Product)}>
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
          <Modal.Title>Add Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="productName" className="form-label">Name</label>
                  <input type="text" className="form-control" id="productName" name="name" placeholder='Product Name' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="expDate" className="form-label">Expiration Date (Optional)</label>
                  <input type="date" className="form-control" id="expDate" name="expDate" />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="productType" className="form-label">Type</label>
                  <input type="text" className="form-control" id="Category" name="Category" placeholder='Product Type' required />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='mt-10'>
                  Add Product
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Product Details Modal */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Category:</strong> {selectedProduct.category_name}</p>
              <p><strong>Status:</strong> {selectedProduct.status_name}</p>
              <p><strong>Expiration Date:</strong> {selectedProduct.expDate ? selectedProduct.expDate : '-'}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the product <strong>{selectedProduct?.name}</strong>?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteBuySell(selectedProduct.id)}>
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
