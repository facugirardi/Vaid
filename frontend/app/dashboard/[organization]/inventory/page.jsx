"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { Modal, Button, Form } from 'react-bootstrap';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from "react-toastify";
import { Eye, EyeSlash, Trash, PencilSimpleLine } from 'phosphor-react';
import Select from 'react-select'; // Importa React Select
import { faFilter } from '@fortawesome/free-solid-svg-icons'; // Asegúrate de importar el ícono de filtro

const Headquarters = ({ onHeadquarterClick, addHistoryEntry, headquarters, setHeadquarters, user }) => {
  const [organizationId, setOrganizationId] = useState("");
  const [showHeadquarterModal, setShowHeadquarterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHeadquarter, setSelectedHeadquarter] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");


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

  const handleEditModalClose = () => setShowEditModal(false);
  const handleEditModalShow = (hq) => {
    setSelectedHeadquarter(hq);
    setEditName(hq.name);
    setEditAddress(hq.address);
    setShowEditModal(true);
  };

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
            setHeadquarters(headquarters.filter(hq => hq.id !== selectedHeadquarter.id));

            if (headquarters.length === 1) {
                onHeadquarterClick(null); 
            }

            if (user) {
              addHistoryEntry(`Registro de sede "${selectedHeadquarter.name}" eliminado por ${user.first_name} ${user.last_name}`, 'Eliminación de Sede');
            }
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
            setHeadquarters([...headquarters, newHeadquarter]);
            if (user) {
              addHistoryEntry(`Registro de sede "${newHeadquarter.name}" agregado por ${user.first_name} ${user.last_name}`, 'Creación de Sede');
            }
                handleHeadquarterModalClose(); 
        } else {
            toast.error('Error en la respuesta:', response.status);
        }
    } catch (error) {
        toast.error('Error:', error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const updatedData = {
      name: editName,
      address: editAddress,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/headquarters/${organizationId}/edit/${selectedHeadquarter.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedHeadquarter = await response.json();
        const updatedHeadquartersList = headquarters.map(hq => hq.id === updatedHeadquarter.id ? updatedHeadquarter : hq);
        setHeadquarters(updatedHeadquartersList);
        toast.success('Sede actualizada con éxito');
        if (user) {
          addHistoryEntry(`Registro de sede "${updatedHeadquarter.name}" editado por ${user.first_name} ${user.last_name}`, 'Edición de Sede');
        }
        handleEditModalClose();
      } else {
        toast.error('Error al actualizar la sede:', response.status);
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
            <p>No hay sedes disponibles.</p>
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
                <td className=" d-flex align-items-center justify-content-start p-inventory">
                  <span className='ml-td0'>{hq.address}</span>
                </td>
                <td className="d-flex align-items-center justify-content-end">
                  <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditModalShow(hq); }}>
                    <PencilSimpleLine className='hover-button' size={21} weight="bold" />
                  </button>
                  <button className="edit-button trash-btn" onClick={(e) => { e.stopPropagation(); handleDeleteModalShow(hq); }}>
                    <Trash className='hover-button-trash' size={20} weight="bold" />
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

      {/* Modal for Adding Headquarters */}
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

      {/* Modal for Editing Headquarters */}
      <Modal show={showEditModal} onHide={handleEditModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Editar Sede</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-6">
                  <label htmlFor="editHeadquarterName" className="form-label">Nombre de la Sede</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="editHeadquarterName" 
                    name="name" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)} 
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="editHeadquarterAddress" className="form-label">Nombre de la Dirección</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="editHeadquarterAddress" 
                    name="address" 
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)} 
                    required
                  />
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal for Deleting Headquarters */}
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

