import Link from "next/link";

const Footer = ({ footer }) => {
  switch (footer) {
    case 3:
      return <Footer3 />;
    case 0:
      return <FooterEmpty />;
    default:
      return <Footer3 />;
  }
};
export default Footer;

const Footer3 = () => {
  return (
    <footer className="main-footer footer-three pt-100 rel z-1 bgc-navyblue">
      <div className="container">
        <div className="for-middle-border pb-50">
          <div className="row justify-content-between">
            <div className="col-xl-6 col-lg-7">
              <div className="footer-widget widget-about">
                <div className="section-title text-white">
                  <h2>También Adaptado para Móviles.</h2>
                  <p>No se requiere tarjeta de crédito, es totalmente gratis para todos</p>
                </div>
                <div className="footer-btns">
                  <a
                    href="/auth/signup"
                    className="theme-btn btn-footer-ln"
                    style={{ border: '.1px solid white !important' }}
                  >
                    Comenzar <i className="far fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-6 ms-lg-auto">
              <div className="footer-widget widget-links">
                <h6 className="footer-title">Enlaces</h6>
                <ul>
                  <li>
                    <a href="#home">Inicio</a>
                  </li>
                  <li>
                    <a href="#about">Nosotros</a>
                  </li>
                  <li>
                    <a href="#faqs">Preguntas Frecuentes</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-6">
              <div className="footer-widget widget-links">
                <h6 className="footer-title">Otros Enlaces</h6>
                <ul>
                  <li>
                    <a href="https://www.linkedin.com/company/vaidteam/">LinkedIn</a>
                  </li>
                  <li>
                    <a href="/auth/register">Regístrate</a>
                  </li>
                  <li>
                    <a href="/auth/login">Iniciar Sesión</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom py-15">
          <div className="row align-items-center">
            <div className="col-xl-4 col-lg-6">
              <div className="copyright-text pt-10 text-lg-start text-center">
                <p>
                  Copyright @2024, <a href="/">Vaid </a> Derechos
                Reservados
                </p>
              </div>
            </div>
            <div className="col-xl-8 col-lg-6">
              <div className="footer-bottom-logo text-lg-end text-center">
                <a href="/">
                  <img src="/assets/images/vaidpng2.png" alt="Logo" style={{ filter: 'brightness(0) invert(1)' }}/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterEmpty = () => {
  return null; // Si FooterEmpty no tiene contenido, podemos devolver null
}
