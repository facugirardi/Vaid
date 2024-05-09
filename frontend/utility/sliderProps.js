function Arrow({ className, extraClass, onClick, icon }) {
  return (
    <button className={`${className} ${extraClass}`} onClick={onClick}>
      <i class={icon}></i>
    </button>
  );
}
export const sliderProps = {
  marqueeSliderRight: {
    speed: 8000,
    autoplay: true,
    autoplaySpeed: 0,
    centerMode: true,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    buttons: false,
  },
  marqueeSliderLeft: {
    speed: 8000,
    autoplay: true,
    autoplaySpeed: 0,
    centerMode: true,
    cssEase: "linear",
    slidesToShow: 1,
    slidesToScroll: -1,
    variableWidth: true,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    buttons: true,
    rtl: true,
  },
  testiSliderSeven: {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    dots: false,
  },
  testiSliderEight: {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    dots: false,
  },
  testiSliderThree: {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  },
  testiSliderFour: {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  },
  testiSliderFive: {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    dots: true,
  },
  testiSliderSix: {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 1,
    arrows: true,
    dots: false,
    prevArrow: <Arrow icon={"far fa-chevron-left"} extraClass={"prev-arrow"} />,
    nextArrow: (
      <Arrow icon={"far fa-chevron-right"} extraClass={"next-arrow"} />
    ),
  },
  testiSliderNine: {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  },
};
