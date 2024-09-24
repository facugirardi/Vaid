'use client';

import React, { useState } from 'react';
import './PassResetForm1.css';
import { useResetPasswordMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

const PassResetForm1 = () => {
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const [email, setEmail] = useState();

    const onChange = (event) => {
        setEmail(event.target.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        resetPassword(email)
            .unwrap()
            .then(() => {
                toast.success('Si existe una cuenta con esas credenciales, recibirás un correo con un enlace para restablecer la contraseña.')
            })
            .catch((error) => {            
                if (error.data && typeof error.data === 'object') {
                    Object.keys(error.data).forEach(key => {
                        const messages = error.data[key];
                        if (Array.isArray(messages)) {
                            messages.forEach(message => {
                                toast.error(message);
                            });
                        } else {
                            toast.error(messages);
                        }
                    });
                } else if (error.message) {
                    toast.error(error.message);
                } else {
                    toast.error('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
                }
            })
    }

    return (
        <div className='wrapper'>
            <form onSubmit={onSubmit}>
                <div className='flex-item-logo'>
                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                </div>

                <div className='flex-item-logo'>
                    <h3>Cambia tu contraseña</h3>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Ingresa tu correo electrónico</label>
                    <input onChange={onChange} value={email} name='email' type="text" placeholder='Ingresa tu correo electrónico' required />
                </div>

                <div className='flex-item'>
                    <button type="submit" className='btn-pass'>Enviar</button>
                </div>
            </form>
        </div>
    )
}

export default PassResetForm1;
