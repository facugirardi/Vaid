"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { Modal, Button, Form} from 'react-bootstrap';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from "react-toastify";
import { Eye, EyeSlash, Trash } from 'phosphor-react';

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
          console.error('Error al obtener el inventario:', error);
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
          }
          else {
            console.error('Estructura inesperada de los datos:', data);
          }
        })
        .catch(error => {
          console.error('Error al obtener las sedes:', error);
          setHeadquarters([]);
        });
    }
  };

  useEffect(() => {
    loadInventory();
    loadHeadquarters();
  }, [organizationId]);

  const handleInventoryModalShow = () => {
    loadHeadquarters(); 
    setShowInventoryModal(true);
  };

  const handleInventoryModalClose = () => setShowInventoryModal(false);

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

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
        const response = await fetch(`http://localhost:8000/api/products/${selectedProduct.id}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Producto eliminado con éxito');
            setInventory(inventory.filter(item => item.id !== selectedProduct.id));

            // Asegúrate de que `user` esté disponible
            if (user) {
                // Registrar en el historial y esperar la respuesta antes de cerrar el modal
                await addHistoryEntry(`Producto "${selectedProduct.name}" eliminado por ${user.first_name} ${user.last_name}`);
            } else {
                console.warn("Usuario no disponible para el registro en el historial.");
            }

            // Cerrar el modal y limpiar el producto seleccionado
            setShowDeleteProductModal(false);
            setSelectedProduct(null);
        } else {
            console.error('Error al eliminar el producto:', response.status);
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
        Category: formData.get('Category'),
        expDate: expDate,
        Status: 1,
        quantity: quantity,
        headquarter: selectedHeadquarter
    };

    try {
        const response = await fetch(`http://localhost:8000/api/headquarters/${organizationId}/${selectedHeadquarter}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const newProduct = await response.json();
            console.log('Producto agregado con éxito:', newProduct);
            setInventory([...inventory, newProduct.Product]);
            addHistoryEntry(`Producto "${newProduct.Product.name}" agregado por ${user.first_name} ${user.last_name}`);
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
      <h2>Productos</h2>
      {inventory.length === 0 ? (
        <>
          <br />
          <p>No se encontraron productos en el inventario.</p>
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
                <th className='text-center'>Cantidad</th>
                <th className='text-center'>Estado</th>
                <th className='text-center'>Expiración</th>
                <th className='text-center'>Categoría</th>
                <th className='text-center'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td className='text-center'><b>{item.name}</b></td>
                  <td className='text-center'>{item.total_quantity}</td>
                  <td className='text-center'><b>{item.status_name}</b></td>
                  <td className='text-center'>{item.expDate ? item.expDate : '-'}</td>
                  <td
                    className="text-center"
                    style={{
                      color:
                        item.category_name === "Comida"
                          ? "#795548"
                          : item.category_name === "Herramientas"
                          ? "#2196F3"
                          : item.category_name === "Bebidas"
                          ? "#FF9800"
                          : item.category_name === "Dinero"
                          ? "#2BC155"
                          : item.category_name === "Otros"
                          ? "#9E9E9E"
                          : item.category_name === "Medicamentos"
                          ? "#FF3E3E"
                          : item.category_name === "Ropa"
                          ? "#9C27B0"
                          : "inherit",
                    }}
                  >
                    <b>{item.category_name}</b>
                  </td>
                  <td className='text-center'>
                    <button className="icon-button" onClick={() => handleProductModalShow(item)}>
                      <Eye className='hover-button' size={20} weight="bold" />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item)}>
                      <Trash className='hover-button-trash' size={20} weight="bold" />
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
          <Modal.Title>Agregar Producto al Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddProductSubmit}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-6">
                  <label htmlFor="headquarterSelect" className="form-label">Seleccionar Sede</label>
                  <select 
                    className="form-control" 
                    id="headquarterSelect" 
                    name="headquarter" 
                    value={selectedHeadquarter} 
                    onChange={(e) => setSelectedHeadquarter(e.target.value)} 
                    required
                  >
                    <option value="">Selecciona una sede</option>
                    {headquarters.map(hq => (
                      <option key={hq.id} value={hq.id}>{hq.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="productName" className="form-label">Nombre del Producto</label>
                  <input type="text" className="form-control" id="productName" name="name" placeholder='Nombre del Producto' required />
                </div>
              </div>
              <div className='row'>
                <div className="mb-3 col-md-4">
                  <label htmlFor="quantity" className="form-label">Cantidad</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-4">
                  <label htmlFor="expDate" className="form-label">Fecha de Expiración (Opcional)</label>
                  <input type="date" className="form-control" id="expDate" name="expDate" />
                </div>
                <div className="mb-3 col-md-4">
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
        body: JSON.stringify({ description: entry, action: 'Cambio en Inventario', Organization: organizationId}),
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
        <BreadcrumbItem mainTitle="Gestión de Recursos" subTitle="Inventario" />
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
