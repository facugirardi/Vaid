"use client";

import React, { useState, useEffect } from 'react';
import './transactions.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { Eye, Trash } from 'phosphor-react';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
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
    fetchIncomes();
  }, [organizationId]);

  const fetchIncomes = async () => {
    if (organizationId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/incomes/`, {
          params: {
            org_id: organizationId
          }
        });
        setIncomes(response.data);
      } catch (error) {
        console.error('Error al obtener los ingresos:', error);
      }
    }
  };

  const deleteIncome = async (incomeId) => {
    try {
      console.log(incomeId);
      await axios.delete(`http://localhost:8000/api/incomes/${incomeId}/`, {
        params: {
          org_id: organizationId,
        }
      });
      setIncomes(incomes.filter(item => item.id !== incomeId));
      handleDeleteProductModalClose();
    } catch (error) {
      console.error('Error al eliminar el ingreso:', error);
    }
  };

  const handleIncomeModalClose = () => setShowIncomeModal(false);
  const handleIncomeModalShow = () => setShowIncomeModal(true);

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

  const handleAddIncome = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const incomeData = {
      description: formData.get('description'),
      date: formData.get('date'),
      amount: formData.get('amount'),
      category: formData.get('category')
    };

    try {
      await axios.post(`http://localhost:8000/api/incomes/`, incomeData, {
        params: {
          org_id: organizationId,
        },
      });
      fetchIncomes();
      handleIncomeModalClose();
    } catch (error) {
      console.error('Error al agregar el ingreso:', error);
    }
  };

  return (
    <div className="card">
      <h2>Ingreso de Dinero</h2>
      {incomes.length === 0 ? (
        <>
          <br />
          <p>No se encontraron registros.</p>
          <button className="add-button" onClick={handleIncomeModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className='text-center'>Descripción</th>
                <th className='text-center'>Monto</th>
                <th className='text-center'>Fecha</th>
                <th className='text-center'>Categoría</th>
                <th className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map(item => (
                <tr key={item.id}>
                  <td className='text-center p-donation'><b>{item.description}</b></td>
                  <td className="text-center p-donation">${item.amount}</td>
                  <td className='text-center p-donation'><b>{item.date}</b></td>
                  <td className='text-center p-donation'>{item.category}</td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item)}>
                      <Eye className='hover-button' size={20} weight="bold" />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.id)}>
                      <Trash className='hover-button-trash' size={20} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="add-button" onClick={handleIncomeModalShow}>
        <FontAwesomeIcon icon={faPlus} className='hover-button' />
      </button>

      {/* Modal para agregar ingreso */}
      <Modal show={showIncomeModal} onHide={handleIncomeModalClose} backdropClassName="modal-backdrop" centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddIncome}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <input type="text" className="form-control" id="description" name="description" placeholder='Agregar Descripción' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="category" className="form-label">Categoría</label>
                  <Form.Control as="select" className="form-select" id="category" name="category">
                    <option>Renta</option>
                    <option>Subsidios</option>
                    <option>Servicios</option>
                    <option>Otro</option>
                  </Form.Control>
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="amount" className="form-label">Monto</label>
                  <input type="number" className="form-control" id="amount" name="amount" placeholder='$ 1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="date" className="form-label">Fecha</label>
                  <input type="date" className="form-control" id="date" name="date" required />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='col-md-3 mt-40'>
                  Agregar Ingreso
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal de detalles del ingreso */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p><strong>Descripción:</strong> {selectedProduct.description}</p>
              <p><strong>Monto:</strong> ${selectedProduct.amount}</p>
              <p><strong>Fecha:</strong> {selectedProduct.date}</p>
              <p><strong>Categoría:</strong> {selectedProduct.category}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para eliminar ingreso */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este ingreso?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => deleteIncome(selectedProduct.id)}>
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
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
    fetchExpenses();
  }, [organizationId]);

  const fetchExpenses = async () => {
    if (organizationId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/expenses/`, {
          params: {
            org_id: organizationId
          }
        });
        setExpenses(response.data);
      } catch (error) {
        console.error('Error al obtener los egresos:', error);
      }
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      await axios.delete(`http://localhost:8000/api/expenses/${expenseId}/`);
      setExpenses(expenses.filter(item => item.id !== expenseId));
      handleDeleteProductModalClose();
    } catch (error) {
      console.error('Error al eliminar el egreso:', error);
    }
  };

  const handleExpenseModalClose = () => setShowExpenseModal(false);
  const handleExpenseModalShow = () => setShowExpenseModal(true);

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

  const handleAddExpense = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const expenseData = {
      description: formData.get('description'),
      date: formData.get('date'),
      amount: formData.get('amount'),
      category: formData.get('category')
    };

    try {
      await axios.post(`http://localhost:8000/api/expenses/`, expenseData, {
        params: {
          org_id: organizationId,
        },
      });
      fetchExpenses();
      handleExpenseModalClose();
    } catch (error) {
      console.error('Error al agregar el egreso:', error);
    }
  };

  return (
    <div className="card">
      <h2>Egreso de Dinero</h2>
      {expenses.length === 0 ? (
        <>
          <br />
          <p>No se encontraron registros.</p>
          <button className="add-button" onClick={handleExpenseModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button' />
          </button>
        </>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className='text-center'>Descripción</th>
                <th className='text-center'>Monto</th>
                <th className='text-center'>Fecha</th>
                <th className='text-center'>Categoría</th>
                <th className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(item => (
                <tr key={item.id}>
                  <td className='text-center p-donation'><b>{item.description}</b></td>
                  <td className="text-center p-donation">${item.amount}</td>
                  <td className='text-center p-donation'><b>{item.date}</b></td>
                  <td className='text-center p-donation'>{item.category}</td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item)}>
                      <Eye className='hover-button' size={20} weight="bold" />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.id)}>
                      <Trash className='hover-button-trash' size={20} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="add-button" onClick={handleExpenseModalShow}>
        <FontAwesomeIcon icon={faPlus} className='hover-button' />
      </button>

      {/* Modal para agregar egreso */}
      <Modal show={showExpenseModal} onHide={handleExpenseModalClose} backdropClassName="modal-backdrop" centered size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Egreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddExpense}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <input type="text" className="form-control" id="description" name="description" placeholder='Agregar Descripción' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="category" className="form-label">Categoría</label>
                  <Form.Control as="select" className="form-select" id="category" name="category">
                    <option>Gastos Generales</option>
                    <option>Renta</option>
                    <option>Servicios</option>
                    <option>Otro</option>
                  </Form.Control>
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="amount" className="form-label">Monto</label>
                  <input type="number" className="form-control" id="amount" name="amount" placeholder='$ 1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="date" className="form-label">Fecha</label>
                  <input type="date" className="form-control" id="date" name="date" required />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='col-md-3 mt-40'>
                  Agregar Egreso
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal de detalles del egreso */}
      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Egreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p><strong>Descripción:</strong> {selectedProduct.description}</p>
              <p><strong>Monto:</strong> ${selectedProduct.amount}</p>
              <p><strong>Fecha:</strong> {selectedProduct.date}</p>
              <p><strong>Categoría:</strong> {selectedProduct.category}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para eliminar egreso */}
      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Egreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este egreso?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => deleteExpense(selectedProduct.id)}>
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
      <BreadcrumbItem mainTitle="Gestión de Recursos" subTitle="Transacciones" />
      <div className="container both-cont">
        <div className='row'>
          <div className="col-md-6">
            <Income />
          </div>
          <div className="col-md-6">
            <Expense />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;

