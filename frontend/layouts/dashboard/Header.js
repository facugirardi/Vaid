import React from "react";
import Link from "next/link";
import Image from "next/image";
//import images
import navCardBg from "@/public/assets/images/layout/nav-card-bg.svg";
import logoDark from "@/public/assets/images/logo-dark.svg";
import logoLight from "@/public/assets/images/logo-white.svg";
import avatar1 from "@/public/assets/images/user/avatar-1.jpg";
import SimpleBar from "simplebar-react";
import { menuItems } from "./MenuData";
import NestedMenu from "./NestedMenu";
import { Dropdown } from "react-bootstrap";

const Header = ({ themeMode }) => {
  return (
    <React.Fragment>
      <nav className="pc-sidebar" id="pc-sidebar-hide">
        <div className="navbar-wrapper">
          <div className="m-header">
            <Link href="/" className="b-brand text-primary">
              {themeMode === "dark" ?
                <Image src={logoLight} alt="logo" className="logo-lg landing-logo" />
                :
                <Image src={logoDark} alt="logo" className="logo-lg landing-logo" />
              }
              <span className="badge bg-brand-color-2 rounded-pill ms-2 theme-version">
                v1.0
              </span>
            </Link>
          </div>
          {/* <div className="navbar-content"> */}
          <SimpleBar className="navbar-content" style={{ maxHeight: "100vh" }}>
            <ul className="pc-navbar" id="pc-navbar">
              {/* Sidebar  */}
              <NestedMenu menuItems={menuItems} />
            </ul>
            <div className="card nav-action-card bg-brand-color-4">
              <div
                className="card-body"
                style={{ backgroundImage: `url(${navCardBg})` }}
              >
                <h5 className="text-dark">Help Center</h5>
                <p className="text-dark text-opacity-75">
                  Please contact us for more questions.
                </p>
                <Link
                  href="https://phoenixcoded.support-hub.io/"
                  className="btn btn-primary"
                  target="_blank"
                >
                  Go to help Center
                </Link>
              </div>
            </div>
          </SimpleBar>
          {/* </div> */}
          <div className="card pc-user-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <Image
                    src={avatar1}
                    alt="user-image"
                    className="user-avtar wid-45 rounded-circle"
                    width={45}
                  />
                </div>
                <div className="flex-grow-1 ms-3 me-2">
                  <h6 className="mb-0">Jonh Smith</h6>
                  <small>Administrator</small>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="a"
                    className="btn btn-icon btn-link-secondary avtar arrow-none"
                    data-bs-offset="0,20"
                  >
                    <i className="ph-duotone ph-windows-logo"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ul>
                      <li><Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-user"></i>
                        <span>My Account</span>
                      </Dropdown.Item></li>
                      <li><Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-gear"></i>
                        <span>Settings</span>
                      </Dropdown.Item></li>
                      <li><Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-lock-key"></i>
                        <span>Lock Screen</span>
                      </Dropdown.Item></li>
                      <li><Dropdown.Item className="pc-user-links">
                        <i className="ph-duotone ph-power"></i>
                        <span>Logout</span>
                      </Dropdown.Item></li>
                    </ul>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
