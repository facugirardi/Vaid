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
                data-aos="fade-up"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <div className="section-title text-white">
                  <h2>We’re Also Available On Mobile.</h2>
                  <p>No credit card requirement it’s full free for all</p>
                </div>
                <div className="footer-btns">
                  <a
                    href="/"
                    className="theme-btn"
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
                data-aos="fade-up"
                data-aos-delay={100}
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <h6 className="footer-title">Links</h6>
                <ul>
                  <li>
                    <Link href="#home">Home</Link>
                  </li>
                  <li>
                    <Link href="#about">About</Link>
                  </li>
                  <li>
                    <Link href="#services">Services</Link>
                  </li>
                  <li>
                    <Link href="#faqs">FAQs</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-6">
              <div
                className="footer-widget widget-links"
                data-aos="fade-up"
                data-aos-delay={150}
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <h6 className="footer-title">External Links</h6>
                <ul>
                  <li>
                    <Link href="#">Linkedin</Link>
                  </li>
                  <li>
                    <Link href="pricing">Instagram</Link>
                  </li>
                  <li>
                    <Link href="about">Medium</Link>
                  </li>
                  <li>
                    <Link href="contact">Contact</Link>
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
                data-aos="fade-left"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <p>
                  Copyright @2024, <Link href="/">Vaid </Link> All Rights
                  Reserved
                </p>
              </div>
            </div>
            <div className="col-xl-8 col-lg-6">
              <div
                className="footer-bottom-logo text-lg-end text-center"
                data-aos="fade-right"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <Link href="/">
                  <img src="/assets/images/vaidpng2.png" alt="Logo" style={{ filter: 'brightness(0) invert(1)' }}/>
                </Link>
              </div>
            </div>
          </div>
          {/* Scroll Top Button */}
          <button className="scroll-top scroll-to-target" data-target="html">
            <span className="far fa-angle-double-up" />
          </button>
        </div>
      </div>
    </footer>
  );
};

const FooterEmpty = () => {
  return 
}