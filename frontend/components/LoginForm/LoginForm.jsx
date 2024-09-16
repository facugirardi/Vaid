'use client';

import React, { useState, useEffect } from 'react';
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
                    toast.error('Failed to login. Please try again.');
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
                    <h3>Welcome!</h3>
                </div>

                <div className="input-box flex-item email-box">
                    <label className='label_input'>Email</label>
                    <div className='password-container'>
                    <input onChange={onChange} value={email} name='email' type="email" placeholder='Enter your email' required />
                </div>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Password</label>
                    <div className='password-container'>
                    <input
                        onChange={onChange}
                        value={password} 
                        name='password' 
                        type={showPassword ? 'text' : 'password'} // Alterna entre texto y password
                        placeholder='Enter your password' 
                        required />
                        <span onClick={toggleShowPassword} className='password-toggle'>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>

                <div className="remember-forgot flex-item">
                    <label><input type="checkbox" />Remember me</label>
                    <a href='/password-reset'>Forgot password?</a>
                </div>
                
                <div className='flex-item'>
                <button type="submit" >{isLoading ? <Spinner sm /> : 'Login'}</button>
                </div>

                <div className='flex-item'>
                <button onClick={googleAuth} className='google-button'><img src="/assets/images/google.png" alt="" className='google-logo'/>Login with Google</button>
                </div>
                
                <div className='register-link flex-item'>
                    <p>Don't have an account? <a href='/auth/register'>Register</a></p>
                </div>
                
            </form>
        </div>
    )
}

export default LoginForm;
