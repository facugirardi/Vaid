'use client';

import React, { useState, useEffect } from 'react';

const PassResetForm2 = ({params}) => {



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
                    <label className='label_input'>Enter your new password</label>
                    <input onChange={onChange} value={new_password} name='new_password' type="password" placeholder='Enter new password' required />
                </div>


                <div className="input-box flex-item">
                    <label className='label_input'>Confirm your new password</label>
                    <input onChange={onChange}  value={re_new_password} name='re_new_password' type="password" placeholder='Confirm new password' required />
                </div>

                <div className='flex-item'>
                <button type="submit">Change</button>
                </div>

                
            </form>
        </div>
    )
}

export default PassResetForm2;