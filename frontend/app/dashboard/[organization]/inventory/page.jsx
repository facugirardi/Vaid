"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { Modal, Button } from 'react-bootstrap';

const Headquarters = ({ onHeadquarterClick }) => {
  const [headquarters, setHeadquarters] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [showHeadquarterModal, setShowHeadquarterModal] = useState(false);

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
        .catch(error => console.error('Error fetching headquarters:', error));
    }
  }, [organizationId]);

  const handleHeadquarterModalClose = () => setShowHeadquarterModal(false);
  const handleHeadquarterModalShow = () => setShowHeadquarterModal(true);

  return (
    <div className="card">
      <h2>Headquarters</h2>
      <table className='table'>
        <tbody>
          {headquarters.map(hq => (
            <tr key={hq.id} className="d-flex tr-class" onClick={() => onHeadquarterClick(hq.id)}>
              <td className="flex-grow-1 d-flex align-items-center justify-content-start">{hq.name}</td>
              <td className="flex-grow-1 d-flex align-items-center justify-content-start">{hq.address}</td>
              <td className="d-flex align-items-center justify-content-end">
                <button className="edit-button trash-btn"><FontAwesomeIcon icon={faEllipsisV} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-button" onClick={handleHeadquarterModalShow}>
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <Modal show={showHeadquarterModal} onHide={handleHeadquarterModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add Headquarter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your form here */}
          <form>
            <div className='container'>
            <div className='row'>
            <div className="mb-3 col-md-6">
              <label htmlFor="headquarterName" className="form-label">Headquarter Name</label>
              <input type="text" className="form-control" id="headquarterName" placeholder='Headquarter name'/>
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="addressName" className="form-label">Address Name</label>
              <input type="text" className="form-control" id="headquarterAddress" placeholder='Address name'/>
            </div>
            </div>
            <div className='d-flex justify-content-center'>
            <Button variant="primary" type="submit" onClick={handleHeadquarterModalClose}>
              Create
            </Button>
            </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const Inventory = ({ headquarterId }) => {
  const [inventory, setInventory] = useState([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  useEffect(() => {
    if (headquarterId) {
      fetch(`http://localhost:8000/api/headquarters/${headquarterId}/products`)
        .then(response => response.json())
        .then(data => setInventory(Array.isArray(data) ? data : []))
        .catch(error => {
          console.error('Error fetching inventory:', error);
          setInventory([]);
        });
    }
  }, [headquarterId]);

  const handleInventoryModalClose = () => setShowInventoryModal(false);
  const handleInventoryModalShow = () => setShowInventoryModal(true);

  return (
    <div className="card">
      <h2>Storage</h2>
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
          {inventory.map(item => (
            <tr key={item.id}>
              <td className='text-center'>{item.Product.name}</td>
              <td className='text-center'>{item.cuantity}</td>
              <td className='text-center'>{item.Product.Category.name}</td>
              <td className='text-center'>{item.Product.Status.name}</td>
              <td className='text-center'>
                <button className="icon-button">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="icon-button">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-button" onClick={handleInventoryModalShow}>
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <Modal show={showInventoryModal} onHide={handleInventoryModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your form here */}
          <form>
            <div className='container'>
            <div className='row'>
            <div className="mb-3 col-md-4">
              <label htmlFor="productName" className="form-label">Name</label>
              <input type="text" className="form-control" id="productName" placeholder='Product Name'/>
            </div>
            <div className="mb-3 col-md-2">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input type="number" className="form-control" id="quantity" placeholder='1'/>
            </div>
              <div className="mb-3 col-md-3">
              <label htmlFor="expDate" className="form-label">Expiration Date</label>
              <input type="date" className="form-control" id="expDate"/>
            </div>
            <div className="mb-3 col-md-3">
              <label htmlFor="productType" className="form-label">Type</label>
              <input type="text" className="form-control" id="productType" placeholder='Product Type'/>
            </div>
            </div>
            <div className='d-flex justify-content-center'>
            <Button variant="primary" type="submit" className='mt-10'>
              Create
            </Button>
            </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const History = () => {
  return (
    <div className="card">
      <h2>History</h2>
      <ul className="history-list mt-20">
        <li>
          <div className='d-flex justify-content-start'>
            <span>No History Yet</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

const Page = () => {
  const [selectedHeadquarterId, setSelectedHeadquarterId] = useState(null);

  const handleHeadquarterClick = (id) => {
    setSelectedHeadquarterId(id);
  };

  return (
    <Layout>
      <div className="container">
        <BreadcrumbItem mainTitle="Resource Management" subTitle="Inventory" />
        <div className='row'>
          <div className="col-md-6">
            <Headquarters onHeadquarterClick={handleHeadquarterClick} />
            <History />
          </div>
          <div className="col-md-6">
            <Inventory headquarterId={selectedHeadquarterId} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
