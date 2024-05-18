import AkpagerLayout from "@/layouts/LandingLayout";
import Link from "next/link";

const e404 = () => {
  return (
    <AkpagerLayout header={0} footer={0} bodyClass={"home-three"} onePage>
      {" "}
      <section className="error-area py-150 rpy-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-7">
              <div className="error-content mt-80 rmt-60">
                <h1
                  data-aos="fade-up"
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  404<br/>Page not found
                </h1>
                <p
                  data-aos="fade-up"
                  data-aos-delay={50}
                  data-aos-duration={1500}
                  data-aos-offset={50}
                >
                  It looks like you've ventured into uncharted territory. The
                  page you were looking for may have been moved, deleted, or
                  never existed in the first place. But don't worry, you're not
                  lost for long.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
    </AkpagerLayout>
  );
};
export default e404;
