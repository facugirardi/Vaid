"use client";
import { sliderProps } from "@/utility/sliderProps";
import { Component } from "react";
import Slider from "react-slick";

export default class TestimonialSlider2 extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  render() {
    return (
      <div className="container">
        <div className="row gap-60 align-items-center">
          <div
            className="col-lg-5 text-white rmb-55"
            data-aos="fade-left"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <div className="section-title text-white mb-40">
              <h2>
                What’s Our Customer Say About <span>Akpager</span>
              </h2>
            </div>
            <p>
              But I must explain to you how all this mistaken idea denouncing
              pleasure and praising pain was born and I will give you a complete
              account of the system expound the actual teachings
            </p>
            <div className="testimonials-arrows mt-55">
              <button
                className="slick-arrow testi-prev"
                onClick={this.previous}
              >
                <i className="fas fa-arrow-left" />
              </button>
              <button className="slick-arrow testi-next" onClick={this.next}>
                <i className="fas fa-arrow-right" />
              </button>
            </div>
          </div>
          <div
            className="col-lg-7"
            data-aos="fade-right"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            <Slider
              ref={(c) => (this.slider = c)}
              {...sliderProps.testiSliderSeven}
              className="testi-slider-seven mb-70"
            >
              <div className="testimonial-item">
                <div className="author">
                  <div className="image">
                    <img src="assets/images/testimonials/author7.png" alt="" />
                  </div>
                  <div className="title">
                    <b>Nicholas S. Moore /</b> CEO &amp; Founder
                  </div>
                </div>
                <div className="author-text">
                  At vero eoset accusamus dignissimos ducimus blanditiis
                  praesentium volupta delenitie corruptie molestias
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
                    <img src="assets/images/testimonials/author7.png" alt="" />
                  </div>
                  <div className="title">
                    <b>Nicholas S. Moore /</b> CEO &amp; Founder
                  </div>
                </div>
                <div className="author-text">
                  At vero eoset accusamus dignissimos ducimus blanditiis
                  praesentium volupta delenitie corruptie molestias
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
          </div>
        </div>
      </div>
    );
  }
}
