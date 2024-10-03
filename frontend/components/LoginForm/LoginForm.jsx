'use client';

import React, { useState } from 'react';
import './LoginForm.css';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { useRouter } from 'next/navigation';
import { setAuth } from '@/redux/features/authSlice'
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'react-toastify';
import Spinner from '@/components/common/Spinner';
import googleAuth from '@/utility/google-auth';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Eye, EyeSlash } from 'phosphor-react';

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const { push } = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false); // Estado para alternar la visibilidad de la contraseña

    const [formData, setFormData] = useState({
        email : '',
        password : '',
    });

    const { email, password } = formData

    const onChange = (event) => {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value });
    }

    const onSubmit = (event) => {
        event.preventDefault();
    
        login({ email, password })
            .unwrap()
            .then((response) => {
                dispatch(setAuth()); 
                window.location.href = '/dashboard';
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
                    toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
                }
            });
    }
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Alterna la visibilidad de la contraseña
    };

    return (
        <div className='wrapper'>
            <form onSubmit={onSubmit}>
                <div className='flex-item-logo'>
                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                </div>

                <div className='flex-item'>
                    <h3>¡Bienvenido!</h3>
                </div>

                <div className="input-box flex-item email-box">
                    <label className='label_input'>Correo electrónico</label>
                    <div className='password-container'>
                        <input onChange={onChange} value={email} name='email' type="email" placeholder='Ingresa tu correo electrónico' required />
                    </div>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Contraseña</label>
                    <div className='password-container'>
                        <input
                            onChange={onChange}
                            value={password} 
                            name='password' 
                            type={showPassword ? 'text' : 'password'} // Alterna entre texto y password
                            placeholder='Ingresa tu contraseña' 
                            required />
                        <span onClick={toggleShowPassword} className='password-toggle'>
                            {showPassword ? <EyeSlash  className='hover-button-eye'/> : <Eye className='hover-button-eye'/>}
                        </span>
                    </div>
                </div>

                <div className="remember-forgot flex-item">
                    <label><input type="checkbox" />Recuérdame</label>
                    <a href='/password-reset'>¿Olvidaste tu contraseña?</a>
                </div>
                
                <div className='flex-item'>
                    <button type="submit" >{isLoading ? <Spinner sm /> : 'Iniciar sesión'}</button>
                </div>

                <div className='flex-item'>
                    <button onClick={googleAuth} className='google-button'><img src="/assets/images/google.png" alt="" className='google-logo'/>Iniciar sesión con Google</button>
                </div>
                
                <div className='register-link flex-item'>
                    <p>¿No tienes una cuenta? <a href='/auth/register'>Regístrate</a></p>
                </div>
                
            </form>
        </div>
    )
}

export default LoginForm;
