import Link from "next/link";
import { createElement } from "react";

const Tag = ({ tagName, children, ...props }) =>
  createElement(tagName, props, children);

const PageBanner = ({ pageTitle, pageName, titleTag = "h1" }) => {
  return (
    <section
      className="page-banner-area overlay py-250 rpy-120 rel z-1 bgs-cover text-center"
      style={{ backgroundImage: "url(assets/images/backgrounds/banner.jpg)" }}
    >
      <div className="container">
        <div className="banner-inner pt-70 rpt-60 text-white">
          <Tag
            tagName={titleTag}
            className="page-title"
            data-aos="fade-up"
            data-aos-duration={1500}
            data-aos-offset={50}
          >
            {pageTitle ? pageTitle : pageName}
          </Tag>
          <nav aria-label="breadcrumb">
            <ol
              className="breadcrumb justify-content-center"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1500}
              data-aos-offset={50}
            >
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">{pageName}</li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
};
export default PageBanner;
