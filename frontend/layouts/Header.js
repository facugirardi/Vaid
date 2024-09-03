"use client";
import useClickOutside from "@/utility/useClickOutside";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from '@/redux/features/authSlice'; 
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

const Header = ({ header, onePage }) => {
  switch (header) {
    case 3:
      return <Header3 onePage={onePage} />;
    case 0:
        return <HeaderEmpty onePage={onePage} />;  
    default:
      return <Header3 onePage={onePage} />;
  }
};
export default Header;

const Header3 = ({ onePage }) => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        dispatch(setLogout())
        toast.success('Logged out successfully.');
        window.location.href = '/auth/login';
      })
      .catch(() => {
        dispatch(setLogout())
        toast.success('Logged out successfully.');
        window.location.href = '/auth/login';
      })
  }

  const menus = [
    { id: 1, href: "/#home", title: "Home" },
    { id: 2, href: "/#about", title: "about" },
    { id: 3, href: "/#services", title: "services" },
    { id: 4, href: "/#faqs", title: "FAQs" },
  ];
  return (
    <header className="main-header menu-absolute">
      {/*Header-Upper*/}
      <div className="header-upper">
        <div className="container container-1520 clearfix">
          <div className="header-inner py-20 rpy-10 rel d-flex align-items-center">
            <div className="logo-outer">
              <div className="logo">
                <Link href="/">
                  <img
                    src="/assets/images/vaidpng2.png"
                    alt="Logo"
                    title="Logo"
                  />
                </Link>
              </div>
            </div>
            <div className="nav-outer ms-lg-auto clearfix">
              {/* Main Menu */}
              <nav className="main-menu navbar-expand-lg">
                <Nav
                  onePage={onePage}
                  logo="/assets/images/vaidpng2.png"
                  menus={menus}
                />
              </nav>
              {/* Main Menu End*/}
            </div>
            {/* Menu Button */}
            {isAuthenticated
              ? <div className="menu-btns ms-lg-auto">
                  <button onClick={handleLogout} className="light-btn">
                    Logout
                  </button>
                  <a href="/dashboard" className="theme-btn style-two">
                    Dashboard <i className="far fa-arrow-right" />
                  </a>
                </div>

              : <div className="menu-btns ms-lg-auto">
                  <a href="/auth/login" className="light-btn">
                    Login
                  </a>
                  <a href="/auth/register" className="theme-btn style-two">
                    Sign Up <i className="far fa-arrow-right" />
                  </a>
                </div>
              }


          </div>
        </div>
      </div>
      {/*End Header Upper*/}
    </header>
  );
};



const HeaderEmpty = ({ onePage }) => {
  return (
    <header className="main-header menu-absolute">
      {/*Header-Upper*/}
      <div className="header-upper">
        <div className="container container-1520 clearfix">
          <div className="header-inner py-20 rpy-10 rel d-flex align-items-center">
            <div className="logo-outer">
              <div className="logo">
                <Link href="#">
                  <img
                    src="/assets/images/vaidpng2.png"
                    alt="Logo"
                    title="Logo"
                  />
                </Link>
              </div>
            </div>
            <div className="nav-outer ms-lg-auto clearfix">
              {/* Main Menu */}
              <nav className="main-menu navbar-expand-lg">
              </nav>
              {/* Main Menu End*/}
            </div>
            {/* Menu Button */}
            <div className="menu-btns ms-lg-auto">
            </div>
          </div>
        </div>
      </div>
      {/*End Header Upper*/}
    </header>
  );
};


