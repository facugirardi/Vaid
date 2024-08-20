"use client";

import React, { useState } from 'react';
import './donation.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';

const BuySell =({ handleShowModal2 })=> {
  return (
    <div className="container">
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>Buy and Sell</h3>
            <button className="add-button" onClick={handleShowModal2}>+</button>

          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Units</th>
                <th>Date</th>
                <th>Time</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
              </tr>
              {/* Repetir filas según sea necesario */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Donations = ({ handleShowModal }) => {
  return (
    <div className="container">
      <div className="cards-container">
        <div className="card">
          <div className="card-header">
            <h3>Donations</h3>
            <button className="add-button" onClick={handleShowModal}>+</button>
          </div>
          <table>
            <thead>
              <tr>
                <th className="th-compact">Name</th>
                <th className="th-compact">Units</th>
                <th className="th-compact">Date</th>
                <th className="th-compact">Time</th>
                <th className="th-compact">Operation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-compact"><button className="options-button"><i className="fas fa-ellipsis-v"></i></button></td>
                {/* Resto de las celdas */}
              </tr>
              {/* Repetir filas según sea necesario */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);


  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCloseModal2 = () => setShowModal2(false);
  const handleShowModal2 = () => setShowModal2(true);

  return (
    <Layout>
      <BreadcrumbItem mainTitle="Resource Management" subTitle="Operations" />
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <Donations handleShowModal={handleShowModal} />
          </div>
          <div className="col-md-6">
            <BuySell handleShowModal2={handleShowModal2}/>
          </div>

          {/* Modal Component */}
          <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Add Donation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-3">
                  <Form.Group controlId="formProductName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Product Name" />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="formProductType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" placeholder="Product Type" />
                  </Form.Group>
                </div>
                <div className="col-md-1">
                  <Form.Group controlId="formUnits">
                    <Form.Label>Units</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control type="number" min="1" defaultValue="1" />
                    </div>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="formIncomeDate">
                    <Form.Label>Income Date</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group controlId="formHeadquarter">
                    <Form.Label>Headquarter</Form.Label>
                    <Form.Control as="select">
                      <option>Select</option>
                      <option>Headquarter 1</option>
                      <option>Headquarter 2</option>
                      {/* Agregar más opciones según sea necesario */}
                    </Form.Control>
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="primary">Create</Button>
          </Modal.Footer>
        </Modal>

        </div>
      </div>

      {/* Modal Component */}
      <Modal show={showModal2} onHide={handleCloseModal2} centered className="custom-modal-donation">
          <Modal.Header closeButton>
            <Modal.Title>Save purchase or Sale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row">
                <div className="col-md-4">
                  <Form.Group controlId="formProductName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Product Name" />
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group controlId="formUnits">
                    <Form.Label>Quantity</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control type="number" min="1" defaultValue="1" />
                    </div>
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group controlId="formUnits">
                    <Form.Label>Amount</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control type="number" min="1" defaultValue="1" />
                    </div>
                  </Form.Group>
                </div>
                 <div className="col-md-4">
                  <Form.Group controlId="formProductType">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" placeholder="Product Type" />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="primary">Create</Button>
          </Modal.Footer>
        </Modal>

    </Layout>
  );
};

export default Page;
