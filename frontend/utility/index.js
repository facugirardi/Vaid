import Aos from "aos";

export const akpagerUtility = {
  animation() {
    Aos.init();
  },
  fixedHeader() {
    window.addEventListener("scroll", function () {
      // Header Style and Scroll to Top
      if (document.querySelectorAll(".main-header").length) {
        var windowpos = document.documentElement.scrollTop;
        var siteHeader = document.querySelector(".main-header");
        if (windowpos >= 100) {
          siteHeader.classList.add("fixed-header");
        } else {
          siteHeader.classList.remove("fixed-header");
        }
      }
    });
  },
};
