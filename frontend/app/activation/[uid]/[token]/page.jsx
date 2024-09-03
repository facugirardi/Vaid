'use client';

import LandingLayout from "@/layouts/LandingLayout";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useActivationMutation } from "@/redux/features/authApiSlice";
import { toast } from 'react-toastify';


const page = ({ params }) => {
  const { push } = useRouter();

  const [activation] = useActivationMutation();

  useEffect(() => {
    const { uid, token } = params;
  
    activation({ uid, token })
      .unwrap()
      .then(() => {
        toast.success('Account activated successfully');
      })
      .catch(() => {
        toast.error('Failed to activate your account');
      })
      .finally(() => {

        window.location.href = '/auth/login';
      })
  }, []);

    useEffect(() => {
    document.querySelector("body").classList.add("home-three");
  }, []);
  const [active, setActive] = useState("collapse1");


  return (
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      {/* Signup area start */}
      <section className="error-area py-150 rpy-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-7">
              <div className="error-content mt-80 rmt-60">
                <h1
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  Activating<br/>Your Account
                </h1>
                <p
                  data-aos="fade-up"
                  data-aos-delay={50}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  You will be redirected soon to the login page. 
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Signup area End */}
    </LandingLayout>
  );
};
export default page;