const Inventory = ({ headquarterId, organizationId, addHistoryEntry, user }) => {
  const [inventory, setInventory] = useState([]);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState(0);
  const [editStatus, setEditStatus] = useState(1);
  const [editCategory, setEditCategory] = useState('');
  const [editExpDate, setEditExpDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterExpiration, setFilterExpiration] = useState('');
  const [showFilters, setShowFilters] = useState(false); // Estado para controlar la visibilidad de los filtros

  const categoryOptions = [
    { value: '', label: 'Todas las Categorías' },
    { value: 'Comida', label: 'Comida' },
    { value: 'Herramientas', label: 'Herramientas' },
    { value: 'Bebidas', label: 'Bebidas' },
    { value: 'Dinero', label: 'Dinero' },
    { value: 'Otros', label: 'Otros' },
    { value: 'Medicamentos', label: 'Medicamentos' },
    { value: 'Ropa', label: 'Ropa' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'Disponible', label: 'Disponible' },
    { value: 'No Disponible', label: 'No Disponible' },
  ];

  const expirationOptions = [
    { value: '', label: 'Sin Orden' },
    { value: 'asc', label: 'Expira Antes' },
    { value: 'desc', label: 'Expira Después' },
  ];
  const toggleFilters = () => setShowFilters(!showFilters); // Función para alternar la visibilidad de los filtros

  const applyFilters = (products) => {
    let filteredProducts = products.filter(product => {
      const matchesCategory = filterCategory ? product.Product.category_name === filterCategory : true;
      const matchesStatus = filterStatus ? product.Product.status_name === filterStatus : true;
      return matchesCategory && matchesStatus;
    });

    if (filterExpiration === 'asc') {
      filteredProducts.sort((a, b) => new Date(a.Product.expDate) - new Date(b.Product.expDate));
    } else if (filterExpiration === 'desc') {
      filteredProducts.sort((a, b) => new Date(b.Product.expDate) - new Date(a.Product.expDate));
    }

    return filteredProducts;
  };

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

const handleEditProductSubmit = async (event) => {
    event.preventDefault();

    const updatedProduct = {
        name: editName,
        cuantity: editQuantity,
        Status: editStatus,
        Category: editCategory,
        expDate: editExpDate,
    };

    try {
        const response = await fetch(`http://localhost:8000/api/products/${selectedProduct.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
            const updatedProductData = await response.json();

            // Actualiza el inventario manteniendo los valores no cambiados
            setInventory((prevInventory) =>
                prevInventory.map((item) =>
                    item.Product.id === updatedProductData.id
                        ? { 
                            ...item, 
                            cuantity: updatedProductData.cuantity ?? item.cuantity,
                            Product: { ...item.Product, ...updatedProductData }
                        }
                        : item
                )
            );
            if (user) {
              addHistoryEntry(`Producto "${updatedProductData.name}" editado por ${user.first_name} ${user.last_name}`, 'Cambio en Inventario');
            } else {
              console.warn("Usuario no disponible para el registro en el historial.");
            }
      
            toast.success('Producto actualizado con éxito');
            handleEditProductModalClose();
        } else {
            toast.error('Error al actualizar el producto:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error al actualizar el producto');
    }
};

  const handleProductModalClose = () => setShowProductModal(false);

  const handleDeleteProductModalShow = (product) => {
    setSelectedProduct(product);
    setShowDeleteProductModal(true);
  };
const handleEditProductModalShow = (inventoryItem) => {
    // Obtén el id de Product dentro del item de inventario
    const productId = inventoryItem.Product.id;

    // Encuentra el elemento en el inventario que tenga el id del Product correcto
    const productToEdit = inventory.find(item => item.Product.id === productId);

    if (productToEdit) {
        // Configura los datos del producto para editar
        setSelectedProduct(productToEdit.Product);
        setEditName(productToEdit.Product.name);
        setEditQuantity(productToEdit.cuantity);
        setEditStatus(productToEdit.Product.Status);
        setEditCategory(productToEdit.Product.category_name);
        setEditExpDate(productToEdit.Product.expDate);
        setShowEditProductModal(true); // Abre el modal
    } else {
        console.warn("Producto no encontrado en el inventario:", inventoryItem);
    }
};
  const handleEditProductModalClose = () => setShowEditProductModal(false);

  const handleDeleteProductModalClose = () => setShowDeleteProductModal(false);
  

const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
        console.log("Producto a eliminar:", selectedProduct);
        const response = await fetch(`http://localhost:8000/api/products/${selectedProduct.id}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log("Inventario antes de eliminar:", inventory);

            // Convertir el id a un número en caso de diferencias de tipo
            const selectedProductId = Number(selectedProduct.id);

            // Actualizar el estado del inventario usando item.Product.id para el filtro
            setInventory((prevInventory) => {
                const updatedInventory = prevInventory.filter(item => Number(item.Product.id) !== selectedProductId);

                console.log("Inventario después de eliminar:", updatedInventory);
                return updatedInventory;
            });
            if (user) {
              addHistoryEntry(`Producto "${selectedProduct.name}" eliminado por ${user.first_name} ${user.last_name}`, 'Cambio en Inventario');
            } else {
              console.warn("Usuario no disponible para el registro en el historial.");
            }
      
            setShowDeleteProductModal(false);
            toast.success(`Producto "${selectedProduct.name}" eliminado con éxito`);
        } else {
            toast.error('Error al borrar el producto:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
        toast.error('Error al borrar el producto');
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
          if (user) {
            addHistoryEntry(`Producto "${newProduct.Product.name}" agregado por ${user.first_name} ${user.last_name}`, 'Cambio en Inventario');
          } else {
            console.warn("Usuario no disponible para el registro en el historial.");
          }
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

      {showFilters && (
        <div className="filter-controls row">
          <div className="col-md-4">
            <Select
              options={categoryOptions}
              value={categoryOptions.find(option => option.value === filterCategory)}
              onChange={(selectedOption) => setFilterCategory(selectedOption.value)}
              placeholder="Selecciona una categoría"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <div className="col-md-4">
            <Select
              options={statusOptions}
              value={statusOptions.find(option => option.value === filterStatus)}
              onChange={(selectedOption) => setFilterStatus(selectedOption.value)}
              placeholder="Selecciona un estado"
            />
          </div>
          <div className="col-md-4">
            <Select
              options={expirationOptions}
              value={expirationOptions.find(option => option.value === filterExpiration)}
              onChange={(selectedOption) => setFilterExpiration(selectedOption.value)}
              placeholder="Orden de expiración"
            />
          </div>
        </div>
      )}
      {!headquarterId ? (
        <>
        <br/>
        <p className='p-inventory'>Por favor, selecciona una sede para ver el inventario.</p>
        </>
      ) : applyFilters(inventory).length === 0 ? (
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
              {applyFilters(inventory).map(item => (
                <tr key={item.id}>
                  <td className='text-center p-inventory'><b>{item?.Product?.name}</b></td>
                  <td className='text-center '>{item.cuantity}</td>
                  <td className='text-center p-inventory'><b>{item?.Product?.status_name}</b></td>
                  <td
                    className="text-center p-donation"
                    style={{
                      color:
                        item?.Product?.category_name === "Comida"
                          ? "#795548"
                          : item?.Product?.category_name === "Herramientas"
                          ? "#2196F3"
                          : item?.Product?.category_name === "Bebidas"
                          ? "#FF9800"
                          : item?.Product?.category_name === "Dinero"
                          ? "#2BC155"
                          : item?.Product?.category_name === "Otros"
                          ? "#9E9E9E"
                          : item?.Product?.category_name === "Medicamentos"
                          ? "#FF3E3E"
                          : item?.Product?.category_name === "Ropa"
                          ? "#9C27B0"
                          : "inherit", 
                    }}
                  >
                    {item?.Product?.category_name}
                  </td>
                  <td className='text-center'>
                  <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleEditProductModalShow(item); }}>
                    <PencilSimpleLine className='hover-button' size={20} weight="bold" />
                  </button>
                    <button className="icon-button" onClick={() => handleProductModalShow(item.Product)}>
                      <Eye className='hover-button' size={20} weight="bold" />
                    </button>
                    <button className="icon-button" onClick={() => handleDeleteProductModalShow(item.Product)}>
                      <Trash className='hover-button-trash' size={20} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="add-button" onClick={handleInventoryModalShow}>
            <FontAwesomeIcon icon={faPlus} className='hover-button'/>
          </button>
          <div className="add-button filter-toggle" onClick={toggleFilters}>
            <FontAwesomeIcon icon={faFilter} className='hover-button' />
          </div>
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
                  <label htmlFor="productName" className="form-label">Descripción</label>
                  <input type="text" className="form-control" id="productName" name="name" placeholder='Nombre del Producto' required />
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="quantity" className="form-label">Unidades</label>
                  <input type="number" className="form-control" id="quantity" name="quantity" placeholder='1' required />
                </div>
                <div className="mb-3 col-md-3">
                  <label htmlFor="expDate" className="form-label">Expiración (Opcional)</label>
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

      <Modal show={showEditProductModal} onHide={handleEditProductModalClose} backdropClassName="modal-backdrop" centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditProductSubmit}>
            <div className='container'>
              <div className='row'>
                <div className="mb-3 col-md-6">
                  <label htmlFor="editProductName" className="form-label">Descripción</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="editProductName" 
                    name="name" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3 col-md-4">
                  <label htmlFor="editProductStatus" className="form-label">Estado</label>
                  <Form.Control 
                    as="select" 
                    className="form-select" 
                    id="editProductStatus" 
                    name="status"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    required
                  >
                    <option value={1}>Disponible</option>
                    <option value={2}>No Disponible</option>
                  </Form.Control>
                </div>
                <div className="mb-3 col-md-2">
                  <label htmlFor="editProductQuantity" className="form-label">Unidades</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="editProductQuantity" 
                    name="quantity" 
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="editProductCategory" className="form-label">Categoría</label>
                  <Form.Control 
                    as="select" 
                    className="form-select" 
                    id="editProductCategory" 
                    name="category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    required
                  >
                    <option>Ropa</option>
                    <option>Comida</option>
                    <option>Bebidas</option>
                    <option>Medicamentos</option>
                    <option>Herramientas</option>
                    <option>Otros</option>
                    <option>Dinero</option>
                  </Form.Control>
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="editProductExpDate" className="form-label">Fecha de Expiración</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    id="editProductExpDate" 
                    name="expDate" 
                    value={editExpDate}
                    onChange={(e) => setEditExpDate(e.target.value)} 
                  />
                </div>
              </div>
              <div className='d-flex justify-content-center mt-20'>
                <Button variant="primary" type="submit">
                  Guardar Cambios
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
      <br />
      <ul className="history-list mt-20">
        {Array.isArray(localHistory) && localHistory.length === 0 ? (
          <p className='p-inventory'>No hay historial todavía</p>
        ) : (
          Array.isArray(localHistory) &&
          [...localHistory]
            .reverse() // Invierte el orden para mostrar del más reciente al más antiguo
            .map((entry, index) => (
              <div key={index} className='container'>
                <div className='row align-items-center'>
                  <div className='col-5 col-md-3 text-center'>
                    <p className='p-history'>{entry.date}</p>
                  </div>
                  <div className='col-5 col-md-8'>
                    <p className='p-history'>
                      <b>{entry.action}</b>
                      {entry.description.includes('agregado') && (
                        <span className="badge bg-success ms-2">Agregado</span>
                      )}
                      {entry.description.includes('eliminado') && (
                        <span className="badge bg-danger ms-2">Eliminado</span>
                      )}
                      {entry.description.includes('editado') && (
                        <span className="badge bg-warning ms-2">Editado</span>
                      )}
                    </p>
                    <p className='p-history'>{entry.description}</p>
                  </div>
                </div> 
                <br />
              </div>
            ))
        )}
      </ul>
    </div>
  );
};

const Page = () => {
  const { data: user, isError, isLoading } = useRetrieveUserQuery();
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

  const fetchHistory = async () => {
    if (organizationId) {
      try {
        const response = await fetch(`http://localhost:8000/api/organizations/${organizationId}/history/`);
        const data = await response.json();
        setLocalHistory(data);
      } catch (error) {
        console.error('Error al obtener el historial:', error);
      }
    }
  };

  const addHistoryEntry = async (description, action) => {
    if (!user) {
      console.error('Usuario no disponible para el registro en el historial.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/${organizationId}/history/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, action, Organization: organizationId }),
      });

      if (response.ok) {
        console.log('Historial registrado con éxito');
        fetchHistory(); // Actualiza el historial después de registrar una entrada
      } else {
        toast.error('Error al registrar el historial');
      }
    } catch (error) {
      console.error('Error:', error);
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
              user={user}
            />
            <History organizationId={organizationId} localHistory={localHistory} setLocalHistory={setLocalHistory} />
          </div>
          <div className="col-md-6">
            <Inventory
              headquarterId={selectedHeadquarterId}
              organizationId={organizationId}
              addHistoryEntry={addHistoryEntry}
              user={user}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
