"use client";

import React, { useState } from 'react';
import LandingLayout from "@/layouts/LandingLayout";
import './choose.css'
import Image from 'next/image';

const breaks = Array(4).fill(0).map((_, i) => <br key={i} />); 

const page = () => {
const [selection, setSelection] = useState(null);

  const handleSelect = (option) => {
    setSelection(option);
  };

  const handleContinue = () => {
    if (selection === 'organization') {
      console.log('Continuar como Organización');
    } else if (selection === 'user') {
      console.log('Continuar como Usuario');
    }
  };

  return (
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      <section
        className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100"
      >
        <div className="container">
        <div className='flex-item-logo'>
          <h3>Join as Organization or User</h3>
                <div className='cont-btns-choose'>
                <button className='btn-gen' onClick={() => handleSelect('organization')}
                    style={{
                    backgroundColor: selection === 'organization' ? '#F2F2F2' : 'white',
                    marginRight: '35px'  
                    }}
                >
                        <Image
                        className="img-icon2"
                        src="/assets/images/icons/9024986_users_three_light_icon.svg"
                        alt="Icon"
                        width={0}  // Ancho deseado de la imagen
                        height={0} // Altura deseada de la imagen
                        layout="responsive" 
                    />
                    <br></br>
                    I have an organization,<br></br>and I want to manage it.
                </button>
                <button className='btn-gen' onClick={() => handleSelect('user')}

                    style={{
                    backgroundColor: selection === 'user' ? '#F2F2F2' : 'white',
                    marginLeft: '35px' 
                    }}
                >
                    <Image
                        className="img-icon2"
                        src="/assets/images/icons/5340287_man_people_person_user_users_icon.svg"
                        alt="Icon"
                        width={0}  // Ancho deseado de la imagen
                        height={0} // Altura deseada de la imagen
                        layout="responsive" 
                    />
                    <br></br>
                    I'm a user, and I'm part<br></br>of an organization.
                </button>
                </div>
                <button className='btn-pass' onClick={handleContinue}>Continue</button>
        </div>
        </div>
      </section>
      {breaks}    
    </LandingLayout>
  );
}
export default page;

