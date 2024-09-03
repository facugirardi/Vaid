'use client';


import { useSocialAuthenticateMutation } from "@/redux/features/authApiSlice"
import { useSocialAuth } from "@/hooks"

import LandingLayout from "@/layouts/LandingLayout";

const page = () => {


    const [googleAuthenticate] = useSocialAuthenticateMutation()
    useSocialAuth(googleAuthenticate, 'google-oauth2')

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
                      Google<br/>Authentification
                    </h1>
                    <p
                      data-aos="fade-up"
                      data-aos-delay={50}
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      You will be redirected soon to the dashboard page. 
                      If not redirected please click the button below.
                    </p>
                    <a
                      href="/dashboard"
                      className="theme-btn style-two"
                      data-aos="fade-up"
                      data-aos-delay={100}
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      <span>Profile</span>
                    </a>
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