'use client';

import { useSocialAuthenticateMutation } from "@/redux/features/authApiSlice"
import { useSocialAuth } from "@/hooks"

import LandingLayout from "@/layouts/LandingLayout";

const page = () => {

    const [googleAuthenticate] = useSocialAuthenticateMutation()
    useSocialAuth(googleAuthenticate, 'google-oauth2')

    return (
        <LandingLayout header footer bodyClass={"home-three"} onePage>
          {/* Área de Registro Inicio */}
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
                      Autenticación<br/>con Google
                    </h1>
                    <p
                      data-aos="fade-up"
                      data-aos-delay={50}
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      Serás redirigido pronto a la página del panel. 
                      Si no eres redirigido, por favor haz clic en el botón de abajo.
                    </p>
                    <a
                      href="/dashboard"
                      className="theme-btn style-two"
                      data-aos="fade-up"
                      data-aos-delay={100}
                      data-aos-duration={1500}
                      data-aos-offset={50}
                    >
                      <span>Perfil</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Área de Registro Fin */}
        </LandingLayout>
      );
    };
    export default page;
