"use client";
import Isotope from "isotope-layout";
import { useEffect, useRef, useState } from "react";
const CoursesIsotope = () => {
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");
  useEffect(() => {
    setTimeout(() => {
      isotope.current = new Isotope(".course-active", {
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
    <section
      id="course"
      className="popular-course-area bgc-lighter pt-120 rpt-100 pb-90 rpb-70"
    >
      <div className="container">
        <div
          className="section-title text-center mb-60"
          data-aos="fade-up"
          data-aos-duration={1500}
          data-aos-offset={50}
        >
          <span className="subtitle-two mb-25">
            <i className="fas fa-play-circle" /> Popular Course
          </span>
          <h2>Explore Our Popular Courses</h2>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-8">
            <ul
              className="course-nav mb-40"
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
                All Categories <i className="far fa-arrow-right" />
              </li>
              <li
                className={`c-pointer ${activeBtn("design")}`}
                onClick={handleFilterKeyChange("design")}
                data-filter=".design"
              >
                UI/UX Design <i className="far fa-arrow-right" />
              </li>
              <li
                className={`c-pointer ${activeBtn("development")}`}
                onClick={handleFilterKeyChange("development")}
                data-filter=".development"
              >
                Development <i className="far fa-arrow-right" />
              </li>
              <li
                className={`c-pointer ${activeBtn("marketing")}`}
                onClick={handleFilterKeyChange("marketing")}
                data-filter=".marketing"
              >
                Marketing <i className="far fa-arrow-right" />
              </li>
              <li
                className={`c-pointer ${activeBtn("business")}`}
                onClick={handleFilterKeyChange("business")}
                data-filter=".business"
              >
                Business <i className="far fa-arrow-right" />
              </li>
              <li
                className={`c-pointer ${activeBtn("medical")}`}
                onClick={handleFilterKeyChange("medical")}
                data-filter=".medical"
              >
                Medical Care <i className="far fa-arrow-right" />
              </li>
            </ul>
          </div>
          <div className="col-lg-9">
            <div className="row course-active">
              <div className="col-xl-4 col-sm-6 item design business">
                <div
                  className="course-item"
                  data-aos="fade-up"
                  data-aos-delay={100}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="image">
                    <img src="assets/images/courses/course1.jpg" alt="Course" />
                    <a href="#" className="details-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <div className="content">
                    <a className="category" href="#">
                      Web Design
                    </a>
                    <h6>
                      <a href="#">Basic to Advance UI/UX Design (Web+Mobile)</a>
                    </h6>
                    <div className="author">
                      <img
                        src="assets/images/courses/course-author1.png"
                        alt="Author"
                      />
                      <span>Byron F. Lambert</span>
                    </div>
                  </div>
                  <div className="duration-ratting">
                    <span className="duration">
                      <i className="far fa-clock" /> <b>185</b> minute
                    </span>
                    <span className="ratting">
                      <i className="fas fa-star" />
                      <span>4.9</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-sm-6 item development medical">
                <div
                  className="course-item"
                  data-aos="fade-up"
                  data-aos-delay={150}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="image">
                    <img src="assets/images/courses/course2.jpg" alt="Course" />
                    <a href="#" className="details-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <div className="content">
                    <a className="category" href="#">
                      iOS Mobile App
                    </a>
                    <h6>
                      <a href="#">Basic to Advance Mobile Apps Development</a>
                    </h6>
                    <div className="author">
                      <img
                        src="assets/images/courses/course-author2.png"
                        alt="Author"
                      />
                      <span>Byron F. Lambert</span>
                    </div>
                  </div>
                  <div className="duration-ratting">
                    <span className="duration">
                      <i className="far fa-clock" /> <b>185</b> minute
                    </span>
                    <span className="ratting">
                      <i className="fas fa-star" />
                      <span>4.9</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-sm-6 item design marketing">
                <div
                  className="course-item"
                  data-aos="fade-up"
                  data-aos-delay={200}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="image">
                    <img src="assets/images/courses/course3.jpg" alt="Course" />
                    <a href="#" className="details-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <div className="content">
                    <a className="category" href="#">
                      Digital Marketing
                    </a>
                    <h6>
                      <a href="#">Grow Your Digital Marketing With Lamber</a>
                    </h6>
                    <div className="author">
                      <img
                        src="assets/images/courses/course-author3.png"
                        alt="Author"
                      />
                      <span>Byron F. Lambert</span>
                    </div>
                  </div>
                  <div className="duration-ratting">
                    <span className="duration">
                      <i className="far fa-clock" /> <b>185</b> minute
                    </span>
                    <span className="ratting">
                      <i className="fas fa-star" />
                      <span>4.9</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-sm-6 item development medical">
                <div
                  className="course-item"
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="image">
                    <img src="assets/images/courses/course4.jpg" alt="Course" />
                    <a href="#" className="details-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <div className="content">
                    <a className="category" href="#">
                      Business
                    </a>
                    <h6>
                      <a href="#">How To Grow your Business Development</a>
                    </h6>
                    <div className="author">
                      <img
                        src="assets/images/courses/course-author4.png"
                        alt="Author"
                      />
                      <span>Byron F. Lambert</span>
                    </div>
                  </div>
                  <div className="duration-ratting">
                    <span className="duration">
                      <i className="far fa-clock" /> <b>185</b> minute
                    </span>
                    <span className="ratting">
                      <i className="fas fa-star" />
                      <span>4.9</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-sm-6 item design business">
                <div
                  className="course-item"
                  data-aos="fade-up"
                  data-aos-delay={50}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="image">
                    <img src="assets/images/courses/course5.jpg" alt="Course" />
                    <a href="#" className="details-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <div className="content">
                    <a className="category" href="#">
                      Medical Care
                    </a>
                    <h6>
                      <a href="#">Basic Medical Caring from your Home</a>
                    </h6>
                    <div className="author">
                      <img
                        src="assets/images/courses/course-author5.png"
                        alt="Author"
                      />
                      <span>Byron F. Lambert</span>
                    </div>
                  </div>
                  <div className="duration-ratting">
                    <span className="duration">
                      <i className="far fa-clock" /> <b>185</b> minute
                    </span>
                    <span className="ratting">
                      <i className="fas fa-star" />
                      <span>4.9</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-sm-6 item marketing medical">
                <div
                  className="course-item"
                  data-aos="fade-up"
                  data-aos-delay={100}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  <div className="image">
                    <img src="assets/images/courses/course6.jpg" alt="Course" />
                    <a href="#" className="details-btn">
                      <i className="far fa-arrow-right" />
                    </a>
                  </div>
                  <div className="content">
                    <a className="category" href="#">
                      Mobile Apps
                    </a>
                    <h6>
                      <a href="#">Basic to Advance UI/UX Design (Web+Mobile)</a>
                    </h6>
                    <div className="author">
                      <img
                        src="assets/images/courses/course-author6.png"
                        alt="Author"
                      />
                      <span>Byron F. Lambert</span>
                    </div>
                  </div>
                  <div className="duration-ratting">
                    <span className="duration">
                      <i className="far fa-clock" /> <b>185</b> minute
                    </span>
                    <span className="ratting">
                      <i className="fas fa-star" />
                      <span>4.9</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CoursesIsotope;
