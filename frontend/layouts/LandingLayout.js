"use client";
import { akpagerUtility } from "@/utility";
import { Fragment, useEffect } from "react";
import niceSelect from "react-nice-select";
import Footer from "./Footer";
import Header from "./Header";
const LandingLayout = ({ children, header, footer, bodyClass, onePage }) => {
  useEffect(() => {
    akpagerUtility.animation();
    akpagerUtility.fixedHeader();
  });

  useEffect(() => {
    document.querySelector("body").classList = bodyClass;
  }, []);

  return (
    <Fragment>
      <div className="page-wrapper">
        <Header header={header} onePage={onePage} />
        {children}
        <Footer footer={footer} />
      </div>
    </Fragment>
  );
};
export default LandingLayout;
