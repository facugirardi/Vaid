"use client";

import React, { useState } from 'react';
import LandingLayout from "@/layouts/LandingLayout";
import './comp-user.css';
import Image from 'next/image';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import FeatherIcon from "feather-icons-react";
import axios from 'axios';
import { countries } from "@/common/countries";

const breaks = Array(4).fill(0).map((_, i) => <br key={i} />); 

const page = () => {
  const { push } = useRouter();
  const { data: user } = useRetrieveUserQuery();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onFileChange = event => {
      if (event.target.files && event.target.files[0]) {
          setFile(event.target.files[0]);
          setPreview(URL.createObjectURL(event.target.files[0]));
      } else {
          setFile(null);
          setPreview(null);
      }
  };

  const handleSubmit = async (event) => {
      event.preventDefault();

      const formData = new FormData();
      formData.append('country', event.target['country'].value);
      formData.append('phone_number', event.target['phone_number'].value);
      formData.append('description', event.target['description'].value);
      formData.append('user_id', user.id);

      const formData2 = new FormData();
      if (file) {
          formData2.append('image', file);
      }
      formData2.append('user_id', user.id);

      try {
          const response = await axios.post('http://localhost:8000/api/upload-image', formData2, {
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',
              }
          });

          if (response.status === 201) {
              try {
                  const response = await fetch('http://localhost:8000/api/user/person', {
                      method: 'POST',
                      body: formData,
                  });

                  if (response.ok) {
                      try {
                          const response = await fetch(`http://localhost:8000/api/user/${user.id}/complete`, {
                              method: 'PATCH',
                              headers: {
                                  'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                  user_type: 1,
                                  is_completed: 1,
                              }),
                          });

                          if (response.ok) {
                              window.location.href = '/dashboard';
                          } else {
                              toast.error('La respuesta de la red no fue satisfactoria.');
                          }
                      } catch (error) {
                          toast.error('Error al actualizar el usuario. Error: ', error);
                      }
                  } else {
                      const errorData = await response.json();
                      toast.error(`Error al crear el usuario: ${errorData.error}`);
                  }
              } catch (error) {
                  console.error('Error al enviar el formulario:', error);
                  toast.error('Error al enviar el formulario');
              }
          } else {
              toast.error('Error al subir la imagen.');
          }
      } catch (error) {
          console.error('Error al enviar la imagen: ', error);
          toast.error('Error al enviar la imagen');
      }
  };

  return (      
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      <section className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100">
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className='wrapper-complete-user'>
              <form onSubmit={handleSubmit}>
                <div className='flex-item-logo'>
                  <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                </div>
                <div className="input-box flex-item-upload">
                  <label htmlFor="upload-button" className="upload-button">
                    {preview ? (
                      <img src={preview} alt="Vista Previa" className="preview-img" />
                    ) : (
                      <div className="icon-container">
                        <FeatherIcon icon="upload" />
                      </div>
                    )}
                    <input id="upload-button" type="file" onChange={onFileChange} style={{ display: 'none' }} />
                  </label>
                  <label className='label_input upl-label'>Haz clic para subir una imagen <span className='asterisco-rojo'>*</span></label>
                </div>
                <div className="input-box flex-item">
                  <label className='label_input'>País <span className='asterisco-rojo'>*</span></label>
                  <select name='country' className='country_label' required>
                    {countries.map((country, index) => (
                      <option key={index} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-box flex-item">
                  <label className='label_input'>Número de Teléfono <span className='asterisco-rojo'>*</span></label>
                  <input name='phone_number' type="text" placeholder='Introduce tu número de teléfono' required />
                </div>
                <div className="input-box flex-item">
                  <label className='label_input'>¡Cuéntanos sobre ti! <span className='asterisco-rojo'>*</span></label>
                  <input name='description' className='description-org' type="text" placeholder='Introduce una descripción' required />
                </div>
                <div className='flex-item'>
                  <button type="submit">Continuar</button>
                </div>
              </form>
              <div className="d-flex justify-content-center">
                <label className='label_input'>Los campos obligatorios tienen: <span className='asterisco-rojo'>*</span></label>
              </div>
            </div>
          </div>
        </div>
      </section>
      {breaks}    
    </LandingLayout>
  );
}
export default page;
