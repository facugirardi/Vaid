import React, { useState, useEffect } from 'react';
import './RegisterForm.css';

const RegisterForm = () => {
    const [isActive, setIsActive] = useState(true); 

    const toggleSwitch = () => {
      setIsActive(!isActive);
    };
  
    return (
        <div className='wrapper'>
            <form action= "">
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
                        <label className='label_input'>First Name</label>
                        <input type="text" placeholder='First Name' required />
                    </div>

                    <div className='sm-input'>
                        <label className='label_input'>Last Name</label>
                        <input type="text" placeholder='Last Name' required />
                    </div>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Email</label>
                    <input type="text" placeholder='Enter your email' required />
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Password</label>
                    <input type="password" placeholder='Enter your password' required />
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Confirm Password</label>
                    <input type="password" placeholder='Confirm your password' required />
                </div>

                
                <div className='flex-item btn_cont'>
                <button type="submit">Continue</button>
                </div>

                <div className='flex-item'>
                <button type="submit" className='google-button'><img src="/assets/images/google.png" alt="" className='google-logo'/>Continue with Google</button>
                </div>
                
                <div className='register-link flex-item'>
                    <p>Already have an account? <a href='#'>Login</a></p>
                </div>
                
            </form>
        </div>
    )
}

export default RegisterForm;