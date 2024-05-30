
"use client";
import LandingLayout from "@/layouts/LandingLayout";
import { useEffect, useState } from "react";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import Preloader from "@/components/Preloader";

const breaks = Array(10).fill(0).map((_, i) => <br key={i} />); // borrar cuando se haga el login


const page = () => {
	const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  useEffect(() => {
  
    document.querySelector("body").classList.add("home-three");

  }, []);

  return (
    <>
    {isLoading || isFetching 
      ? <Preloader />
      : (
        <LandingLayout header footer bodyClass="home-three" onePage>
          <section className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100">
            <div className="container">
              <div className="d-flex justify-content-center">
                <p>
                  ID: {user?.id} | Name: {user?.first_name} {user?.last_name} | Email: {user?.email} 
                </p>
                {breaks}
              </div>
            </div>
          </section>
        </LandingLayout>
      )
    }
  </>  
  );
};

export default page;
