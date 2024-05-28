"use client";
import LandingLayout from "@/layouts/LandingLayout";
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';


const breaks = Array(10).fill(0).map((_, i) => <br key={i} />); // borrar cuando se haga el login


const page = () => {
  useEffect(() => {
        document.querySelector("body").classList.add("home-three");

  }, []);


  return (
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      <section className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100">
        <div className="container">
          <div className="d-flex justify-content-center">
            {breaks}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default page;
