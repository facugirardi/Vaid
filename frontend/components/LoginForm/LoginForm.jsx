import React from 'react';
import './LoginForm.css';

const LoginForm = () => {
    return (
        <div className='wrapper'>
            <form action= "">
                <div className='flex-item-logo'>
                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                </div>

                <div className='flex-item'>
                    <h3>Welcome!</h3>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Email</label>
                    <input type="text" placeholder='Enter your email' required />
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Password</label>
                    <input type="password" placeholder='Enter your password' required />
                </div>

                <div className="remember-forgot flex-item">
                    <label><input type="checkbox" />Remember me</label>
                    <a href='#'>Forgot password?</a>
                </div>
                
                <div className='flex-item'>
                <button type="submit">Login</button>
                </div>

                <div className='flex-item'>
                <button type="submit" className='google-button'><img src="/assets/images/google.png" alt="" className='google-logo'/>Login with Google</button>
                </div>
                
                <div className='register-link flex-item'>
                    <p>Don't have an account? <a href='/auth/register'>Register</a></p>
                </div>
                
            </form>
        </div>
    )
}

export default LoginForm;