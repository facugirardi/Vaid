'use client';

import React, { useState } from 'react';
import './RegisterForm.css';
import { useRegisterMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import googleAuth from '@/utility/google-auth';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Eye, EyeSlash } from 'phosphor-react';

const RegisterForm = () => {
    const { push } = useRouter();
    const [register, { isLoading }] = useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false); // Estado para alternar la visibilidad de la contraseña

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const { first_name, last_name, email, password, re_password } = formData;

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const onSubmit = (event) => {
        event.preventDefault();

        register({ first_name, last_name, email, password, re_password })
            .unwrap()
            .then(() => {
                toast.success('Por favor, verifica tu correo electrónico para confirmar tu cuenta.');
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 5000);
            })
            .catch((error) => {
                console.log(error);

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
                    toast.error('Error al registrar la cuenta. Por favor, inténtalo de nuevo.');
                }
            })
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Alterna la visibilidad de la contraseña
    };

    return (
        <div className='wrapper'>
            <form onSubmit={onSubmit}>
                <div className='flex-item-logo'>
                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login' />
                </div>

                <div className="cont-sm input-box flex-item">
                    <div className='sm-input'>
                        <label htmlFor='first_name' className='label_input'>Nombre</label>
                        <div className='password-container'>
                            <input onChange={onChange} value={first_name} name='first_name' type="text" placeholder='Nombre' required />
                        </div>
                    </div>

                    <div className='sm-input'>
                        <label htmlFor='last_name' className='label_input'>Apellido</label>
                        <div className='password-container'>
                            <input onChange={onChange} value={last_name} name='last_name' type="text" placeholder='Apellido' required />
                        </div>
                    </div>
                </div>

                <div className="input-box flex-item">
                    <label htmlFor='email' className='label_input'>Correo electrónico</label>
                    <div className='password-container'>
                        <input onChange={onChange} value={email} name='email' type="text" placeholder='Ingresa tu correo electrónico' required />
                    </div>
                </div>

                <div className="input-box flex-item">
                    <label htmlFor='password' className='label_input'>Contraseña</label>
                    <div className='password-container'>
                        <input
                            onChange={onChange}
                            value={password}
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Ingresa tu contraseña' required />
                        <span onClick={toggleShowPassword} className='password-toggle'>
                            {showPassword ? <EyeSlash  className='hover-button-eye'/> : <Eye className='hover-button-eye'/>}
                        </span>
                    </div>
                </div>

                <div className="input-box flex-item">
                    <label htmlFor='re_password' className='label_input'>Confirma tu contraseña</label>
                    <div className='password-container'>
                        <input onChange={onChange} value={re_password} name='re_password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Confirma tu contraseña' required />
                        <span onClick={toggleShowPassword} className='password-toggle'>
                            {showPassword ? <EyeSlash  className='hover-button-eye'/> : <Eye className='hover-button-eye'/>}
                        </span>
                    </div>
                </div>

                <div className='flex-item btn_cont'>
                    <button type="submit">{isLoading ? <Spinner sm /> : 'Registrarse'}</button>
                </div>

                <div className='flex-item'>
                    <button onClick={googleAuth} className='google-button'>
                        <img src="/assets/images/google.png" alt="" className='google-logo' />
                        Registrarse con Google
                    </button>
                </div>

                <div className='register-link flex-item'>
                    <p>¿Ya tienes una cuenta? <a href='/auth/login'>Iniciar sesión</a></p>
                </div>
            </form>
        </div>
    )
}

export default RegisterForm;
