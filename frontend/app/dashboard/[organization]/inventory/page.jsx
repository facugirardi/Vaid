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

const Headquarters = ({ onHeadquarterClick, addHistoryEntry, headquarters, setHeadquarters }) => {
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
            console.log('Sede eliminada con éxito');
            setHeadquarters(headquarters.filter(hq => hq.id !== selectedHeadquarter.id));

            if (headquarters.length === 1) {
                onHeadquarterClick(null); 
            }

            addHistoryEntry(`Sede "${selectedHeadquarter.name}" eliminada por ${user.first_name} ${user.last_name}`);
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
            console.log('Sede creada con éxito');
            setHeadquarters([...headquarters, newHeadquarter]);
            addHistoryEntry(`Sede "${newHeadquarter.name}" agregada por ${user.first_name} ${user.last_name}`);
            handleHeadquarterModalClose(); 
        } else {
            toast.error('Error en la respuesta:', response.status);
        }
    } catch (error) {
        toast.error('Error:', error);
    }
  };

  return (
    <div className="card">
      <h2>Sedes</h2>
      <table className='table'>
      <tbody>
        {headquarters.length === 0 ? (
          <>
          <p className='p-inventory'>No hay sedes disponibles.<br></br><br></br>Empieza agregando tu primera sede usando el botón '+'.</p>
          </>
        ) : (
          headquarters.map(hq => (
            <tr
              key={hq.id}
              className={`d-flex tr-class ${selectedHeadquarter?.id === hq.id ? 'selected-headquarter' : ''}`}
              onClick={() => {
                onHeadquarterClick(hq.id);
                setSelectedHeadquarter(hq);
              }}
            >
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
          <Modal.Title>Agregar Sede</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-6">
                  <label htmlFor="headquarterName" className="form-label">Nombre de la Sede</label>
                  <input type="text" className="form-control" id="headquarterName" name="name" placeholder="Nombre de la sede" required />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="addressName" className="form-label">Nombre de la Dirección</label>
                  <input type="text" className="form-control" id="headquarterAddress" name="address" placeholder="Nombre de la dirección" required />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit">
                  Crear
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Sede</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar la sede <strong>{selectedHeadquarter?.name}</strong>?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteModalClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteHeadquarter}>
              Eliminar
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
                toast.error('Error al obtener el inventario:', error);
                setInventory([]);
            });
    } else {
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
        body: JSON.stringify({ description: entry, action: 'Cambio en Inventario', Organization: organizationId}),
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
            addHistoryEntry(`Producto "${selectedProduct.name}" eliminado por ${user.first_name} ${user.last_name}`);
            
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

    if (quantity < 0) {
        toast.error('La cantidad no puede ser negativa.');
        return;
    }

    if (expDate === '') {
        expDate = null;  
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
            addHistoryEntry(`Producto "${newProduct.name}" agregado por ${user.first_name} ${user.last_name}`);
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
      <h2>Productos</h2>
      {!headquarterId ? (
        <>
        <br/>
        <p className='p-inventory'>Por favor, selecciona una sede para ver el inventario.</p>
        </>
      ) : inventory.length === 0 ? (
        <>
        <br/>
        <p className='p-inventory'>No se encontraron productos en el inventario.<br></br><br></br>Comienza agregando tus primeros productos usando el botón '+'.</p>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button'/>
          </button>
        </>
      ) : (
        <>
          <table className="table ">
            <thead>
              <tr>
                <th className='text-center'>Nombre</th>
                <th className='text-center'>Unidades</th>
                <th className='text-center'>Estado</th>
                <th className='text-center'>Categoría</th>
                <th className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td className='text-center p-inventory'><b>{item.Product.name}</b></td>
                  <td className='text-center '>{item.cuantity}</td>
                  <td className='text-center p-inventory'><b>{item.Product.status_name}</b></td>
                  <td
                    className="text-center p-donation"
                    style={{
                      color:
                        item.Product.category_name === "Comida"
                          ? "#795548"
                          : item.Product.category_name === "Herramientas"
                          ? "#2196F3"
                          : item.Product.category_name === "Bebidas"
                          ? "#FF9800"
                          : item.Product.category_name === "Dinero"
                          ? "#2BC155"
                          : item.Product.category_name === "Otros"
                          ? "#9E9E9E"
                          : item.Product.category_name === "Medicamentos"
                          ? "#FF3E3E"
                          : item.Product.category_name === "Ropa"
                          ? "#9C27B0"
                          : "inherit", 
                    }}
                  >
                    {item.Product.category_name}
                  </td>
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
          <Modal.Title>Agregar Producto al Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddProductSubmit}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="productName" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="productName" name="name" placeholder='Nombre del Producto' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Cantidad</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="expDate" className="form-label">Fecha de Expiración (Opcional)</label>
                  <input type="date" className="form-control" id="expDate" name="expDate" />
                </div>
                <div className="mb-3 col-md-3">
                <label htmlFor="productType" className="form-label">Categoría</label>
                  <Form.Control as="select" className="form-select" id="Category" name="Category">
                                    <option>Ropa</option>
                                    <option>Comida</option>
                                    <option>Bebidas</option>
                                    <option>Medicamentos</option>
                                    <option>Herramientas</option>
                                    <option>Otros</option>
                                    <option>Dinero</option>
                  </Form.Control>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" className='mt-10'>
                  Agregar Producto
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showProductModal} onHide={handleProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p><strong>Nombre:</strong> {selectedProduct.name}</p>
              <p><strong>Categoría:</strong> {selectedProduct.category_name}</p>
              <p><strong>Estado:</strong> {selectedProduct.status_name}</p>
              <p><strong>Fecha de Expiración:</strong> {selectedProduct.expDate ? selectedProduct.expDate : '-'}</p>
              </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteProductModal} onHide={handleDeleteProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar el producto <strong>{selectedProduct?.name}</strong>?</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleDeleteProductModalClose} className="me-2">
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct}>
              Eliminar
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
        toast.error('Error al obtener el historial:', error);
      }}
    };

    fetchHistory();
  }, [organizationId, setLocalHistory]);

  return (
    <div className="card history-container">
      <h2>Historial</h2>
      <br></br>
<ul className="history-list mt-20">
  {Array.isArray(localHistory) && localHistory.length === 0 ? (
    <p>No hay historial todavía</p>
  ) : (
    Array.isArray(localHistory) &&
    localHistory.map((entry, index) => (
      <div key={index} className='container'>
        <div className='row align-items-center'>
          <div className='col-5 col-md-3 text-center'>
            <p className='p-history'>{entry.date}</p>
          </div>
          <div className='col-5 col-md-8'>
            <p className='p-history'><b>{entry.action}</b>
            {entry.description.includes('agregado') && (
              <span className="badge bg-success ms-2">Agregado</span>
            )}
            {entry.description.includes('eliminado') && (
              <span className="badge bg-danger ms-2">Eliminado</span>
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
  const [selectedHeadquarter, setSelectedHeadquarter] = useState(null);
  const [headquarters, setHeadquarters] = useState([]);

  useEffect(() => {
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      const pathSegments = url.pathname.split('/');
      const dashboardIndex = pathSegments.indexOf('dashboard');
      if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
          setOrganizationId(pathSegments[dashboardIndex + 1]);
      }
  }, []);

  const handleHeadquarterClick = (hqId) => {
    setSelectedHeadquarterId(hqId);
    setSelectedHeadquarter(headquarters.find(hq => hq.id === hqId)); 
  };
  
  const addHistoryEntry = async (entry) => {
      try {
          const response = await fetch(`http://localhost:8000/api/${organizationId}/history/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
          body: JSON.stringify({ description: entry, action: 'Cambio en Inventario', Organization: organizationId}),
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
          console.error('Error al obtener el historial:', error);
      }
  };

  return (
    <Layout>
        <div className="container">
            <BreadcrumbItem mainTitle="Gestión de Recursos" subTitle="Inventario por Sede" />
            <div className='row'>
                <div className="col-md-6">
                    <Headquarters
                      onHeadquarterClick={handleHeadquarterClick}
                      addHistoryEntry={addHistoryEntry}
                      headquarters={headquarters}
                      setHeadquarters={setHeadquarters}
                    />
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
