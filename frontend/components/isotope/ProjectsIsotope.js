"use client";
import Isotope from "isotope-layout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
const ProjectsIsotope = () => {
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");
  useEffect(() => {
    setTimeout(() => {
      isotope.current = new Isotope(".project-active", {
        itemSelector: ".item",
        percentPosition: true,
        masonry: {
          columnWidth: ".item",
        },
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
    }, 500);
  }, []);
  useEffect(() => {
    if (isotope.current) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey]);
  const handleFilterKeyChange = (key) => () => {
    setFilterKey(key);
  };
  const activeBtn = (value) => (value === filterKey ? "active" : "");
  return (
    <section className="project-grid-area pt-130 rpt-100 pb-85 rpb-55">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-xl-9 col-lg-11">
            <div
              className="section-title mb-60"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <h2>
                Revolutionizing Your Digital Landscape Our Dynamic Marketing
                Project
              </h2>
            </div>
          </div>
        </div>
        <ul
          className="project-nav mb-40"
          data-aos="fade-up"
          data-aos-delay={50}
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <li
            data-filter="*"
            className={`c-pointer ${activeBtn("*")}`}
            onClick={handleFilterKeyChange("*")}
          >
            Show All
          </li>
          <li
            data-filter=".design"
            className={`c-pointer ${activeBtn("design")}`}
            onClick={handleFilterKeyChange("design")}
          >
            Design
          </li>
          <li
            data-filter=".marketing"
            className={`c-pointer ${activeBtn("marketing")}`}
            onClick={handleFilterKeyChange("marketing")}
          >
            Marketing
          </li>
          <li
            data-filter=".branding"
            className={`c-pointer ${activeBtn("branding")}`}
            onClick={handleFilterKeyChange("branding")}
          >
            Branding
          </li>
          <li
            data-filter=".seo"
            className={`c-pointer ${activeBtn("seo")}`}
            onClick={handleFilterKeyChange("seo")}
          >
            SEO
          </li>
        </ul>
        <div className="row project-active">
          <div className="col-xl-4 col-md-6 item marketing">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid1.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Digital Product Design</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item design seo">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid2.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Website Development</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item branding">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid3.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Digital Product Design</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item design seo">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid4.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Website Development</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item marketing branding">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid5.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Digital Product Design</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item branding seo design">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid6.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Website Development</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item design">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid7.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Digital Product Design</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item marketing seo">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid8.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Website Development</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-md-6 item seo design">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-grid9.jpg"
                  alt="Project Grid"
                />
              </div>
              <div className="content">
                <h5>
                  <Link href="project-details">Digital Product Design</Link>
                </h5>
                <span className="category">Design, Branding</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProjectsIsotope;
