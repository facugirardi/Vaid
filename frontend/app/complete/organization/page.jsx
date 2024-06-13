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


        
      </section>
      {breaks}    
    </LandingLayout>
  );
}
export default page;

