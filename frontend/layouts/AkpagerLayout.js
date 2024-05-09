"use client";
import VideoPopup from "@/components/VideoPopup";
import { akpagerUtility } from "@/utility";
import { Fragment, useEffect } from "react";
import niceSelect from "react-nice-select";
import Footer from "./Footer";
import Header from "./Header";
const AkpagerLayout = ({ children, header, footer, bodyClass, onePage }) => {
  useEffect(() => {
    akpagerUtility.animation();
    akpagerUtility.fixedHeader();
  });

  useEffect(() => {
    niceSelect();
    document.querySelector("body").classList = bodyClass;
  }, []);

  return (
    <Fragment>
      <VideoPopup />
      <div className="page-wrapper">
        <Header header={header} onePage={onePage} />
        {children}
        <Footer footer={footer} />
      </div>
    </Fragment>
  );
};
export default AkpagerLayout;
