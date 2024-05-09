"use client";
import Isotope from "isotope-layout";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ProjectMasonryIsotope = () => {
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");
  useEffect(() => {
    setTimeout(() => {
      isotope.current = new Isotope(".project-masonry", {
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
  return (
    <section className="project-masonry-area py-130 rpy-100">
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
        <div className="row project-masonry">
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry1.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry2.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry3.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry5.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry6.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry4.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry8.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry7.jpg"
                  alt="Project Masonry"
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
          <div className="col-xl-4 col-md-6 item">
            <div
              className="project-item"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <div className="image">
                <img
                  src="assets/images/projects/project-masonry9.jpg"
                  alt="Project Masonry"
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
        <div
          className="more-btn pt-20 text-center"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <a href="#" className="theme-btn">
            View More <i className="far fa-arrow-right" />
          </a>
        </div>
      </div>
    </section>
  );
};
export default ProjectMasonryIsotope;