const Nav = ({
  logo = "/assets/images/vaidpng2.png",
  dark,
  onePage,
  menus,
}) => {
  return (
    <Fragment>
      <div className="d-none d-lg-flex desktop-menu">
        <div className="navbar-header py-10">
          <div className="mobile-logo">
            <Link href="/">
              <img src={logo} alt="Logo" title="Logo" />
            </Link>
          </div>
          {/* Toggle Button */}
          <Accordion.Toggle
            as={"button"}
            className="navbar-toggle"
            eventKey="navbar-collapse"
          >
            <span className={`icon-bar ${dark ? "bg-dark" : ""}`} />
            <span className={`icon-bar ${dark ? "bg-dark" : ""}`} />
            <span className={`icon-bar ${dark ? "bg-dark" : ""}`} />
          </Accordion.Toggle>
        </div>
        <div eventKey="navbar-collapse" className="navbar-collapse clearfix">
          {onePage ? (
            <ul className="navigation onepage clearfix">
              {menus.map((menu) => (
                <li key={menu.id}>
                  <a href={`${menu.href}`}>{menu.title}</a>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="navigation clearfix ">
              <li className="dropdown">
                <a href="#">Home</a>
                <ul>
                  <li className="dropdown">
                    <a href="#">MultiPage</a>
                    <ul>
                      <li>
                        <Link href="/">Business</Link>
                      </li>
                      <li>
                        <Link href="index2">Lead Capture</Link>
                      </li>
                      <li>
                        <Link href="index3">Software Landing</Link>
                      </li>
                      <li>
                        <Link href="index4">E-learning</Link>
                      </li>
                      <li>
                        <Link href="index5">Saas Landing</Link>
                      </li>
                      <li>
                        <Link href="index6">AI Software</Link>
                      </li>
                      <li>
                        <Link href="index7">Website Builder</Link>
                      </li>
                      <li>
                        <Link href="index8">Fintech</Link>
                      </li>
                      <li>
                        <Link href="index9">Chatbot</Link>
                      </li>
                    </ul>
                    <div className="dropdown-btn">
                      <span className="far fa-angle-down" />
                    </div>
                  </li>
                  <li className="dropdown">
                    <a href="#">OnePage</a>
                    <ul>
                      <li>
                        <Link href="index1-onepage">Business</Link>
                      </li>
                      <li>
                        <Link href="index2-onepage">Lead Capture</Link>
                      </li>
                      <li>
                        <Link href="index3-onepage">Software Landing</Link>
                      </li>
                      <li>
                        <Link href="index4-onepage">E-learning</Link>
                      </li>
                      <li>
                        <Link href="index5-onepage">Saas Landing</Link>
                      </li>
                      <li>
                        <Link href="index6-onepage">AI Software</Link>
                      </li>
                      <li>
                        <Link href="index7-onepage">Website Builder</Link>
                      </li>
                      <li>
                        <Link href="index8-onepage">Fintech</Link>
                      </li>
                      <li>
                        <Link href="index9-onepage">Chatbot</Link>
                      </li>
                    </ul>
                    <div className="dropdown-btn">
                      <span className="far fa-angle-down" />
                    </div>
                  </li>
                </ul>
                <div className="dropdown-btn">
                  <span className="far fa-angle-down" />
                </div>
              </li>
              <li className="dropdown">
                <a href="#">pages</a>
                <ul>
                  <li>
                    <Link href="about">About Us</Link>
                  </li>
                  <li>
                    <Link href="faqs">faqs</Link>
                  </li>
                  <li>
                    <Link href="team">Team Members</Link>
                  </li>
                  <li>
                    <Link href="pricing">Pricing Plan</Link>
                  </li>
                  <li>
                    <Link href="contact">Contact us</Link>
                  </li>
                  <li>
                    <Link href="sign-in">Sign In</Link>
                  </li>
                  <li>
                    <Link href="sign-up">Sign Up</Link>
                  </li>
                  <li>
                    <Link href="coming-soon">Coming Soon</Link>
                  </li>
                  <li>
                    <Link href="404">404 error</Link>
                  </li>
                </ul>
                <div className="dropdown-btn">
                  <span className="far fa-angle-down" />
                </div>
              </li>
              <li className="dropdown">
                <a href="#">Services</a>
                <ul>
                  <li>
                    <Link href="services">Our Services</Link>
                  </li>
                  <li>
                    <Link href="service-details">Service Details</Link>
                  </li>
                </ul>
                <div className="dropdown-btn">
                  <span className="far fa-angle-down" />
                </div>
              </li>
              <li className="dropdown">
                <a href="#">Shop</a>
                <ul>
                  <li>
                    <Link href="shop">our Products</Link>
                  </li>
                  <li>
                    <Link href="product-details">Product Details</Link>
                  </li>
                  <li>
                    <Link href="cart">Shopping Cart</Link>
                  </li>
                  <li>
                    <Link href="checkout">Checkout</Link>
                  </li>
                </ul>
                <div className="dropdown-btn">
                  <span className="far fa-angle-down" />
                </div>
              </li>
              <li className="dropdown">
                <a href="#">Projects</a>
                <ul>
                  <li>
                    <Link href="projects">Project Grid</Link>
                  </li>
                  <li>
                    <Link href="project-list">Project List</Link>
                  </li>
                  <li>
                    <Link href="project-masonry">Project Masonry</Link>
                  </li>
                  <li>
                    <Link href="project-details">Project Details</Link>
                  </li>
                </ul>
                <div className="dropdown-btn">
                  <span className="far fa-angle-down" />
                </div>
              </li>
              <li className="dropdown">
                <a href="#">blog</a>
                <ul>
                  <li>
                    <Link href="blog">blog standard</Link>
                  </li>
                  <li>
                    <Link href="blog-details">blog details</Link>
                  </li>
                </ul>
                <div className="dropdown-btn">
                  <span className="far fa-angle-down" />
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
      <Accordion defaultActiveKey="0" className="d-block d-lg-none mobile-menu">
        <div className="navbar-header py-10">
          <div className="mobile-logo">
            <Link href="/">
              <img src={logo} alt="Logo" title="Logo" />
            </Link>
          </div>
          {/* Toggle Button */}
          <Accordion.Toggle
            as={"button"}
            className="navbar-toggle"
            eventKey="navbar-collapse"
          >
            <span className={`icon-bar ${dark ? "bg-dark" : ""}`} />
            <span className={`icon-bar ${dark ? "bg-dark" : ""}`} />
            <span className={`icon-bar ${dark ? "bg-dark" : ""}`} />
          </Accordion.Toggle>
        </div>
        <Accordion.Collapse
          eventKey="navbar-collapse"
          className="navbar-collapse clearfix"
        >
          <MobileMenu onePage={onePage} menus={menus} />
        </Accordion.Collapse>
      </Accordion>
    </Fragment>
  );
};

const NavSearch = () => {
  const [toggle, setToggle] = useState(false);
  let domNode = useClickOutside(() => {
    setToggle(false);
  });
  return (
    <Fragment>
      <button className="far fa-search" onClick={() => setToggle(true)} />
      <form
        action="#"
        className={toggle ? "" : "hide"}
        onSubmit={(e) => {
          e.preventDefault();
          setToggle(false);
        }}
        ref={domNode}
      >
        <input
          type="text"
          placeholder="Search"
          className="searchbox"
          required=""
        />
        <button type="submit" className="searchbutton far fa-search" />
      </form>
    </Fragment>
  );
};

const MobileMenu = ({ sidebar, onePage, menus }) => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        dispatch(setLogout())
        toast.success('Logged out successfully.');
        window.location.href = '/auth/login';
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        dispatch(setLogout())
        toast.success('Logged out successfully.');
        window.location.href = '/auth/login';
      })
  }

  const [activeMenu, setActiveMenu] = useState("");
  const [multiMenu, setMultiMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  const multiMenuSet = (value) =>
      setMultiMenu(multiMenu === value ? "" : value),
    multiMenuActiveLi = (value) =>
      value === multiMenu ? { display: "block" } : { display: "none" };
  return (
    <Fragment>
      {onePage ? (
        <ul
          className={`${
            sidebar ? "sidebar-menu" : "navigation"
          } onepage clearfix`}
        >
          {menus.map((menu) => (
            <li key={menu.id}>
              <a href={`#${menu.href}`}>{menu.title}</a>
            </li>
          ))}
            {isAuthenticated
              ? 
              <>
                <li><a onClick={handleLogout}>Logout</a></li>
                <li><a href="/dashboard">Profile</a></li>      
              </>
              :
              <>
                <li><a href="/auth/login">Login</a></li>      
                <li><a href="/auth/register">Sign Up</a></li>      
              </>
              }
        </ul>
      ) : (
        <ul className={`${sidebar ? "sidebar-menu" : "navigation"} clearfix`}>
          <li className="dropdown">
            <a href="#">Home</a>
            <ul style={activeLi("home")}>
              <li className="dropdown">
                <a href="#">MultiPage</a>
                <ul style={multiMenuActiveLi("multiPage")}>
                  <li>
                    <Link href="/">Business</Link>
                  </li>
                  <li>
                    <Link href="index2">Lead Capture</Link>
                  </li>
                  <li>
                    <Link href="index3">Software Landing</Link>
                  </li>
                  <li>
                    <Link href="index4">E-learning</Link>
                  </li>
                  <li>
                    <Link href="index5">Saas Landing</Link>
                  </li>
                  <li>
                    <Link href="index6">AI Software</Link>
                  </li>
                  <li>
                    <Link href="index7">Website Builder</Link>
                  </li>
                  <li>
                    <Link href="index8">Fintech</Link>
                  </li>
                  <li>
                    <Link href="index9">Chatbot</Link>
                  </li>
                </ul>
                <div
                  className="dropdown-btn"
                  onClick={() => multiMenuSet("multiPage")}
                >
                  <span className="far fa-angle-down" />
                </div>
              </li>
              <li className="dropdown">
                <a href="#">OnePage</a>
                <ul style={multiMenuActiveLi("OnePage")}>
                  <li>
                    <Link href="index1-onepage">Business</Link>
                  </li>
                  <li>
                    <Link href="index2-onepage">Lead Capture</Link>
                  </li>
                  <li>
                    <Link href="index3-onepage">Software Landing</Link>
                  </li>
                  <li>
                    <Link href="index4-onepage">E-learning</Link>
                  </li>
                  <li>
                    <Link href="index5-onepage">Saas Landing</Link>
                  </li>
                  <li>
                    <Link href="index6-onepage">AI Software</Link>
                  </li>
                  <li>
                    <Link href="index7-onepage">Website Builder</Link>
                  </li>
                  <li>
                    <Link href="index8-onepage">Fintech</Link>
                  </li>
                  <li>
                    <Link href="index9-onepage">Chatbot</Link>
                  </li>
                </ul>
                <div
                  className="dropdown-btn"
                  onClick={() => multiMenuSet("OnePage")}
                >
                  <span className="far fa-angle-down" />
                </div>
              </li>
            </ul>
            <div className="dropdown-btn" onClick={() => activeMenuSet("home")}>
              <span className="far fa-angle-down" />
            </div>
          </li>
          <li className="dropdown">
            <a href="#">pages</a>
            <ul style={activeLi("pages")}>
              <li>
                <Link href="about">About Us</Link>
              </li>
              <li>
                <Link href="faqs">faqs</Link>
              </li>
              <li>
                <Link href="team">Team Members</Link>
              </li>
              <li>
                <Link href="pricing">Pricing Plan</Link>
              </li>
              <li>
                <Link href="contact">Contact us</Link>
              </li>
              <li>
                <Link href="sign-in">Sign In</Link>
              </li>
              <li>
                <Link href="sign-up">Sign Up</Link>
              </li>
              <li>
                <Link href="coming-soon">Coming Soon</Link>
              </li>
              <li>
                <Link href="404">404 error</Link>
              </li>
            </ul>
            <div
              className="dropdown-btn"
              onClick={() => activeMenuSet("pages")}
            >
              <span className="far fa-angle-down" />
            </div>
          </li>
          <li className="dropdown">
            <a href="#">Services</a>
            <ul style={activeLi("Services")}>
              <li>
                <Link href="services">Our Services</Link>
              </li>
              <li>
                <Link href="service-details">Service Details</Link>
              </li>
            </ul>
            <div
              className="dropdown-btn"
              onClick={() => activeMenuSet("Services")}
            >
              <span className="far fa-angle-down" />
            </div>
          </li>
          <li className="dropdown">
            <a href="#">Shop</a>
            <ul style={activeLi("Shop")}>
              <li>
                <Link href="shop">our Products</Link>
              </li>
              <li>
                <Link href="product-details">Product Details</Link>
              </li>
              <li>
                <Link href="cart">Shopping Cart</Link>
              </li>
              <li>
                <Link href="checkout">Checkout</Link>
              </li>
            </ul>
            <div className="dropdown-btn" onClick={() => activeMenuSet("Shop")}>
              <span className="far fa-angle-down" />
            </div>
          </li>
          <li className="dropdown">
            <a href="#">Projects</a>
            <ul style={activeLi("Projects")}>
              <li>
                <Link href="projects">Project Grid</Link>
              </li>
              <li>
                <Link href="project-list">Project List</Link>
              </li>
              <li>
                <Link href="project-masonry">Project Masonry</Link>
              </li>
              <li>
                <Link href="project-details">Project Details</Link>
              </li>
            </ul>
            <div
              className="dropdown-btn"
              onClick={() => activeMenuSet("Projects")}
            >
              <span className="far fa-angle-down" />
            </div>
          </li>
          <li className="dropdown">
            <a href="#">blog</a>
            <ul style={activeLi("blog")}>
              <li>
                <Link href="blog">blog standard</Link>
              </li>
              <li>
                <Link href="blog-details">blog details</Link>
              </li>
            </ul>
            <div className="dropdown-btn" onClick={() => activeMenuSet("blog")}>
              <span className="far fa-angle-down" />
            </div>
          </li>
        </ul>
      )}
    </Fragment>
  );
};
