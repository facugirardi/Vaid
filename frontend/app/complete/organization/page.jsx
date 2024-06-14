"use client";

import React, { useState } from 'react';
import LandingLayout from "@/layouts/LandingLayout";
import './comp-org.css'
import Image from 'next/image';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const breaks = Array(4).fill(0).map((_, i) => <br key={i} />); 

const page = () => {
    const { push } = useRouter();
    const { data: user } = useRetrieveUserQuery();

  return (


      


    <LandingLayout header footer bodyClass={"home-three"} onePage>
      <section
        className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100"
      >
                <div className="container">
          <div className="d-flex justify-content-center">

              <div className='wrapper-complete-user'>
            <form >
                <div className='flex-item-logo'>
                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Organization Name</label>
                    <input name='name' type="text" placeholder='Enter the name of your organization' required />
                </div>


                <div className="input-box flex-item">
                    <label className='label_input'>Website (Optional)</label>
                    <input name='website' type="text" placeholder='Enter your website' />
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Description</label>
                    <input name='description' className='description-org' type="text" placeholder='Enter a description' required />
                </div>
                <div className='flex-item'>
                <button type="submit" >Continue</button>
                </div>
                
            </form>
        </div>
        </div>
        </div>
      </section>
      {breaks}    
    </LandingLayout>




  );
}
export default page;
