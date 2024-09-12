"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { Modal, Button, Form } from 'react-bootstrap';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from "react-toastify";

const Headquarters = ({ onHeadquarterClick, addHistoryEntry }) => {
  const [headquarters, setHeadquarters] = useState([]);
  const [organizationId, setOrganizationId] = useState("");
  const [showHeadquarterModal, setShowHeadquarterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHeadquarter, setSelectedHeadquarter] = useState(null);

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

  useEffect(() => {
    if (organizationId) {
      fetch(`http://localhost:8000/api/headquarters/${organizationId}`)
        .then(response => response.json())
        .then(data => setHeadquarters(data))
        .catch(error => console.error('Error:', error));
    }
  }, [organizationId]);

  const handleHeadquarterModalClose = () => setShowHeadquarterModal(false);
  const handleHeadquarterModalShow = () => setShowHeadquarterModal(true);
  
  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = (hq) => {
    setSelectedHeadquarter(hq);
    setShowDeleteModal(true);
  };

  const handleDeleteHeadquarter = async () => {
    if (!selectedHeadquarter) return;

    try {
        const response = await fetch(`http://localhost:8000/api/headquarters/${organizationId}/edit/${selectedHeadquarter.id}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Headquarter borrado con éxito');
            setHeadquarters(headquarters.filter(hq => hq.id !== selectedHeadquarter.id));

            // Si no quedan más headquarters, actualizar el selectedHeadquarterId
            if (headquarters.length === 1) {
                onHeadquarterClick(null);  // Pasar null para limpiar el selectedHeadquarterId
            }

            addHistoryEntry(`Headquarter "${selectedHeadquarter.name}" deleted by ${user.first_name} ${user.last_name}`);
            handleDeleteModalClose();


        } else {
            toast.error('Error al borrar la sede:', response.status);
        }
    } catch (error) {
        toast.error('Error:', error);
    }
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
        name: formData.get('name'),
        address: formData.get('address'),
    };

    try {
        const response = await fetch(`http://localhost:8000/api/headquarters/${organizationId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const newHeadquarter = await response.json();
            console.log('Headquarter creado con éxito');
            setHeadquarters([...headquarters, newHeadquarter]);
            addHistoryEntry(`Headquarter "${newHeadquarter.name}" added by ${user.first_name} ${user.last_name}`);
            handleHeadquarterModalClose(); // Cerrar el modal aquí
        } else {
            toast.error('Error en la respuesta:', response.status);
        }
    } catch (error) {
        toast.error('Error:', error);
    }
  };

  return (
    <div className="card">
      <h2>Headquarters</h2>
      <table className='table'>
        <tbody>
          {headquarters.length === 0 ? (
            <>
            <p className='p-inventory'>No headquarters available.<br></br><br></br>Start by adding your first headquarters using the '+' button.</p>
            </>
          ) : (
            headquarters.map(hq => (
              <tr key={hq.id} className="d-flex tr-class" onClick={() => onHeadquarterClick(hq.id)}>
                <td className="flex-grow-1 d-flex align-items-center justify-content-start p-inventory">{hq.name}</td>
                <td className="flex-grow-1 d-flex align-items-center justify-content-start p-inventory">{hq.address}</td>
                <td className="d-flex align-items-center justify-content-end">
                  <button className="edit-button trash-btn" onClick={(e) => { e.stopPropagation(); handleDeleteModalShow(hq); }}>
                    <FontAwesomeIcon icon={faTrash} className='hover-button-trash'/>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button className="add-button" onClick={handleHeadquarterModalShow}>
        <FontAwesomeIcon icon={faPlus} className='hover-button'/>
      </button>

      <Modal show={showHeadquarterModal} onHide={handleHeadquarterModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add Headquarter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-6">
                  <label htmlFor="headquarterName" className="form-label">Headquarter Name</label>
                  <input type="text" className="form-control" id="headquarterName" name="name" placeholder="Headquarter name" required />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="addressName" className="form-label">Address Name</label>
                  <input type="text" className="form-control" id="headquarterAddress" name="address" placeholder="Address name" required />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Delete Headquarter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the headquarter <strong>{selectedHeadquarter?.name}</strong>?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteModalClose} className="me-2">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteHeadquarter}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const Inventory = ({ headquarterId, organizationId }) => {
  const [inventory, setInventory] = useState([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (headquarterId) {
        fetch(`http://localhost:8000/api/headquarters/${headquarterId}/products`)
            .then(response => response.json())
            .then(data => setInventory(Array.isArray(data) ? data : []))
            .catch(error => {
                toast.error('Error fetching inventory:', error);
                setInventory([]);
            });
    } else {
        // Limpiar el inventario si no hay headquarter seleccionada
        setInventory([]);
    }
}, [headquarterId]);

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
            fetchHistory();
        } else {
            toast.error('Error al registrar el historial');
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
        const response = await fetch(`http://localhost:8000/api/products/${selectedProduct.id}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Producto borrado con éxito');
            setInventory(inventory.filter(item => item.id !== selectedProduct.id));
            setShowDeleteProductModal(false);
            addHistoryEntry(`Product "${selectedProduct.name}" deleted by ${user.first_name} ${user.last_name}`);
            
        } else {
            toast.error('Error al borrar el producto:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };

  const handleAddProductSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    let expDate = formData.get('expDate');
    const quantity = parseInt(formData.get('quantity'));

    // Verificar si la cantidad es negativa
    if (quantity < 0) {
        toast.error('Quantity cannot be negative.');
        return;
    }

    if (expDate === '') {
        expDate = null;  // Si la fecha está vacía, establecerla como null
    }

    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        Category: formData.get('Category'), 
        expDate: expDate,
        Status: 1,
        quantity: quantity, 
    };

    try {
        const response = await fetch(`http://localhost:8000/api/headquarters/${organizationId}/${headquarterId}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const newProduct = await response.json();
            setInventory([...inventory, newProduct]);
            setShowInventoryModal(false);
            addHistoryEntry(`Product "${newProduct.name}" added by ${user.first_name} ${user.last_name}`);
        } else {
            const errorData = await response.json();
            toast.error('Error en la respuesta:', response.status, errorData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

  return (
    <div className="card product-container">
      <h2>Products</h2>
      {!headquarterId ? (
        <>
        <br/>
        <p className='p-inventory'>Please select a headquarter to view the inventory.</p>
        </>
      ) : inventory.length === 0 ? (
        <>
        <br/>
        <p className='p-inventory'>No products found in the inventory.<br></br><br></br>Start by adding your first products using the '+' button.</p>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button'/>
          </button>
        </>
      ) : (
        <>
          <table className="table ">
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
                  <td className='text-center p-inventory'>{item.Product.name}</td>
                  <td className='text-center '>{item.cuantity}</td>
                  <td className='text-center p-inventory'>{item.Product.category_name}</td>
                  <td className='text-center p-inventory'>{item.Product.status_name}</td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item.Product)}>
                      <FontAwesomeIcon icon={faEye} className='hover-button'/>
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.Product)}>
                      <FontAwesomeIcon icon={faTrash} className='hover-button-trash'/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button'/>
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
                <label htmlFor="productType" className="form-label">Category</label>
                  <Form.Control as="select" className="form-select" id="Category" name="Category">
                                    <option>Clothes</option>
                                    <option>Food</option>
                                    <option>Drinks</option>
                                    <option>Medications</option>
                                    <option>Tools</option>
                                    <option>Other</option>
                                    <option>Money</option>
                  </Form.Control>
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

const History = ({ organizationId, localHistory, setLocalHistory }) => {

  useEffect(() => {
    const fetchHistory = async () => {
      if(organizationId){
      try {
        const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/history/`);
        const data = await response.json();
        setLocalHistory(data);
      } catch (error) {
        toast.error('Error fetching history:', error);
      }}
    };

    fetchHistory();
  }, [organizationId, setLocalHistory]);

  return (
    <div className="card history-container">
      <h2>History</h2>
      <div className="title-divider"></div> {/* Línea gris debajo del título */}
      <br></br>
      <ul className="history-list mt-20">
        {localHistory.length === 0 ? (
          <p>No History Yet</p>
        ) : (
          localHistory.map((entry, index) => (
            <div key={index} className='container'>
              <div className='row align-items-center'>
              <div className='col-5 col-md-3 text-center'>
                  <p className='p-history'>{entry.date}</p>
                </div>
                <div className='col-5 col-md-8'>
                  <p className='p-history'><b>{entry.action}</b>
                  {entry.description.includes('added') && (
                    <span className="badge bg-success ms-2">Added</span>
                  )}
                  {entry.description.includes('deleted') && (
                    <span className="badge bg-danger ms-2">Deleted</span>
                  )}
                  </p>
                  <p className='p-history'>
                  {entry.description}
                </p>
                </div>
              </div> 
              <br/>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

const Page = () => {
  const [selectedHeadquarterId, setSelectedHeadquarterId] = useState(null);
  const [organizationId, setOrganizationId] = useState("");
  const [localHistory, setLocalHistory] = useState([]);

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
              fetchHistory();
          } else {
              toast.error('Error al registrar el historial');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  };

  const fetchHistory = async () => {
      try {
          const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/history/`);
          const data = await response.json();
          setLocalHistory(data);
      } catch (error) {
          console.error('Error fetching history:', error);
      }
  };

  return (
      <Layout>
          <div className="container">
              <BreadcrumbItem mainTitle="Resource Management" subTitle="Headquarter Inventory" />
              <div className='row'>
                  <div className="col-md-6">
                      <Headquarters onHeadquarterClick={handleHeadquarterClick} addHistoryEntry={addHistoryEntry} />
                      <History organizationId={organizationId} localHistory={localHistory} setLocalHistory={setLocalHistory} />
                  </div>
                  <div className="col-md-6">
                      <Inventory headquarterId={selectedHeadquarterId} organizationId={organizationId} />
                  </div>
              </div>
          </div>
      </Layout>
  );
};

export default Page;
