'use client';

import React, { useState, useEffect } from 'react';
import './RegisterForm.css';
import { useRegisterMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';

const RegisterForm = () => {
    const { push } = useRouter();
    const [register, { isLoading }] = useRegisterMutation();

    const [formData, setFormData] = useState({
        first_name : '',
        last_name : '',
        email : '',
        password : '',
        re_password : ''
    });

    const { first_name, last_name, email, password, re_password } = formData


    const onChange = (event) => {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value });
    }

    const onSubmit = (event) => {
        event.preventDefault();

        register({ first_name, last_name, email, password, re_password })
            .unwrap()
            .then(() => {
                toast.success('Please check email to verify your account.')
                push('/auth/login');

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
                    toast.error('Failed to register an account. Please try again.');
                }
            })
    }


    const [isActive, setIsActive] = useState(true); 

    const toggleSwitch = () => {
      setIsActive(!isActive);
    };
  
    return (
        <div className='wrapper'>
            <form onSubmit={onSubmit}>
                <div className='flex-item-logo'>
                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                </div>

                <div className='flex-item'>
                    <div className='switchContainer' onClick={toggleSwitch}>
                        <div className={`switchBtn ${isActive ? 'active' : ''}`}>
                            Organization
                        </div>
                        <div className={`switchBtn ${!isActive ? 'active' : ''}`}>
                            User
                        </div>
                    </div>
                </div>

                <div className="cont-sm input-box flex-item">
                    <div className='sm-input'>
                        <label htmlFor='first_name' className='label_input'>First Name</label>
                        <input onChange={onChange} value={first_name} name='first_name' type="text" placeholder='First Name' required />
                    </div>

                    <div className='sm-input'>
                        <label htmlFor='last_name' className='label_input'>Last Name</label>
                        <input onChange={onChange} value={last_name} name='last_name' type="text" placeholder='Last Name' required />
                    </div>
                </div>

                <div className="input-box flex-item">
                    <label htmlFor='email' className='label_input'>Email</label>
                    <input onChange={onChange} value={email} name='email' type="text" placeholder='Enter your email' required />
                </div>

                <div className="input-box flex-item">
                    <label htmlFor='password' className='label_input'>Password</label>
                    <input onChange={onChange} value={password} name='password' type="password" placeholder='Enter your password' required />
                </div>

                <div className="input-box flex-item">
                    <label htmlFor='re_password' className='label_input'>Confirm Password</label>
                    <input onChange={onChange} value={re_password} name='re_password' type="password" placeholder='Confirm your password' required />
                </div>

                
                <div className='flex-item btn_cont'>
                <button type="submit">{isLoading ? <Spinner sm /> : 'Continue'}</button>
                </div>

                <div className='flex-item'>
                <button type="submit" className='google-button'><img src="/assets/images/google.png" alt="" className='google-logo'/>Continue with Google</button>
                </div>
                
                <div className='register-link flex-item'>
                    <p>Already have an account? <a href='/auth/login'>Login</a></p>
                </div>
                
            </form>
        </div>
    )
}

export default RegisterForm;