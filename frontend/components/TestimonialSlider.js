"use client";
import { sliderProps } from "@/utility/sliderProps";
import { Fragment } from "react";
import Slider from "react-slick";
const TestimonialSlider = () => {
  return (
    <Fragment>
      <Slider
        {...sliderProps.marqueeSliderRight}
        className="marquee-slider-right testi-slider-right"
      >
        <div className="testimonial-item">
          <div className="author">
            <div className="image">
              <img src="assets/images/testimonials/author1.png" alt="Author" />
            </div>
            <div className="title">
              <b>Dennis J. Lester /</b> CEO &amp; Founder
            </div>
          </div>
          <div className="author-text">
            At vero eoset accusamus iusto dignissimos ducimus blanditiis
            praesentium voluptatume delenitie corruptie dolores molestias
          </div>
          <div className="testi-footer">
            <div className="ratting">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <span className="text">
              <span>4.7/5</span> on Trustpilot
            </span>
          </div>
        </div>
        <div className="testimonial-item">
          <div className="author">
            <div className="image">
              <img src="assets/images/testimonials/author2.png" alt="Author" />
            </div>
            <div className="title">
              <b>Nicholas S. Moore /</b> Manager
            </div>
          </div>
          <div className="author-text">
            At vero eoset accusamus iusto dignissimos ducimus blanditiis
            praesentium voluptatume delenitie corruptie dolores molestias
          </div>
          <div className="testi-footer">
            <div className="ratting">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <span className="text">
              <span>4.7/5</span> on Trustpilot
            </span>
          </div>
        </div>
        <div className="testimonial-item">
          <div className="author">
            <div className="image">
              <img src="assets/images/testimonials/author3.png" alt="Author" />
            </div>
            <div className="title">
              <b>Mark S. Dearing /</b> Designer
            </div>
          </div>
          <div className="author-text">
            At vero eoset accusamus iusto dignissimos ducimus blanditiis
            praesentium voluptatume delenitie corruptie dolores molestias
          </div>
          <div className="testi-footer">
            <div className="ratting">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <span className="text">
              <span>4.7/5</span> on Trustpilot
            </span>
          </div>
        </div>
      </Slider>
      <Slider
        {...sliderProps.marqueeSliderLeft}
        className="marquee-slider-left testi-slider-left"
        dir="rtl"
      >
        <div className="testimonial-item">
          <div className="author">
            <div className="image">
              <img src="assets/images/testimonials/author5.png" alt="Author" />
            </div>
            <div className="title">
              <b>Joseph D. Tucker / </b> Consultant
            </div>
          </div>
          <div className="author-text">
            At vero eoset accusamus iusto dignissimos ducimus blanditiis
            praesentium voluptatume delenitie corruptie dolores molestias
          </div>
          <div className="testi-footer">
            <div className="ratting">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <span className="text">
              <span>4.7/5</span> on Trustpilot
            </span>
          </div>
        </div>
        <div className="testimonial-item">
          <div className="author">
            <div className="image">
              <img src="assets/images/testimonials/author6.png" alt="Author" />
            </div>
            <div className="title">
              <b>Wiley D. Swanson / </b> Businessman
            </div>
          </div>
          <div className="author-text">
            At vero eoset accusamus iusto dignissimos ducimus blanditiis
            praesentium voluptatume delenitie corruptie dolores molestias
          </div>
          <div className="testi-footer">
            <div className="ratting">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <span className="text">
              <span>4.7/5</span> on Trustpilot
            </span>
          </div>
        </div>
        <div className="testimonial-item">
          <div className="author">
            <div className="image">
              <img src="assets/images/testimonials/author7.png" alt="Author" />
            </div>
            <div className="title">
              <b>Steven J. Ung / </b> JR Manager
            </div>
          </div>
          <div className="author-text">
            At vero eoset accusamus iusto dignissimos ducimus blanditiis
            praesentium voluptatume delenitie corruptie dolores molestias
          </div>
          <div className="testi-footer">
            <div className="ratting">
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
              <i className="fas fa-star" />
            </div>
            <span className="text">
              <span>4.7/5</span> on Trustpilot
            </span>
          </div>
        </div>
      </Slider>
    </Fragment>
  );
};
export default TestimonialSlider;
