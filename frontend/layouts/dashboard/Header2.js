
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
//import images
import logoDark from "@/public/assets/images/vaidpng2.png";
import logoLight from "@/public/assets/images/vaidpng2.png";
import avatar from "@/public/assets/images/user/avatar-2.jpg";
import SimpleBar from "simplebar-react";
import { menuItems } from "./MenuData";
import NestedMenu from "./NestedMenu";

const Header = ({ themeMode }) => {

 
    const [avatar2, setImage] = useState(avatar);

    


  return (
    <React.Fragment>
      <nav className="pc-sidebar pc-sidebar-hide" id="pc-sidebar-hide">
        <div className="navbar-wrapper">
          <div className="m-header">
            <Link href="/" className="b-brand text-primary">
              {themeMode === "dark" ?
                <Image src={logoLight} alt="logo" width={90} className="logo-lg landing-logo" />
                :
                <Image src={logoDark} alt="logo" width={90} className="logo-lg landing-logo" />
              }
              <span className="badge bg-brand-color-2 rounded-pill ms-2 theme-version">
                Demo v1.0
              </span>
            </Link>
          </div>
          {/* <div className="navbar-content"> */}
          <SimpleBar className="navbar-content" style={{ maxHeight: "100vh" }}>
            <ul className="pc-navbar" id="pc-navbar">
              {/* Sidebar  */}
              <NestedMenu menuItems={menuItems} />
            </ul>
          </SimpleBar>
          {/* </div> */}
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
