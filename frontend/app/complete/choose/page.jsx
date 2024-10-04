"use client";

import React, { useState } from 'react';
import LandingLayout from "@/layouts/LandingLayout";
import './choose.css'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const breaks = Array(4).fill(0).map((_, i) => <br key={i} />); 

const page = () => {
  const [selection, setSelection] = useState(null);
  const { push } = useRouter();

  const handleSelect = (option) => {
    setSelection(option);
  };

  const handleContinue = async () => {
    if (!selection) {
      toast.error('Selecciona una opción.'); 
      return;
    }

    // Aquí podrías añadir el código de actualización del usuario con fetch, si es necesario.

    if (selection === 'organization') {
      window.location.href = '/complete/organization';
    } else if (selection === 'user') {
      window.location.href = '/complete/user';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      <section className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100">
        <div className="container">
          <div className='flex-item-logo'>
            <h3>Únete como Organización o Usuario</h3>
            <div className='cont-btns-choose'>
              <button className='btn-gen' onClick={() => handleSelect('organization')}
                style={{
                  border: selection === 'organization' ? '1px solid #2A50CF' : '1px solid #3D3D3D',
                  backgroundColor: selection === 'organization' ? '#f4f4f4' : 'white',
                  marginRight: '35px'  
                }}
              >
                <Image
                  className="img-icon2"
                  src="/assets/images/icons/9024986_users_three_light_icon.svg"
                  alt="Icono"
                  width={0}
                  height={0}
                  layout="responsive" 
                />
                <br />
                Tengo una organización,<br />y quiero gestionarla.
              </button>
              <button className='btn-gen' onClick={() => handleSelect('user')}
                style={{    
                  border: selection === 'user' ? '1px solid #2A50CF' : '1px solid #3D3D3D',
                  backgroundColor: selection === 'user' ? '#f4f4f4' : 'white',
                  marginLeft: '35px' 
                }}
              >
                <Image
                  className="img-icon2"
                  src="/assets/images/icons/5340287_man_people_person_user_users_icon.svg"
                  alt="Icono"
                  width={0}
                  height={0}
                  layout="responsive" 
                />
                <br />
                Soy miembro o empleado <br />de una organización.
              </button>
            </div>
            <button className='btn-pass' onClick={handleContinue}>Continuar</button>
          </div>
        </div>
      </section>
      {breaks}    
    </LandingLayout>
  );
}

export default page;
