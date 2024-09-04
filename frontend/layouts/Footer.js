import Link from "next/link";

const Footer = ({ footer }) => {
  switch (footer) {
    case 3:
      return <Footer3 />;
    case 0:
      return <FooterEmpty />
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
              <div
                className="footer-widget widget-about"
              >
                <div className="section-title text-white">
                  <h2>We’re Also Available On Mobile.</h2>
                  <p>No credit card requirement it’s full free for all</p>
                </div>
                <div className="footer-btns">
                  <a
                    href="/auth/signup"
                    className="theme-btn btn-footer-ln"
                    style={{border:'.1px solid white !important'}}
                  >
                    Get Started <i className="far fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-6 ms-lg-auto">
              <div
                className="footer-widget widget-links"
              >
                <h6 className="footer-title">Links</h6>
                <ul>
                  <li>
                    <a href="#home">Home</a>
                  </li>
                  <li>
                    <a href="#about">About</a>
                  </li>
                  <li>
                    <a href="#services">Services</a>
                  </li>
                  <li>
                    <a href="#faqs">FAQs</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-6">
              <div
                className="footer-widget widget-links"

              >
                <h6 className="footer-title">External Links</h6>
                <ul>
                  <li>
                    <a href="#">Linkedin</a>
                  </li>
                  <li>
                    <a href="pricing">Instagram</a>
                  </li>
                  <li>
                    <a href="about">Medium</a>
                  </li>
                  <li>
                    <a href="contact">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom py-15">
          <div className="row align-items-center">
            <div className="col-xl-4 col-lg-6">
              <div
                className="copyright-text pt-10 text-lg-start text-center"
              >
                <p>
                  Copyright @2024, <a href="/">Vaid </a> All Rights
                  Reserved
                </p>
              </div>
            </div>
            <div className="col-xl-8 col-lg-6">
              <div
                className="footer-bottom-logo text-lg-end text-center"
              >
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
  return 
}