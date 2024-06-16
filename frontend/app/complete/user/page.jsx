
"use client";

import React, { useState } from 'react';
import LandingLayout from "@/layouts/LandingLayout";
import './comp-user.css'
import Image from 'next/image';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import FeatherIcon from "feather-icons-react";

const breaks = Array(4).fill(0).map((_, i) => <br key={i} />); 

const page = () => {
    const { push } = useRouter();
    const { data: user } = useRetrieveUserQuery();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    


  const onFileChange = event => {
      if (event.target.files && event.target.files[0]) {
          setFile(event.target.files[0]);
         setPreview(URL.createObjectURL(event.target.files[0]));
      } else {
         setFile(null);
         setPreview(null);
      }
  };


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


                <div className="input-box flex-item-upload">


                <label htmlFor="upload-button" className="upload-button">
                    {preview ? (
                        <img src={preview} alt="Preview" className="preview-img" />
                    ) : (
                        <div className="icon-container">
                        <FeatherIcon icon="upload" />
                        </div>
                    )}
                    <input id="upload-button" type="file" onChange={onFileChange} style={{ display: 'none' }} />
                </label>
                 <label className='label_input upl-label'>Click to upload a picture</label>
                </div>



                <div className="input-box flex-item">
                    <label className='label_input'>Country</label>
                    <input name='country' type="text" placeholder='Enter your country' required />
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Phone Number</label>
                    <input name='phone' type="text" placeholder='Enter your phone number' required />
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Tell us about yourself!</label>
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
