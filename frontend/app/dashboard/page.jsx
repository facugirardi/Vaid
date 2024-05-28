
"use client";
import LandingLayout from "@/layouts/LandingLayout";
import { useEffect, useState } from "react";


const breaks = Array(10).fill(0).map((_, i) => <br key={i} />); // borrar cuando se haga el login


const page = () => {
  const [userDetails, setUserDetails] = useState(null);
  const id = localStorage.getItem('id');

  useEffect(() => {
    if (id) {
      fetchUserDetails(id);
    }
  
    document.querySelector("body").classList.add("home-three");

  }, []);

  async function fetchUserDetails(userId) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/user/${userId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const userDetails = await response.json();
      setUserDetails(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }

  return (
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      <section className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100">
        <div className="container">
          <div className="d-flex justify-content-center">
            {userDetails && (
              <div>
                <p>ID: {userDetails.id}</p>
                <p>First Name: {userDetails.first_name}</p>
                <p>Last Name: {userDetails.last_name}</p>
                <p>Email: {userDetails.email}</p>
              </div>
            )}
            {breaks}
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default page;
