"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { Modal, Button } from 'react-bootstrap';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const Inventory = ({ headquarterId, addHistoryEntry }) => {
  const [inventory, setInventory] = useState([]);
  const [headquarters, setHeadquarters] = useState([]);
  const [selectedHeadquarter, setSelectedHeadquarter] = useState(headquarterId || '');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [organizationId, setOrganizationId] = useState("");
  
  const { data: user, isError, isLoading } = useRetrieveUserQuery();
  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/');
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      setOrganizationId(pathSegments[dashboardIndex + 1]);
    }
  }, []);

  const loadInventory = () => {
    if (organizationId) {
      fetch(`http://localhost:8000/api/organization/${organizationId}/all-products/`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setInventory(data);
          } else if (data && typeof data === 'object') {
            setInventory([data]);
          } else {
            console.error('Estructura inesperada de los datos:', data);
          }
        })
        .catch(error => {
          console.error('Error fetching inventory:', error);
          setInventory([]);
        });
    }
  };

  const loadHeadquarters = () => {
    if (organizationId) {
      fetch(`http://localhost:8000/api/headquarters/${organizationId}/`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setHeadquarters(data);
          } 
          else if (data && typeof data === 'object') {

            setHeadquarters([data]);
            console.log(headquarters)
          }
          else {
            console.error('Estructura inesperada de los datos:', data);
          }
        })
        .catch(error => {
          console.error('Error fetching headquarters:', error);
          setHeadquarters([]);
        });
    }
  };

  useEffect(() => {
    loadInventory();
    loadHeadquarters();
  }, [organizationId]);

  const handleInventoryModalShow = () => {
    loadHeadquarters(); // Cargar las sedes cuando se abra el modal
    setShowInventoryModal(true);
  };

  const handleInventoryModalClose = () => setShowInventoryModal(false);

  const handleProductModalShow = (product) => {
    setSelectedProduct(product);  // Pasa el objeto completo del producto
    setShowProductModal(true);
  };

  const handleProductModalClose = () => setShowProductModal(false);

  const handleDeleteProductModalShow = (product) => {
    setSelectedProduct(product);
    setShowDeleteProductModal(true);
  };

  const handleDeleteProductModalClose = () => setShowDeleteProductModal(false);

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`http://localhost:8000/api/products/${selectedProduct.id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Producto borrado con éxito');
        setInventory(inventory.filter(item => item.id !== selectedProduct.id));
        addHistoryEntry(`Product "${selectedProduct.name}" deleted by ${user.first_name} ${user.last_name}`);
        setShowDeleteProductModal(false);
      } else {
        console.error('Error al borrar el producto:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddProductSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    let expDate = formData.get('expDate');
    if (expDate === '') {
        expDate = null; // Si la fecha está vacía, establecerla como null
    }

    const data = {
        name: formData.get('name'),
        Category: formData.get('Category'),
        expDate: expDate,
        Status: 1,
        quantity: parseInt(formData.get('quantity')),
        headquarter: selectedHeadquarter
    };

    try {
        console.log(data)
        const response = await fetch(`http://localhost:8000/api/headquarters/${organizationId}/${selectedHeadquarter}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const newProduct = await response.json();
            console.log(newProduct)
            setInventory([...inventory, newProduct]);
            addHistoryEntry(`Product "${newProduct.name}" added by ${user.first_name} ${user.last_name}`);
            setShowInventoryModal(false);
        } else {
            const errorData = await response.json();
            console.error('Error en la respuesta:', response.status, errorData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


  return (
    <div className="card">
      <h2>Products</h2>
      {inventory.length === 0 ? (
        <>
          <br />
          <p>No products found in the inventory.</p>
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
                <th className='text-center'>Expiration Date</th>
                <th className='text-center'>Category</th>
                <th className='text-center'>Status</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td className='text-center'>{item.name}</td>
                  <td className='text-center'>{item.expDate ? item.expDate : '-'}</td>
                  <td className='text-center'>{item.category_name}</td>
                  <td className='text-center'>{item.status_name}</td>
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

      <Modal show={showInventoryModal} onHide={handleInventoryModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddProductSubmit}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-6">
                  <label htmlFor="headquarterSelect" className="form-label">Select Headquarter</label>
                  <select 
                    className="form-control" 
                    id="headquarterSelect" 
                    name="headquarter" 
                    value={selectedHeadquarter} 
                    onChange={(e) => setSelectedHeadquarter(e.target.value)} 
                    required
                  >
                    <option value="">Select a Headquarter</option>
                    {headquarters.map(hq => (
                      <option key={hq.id} value={hq.id}>{hq.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="productName" className="form-label">Product Name</label>
                  <input type="text" className="form-control" id="productName" name="name" placeholder='Product Name' required />
                </div>
              </div>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-4">
                  <label htmlFor="expDate" className="form-label">Expiration Date (Optional)</label>
                  <input type="date" className="form-control" id="expDate" name="expDate" />
                </div>
                <div className="mb-3 col-md-4">
                  <label htmlFor="productType" className="form-label">Category</label>
                  <input type="text" className="form-control" id="Category" name="Category" placeholder='Product Category' required />
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
            <Button variant="danger" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const Page = () => {
  const [selectedHeadquarterId, setSelectedHeadquarterId] = useState(null);
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

  const handleHeadquarterClick = (id) => {
    setSelectedHeadquarterId(id);
  };

  const addHistoryEntry = async (entry) => {
    try {
        const response = await fetch(`http://localhost:8000/api/${organizationId}/history/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        body: JSON.stringify({ description: entry, action: 'Inventory Change', Organization: organizationId}),
        });

        if (response.ok) {
            console.log('Historial registrado con éxito');
        } else {
            console.error('Error al registrar el historial:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <div className="container">
        <BreadcrumbItem mainTitle="Resource Management" subTitle="Inventory" />
        <div className='row'>
          <div className="col-md-12">
            <Inventory headquarterId={selectedHeadquarterId} organizationId={organizationId} addHistoryEntry={addHistoryEntry} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
