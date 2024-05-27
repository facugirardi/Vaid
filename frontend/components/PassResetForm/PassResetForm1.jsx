'use client';

import React, { useState, useEffect } from 'react';
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
                toast.success('If there is an existing account with that credentials, you will receive an email with a reset link')
            })
            .catch((error) => {
                console.log(error); // Muestra el error en la consola
            
                if (error.data && typeof error.data === 'object') {
                    Object.keys(error.data).forEach(key => {
                        const messages = error.data[key];
                        if (Array.isArray(messages)) {
                            messages.forEach(message => {
                                toast.error(message); // Muestra cada mensaje de error individualmente
                            });
                        } else {
                            toast.error(messages); // Muestra un mensaje directo
                        }
                    });
                } else if (error.message) {
                    // Si solo hay un mensaje de error general
                    toast.error(error.message);
                } else {
                    // Mensaje de error genérico si no hay información específica
                    toast.error('Failed to send request. Please try again.');
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
                    <h3>Change your password</h3>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Enter your email</label>
                    <input onChange={onChange} value={email} name='email' type="text" placeholder='Enter your email' required />
                </div>

                <div className='flex-item'>
                <button type="submit" className='btn-pass'>Send</button>
                </div>

                
            </form>
        </div>
    )
}

export default PassResetForm1;