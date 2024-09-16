"use client";
import AkpagerAccordion from "@/components/AkpagerAccordion";
import LandingLayout from "@/layouts/LandingLayout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Accordion, Nav, Tab } from "react-bootstrap";
import { toast } from "react-toastify";

const accordionItems = [
  {
    id: 1,
    title: "What is Vaid?",
    value:
    "Vaid is a comprehensive platform designed to streamline and manage the operations of Non-profit Organizations. It offers various modules and functionalities aimed at digitizing internal processes, enhancing the entire organization management, and optimizing resource allocation."
  },
  {
    id: 2,
    title: "Is Vaid software free to use?",
    value:
      "Yes, Vaid software is available for free to qualifying Non-profit Organizations that meet certain criteria. Please contact our team for more information on eligibility options."
  },
  {
    id: 3,
    title: "Is Vaid software customizable to fit our organization's specific needs?",
    value:
      "Yes, Vaid software is designed to be customizable to accommodate the unique requirements of each organization. Our team can work with you to tailor the platform to suit your organization's workflows, processes, and branding."
  },
  {
    id: 4,
    title: "Is Vaid software secure?",
    value:
    "Yes, security is a top priority for us. Vaid software employs robust security measures to protect your organization's data and ensure compliance with data protection regulations. We continuously monitor and update our systems to safeguard against potential threats."
  },
  {
    id: 5,
    title: "What are the key features of Vaid software?",
    value:
    "Some key features of Vaid software include: HR management tools, event and activity management, resource allocation and project management, statistical reporting capabilities, Progressive Web Application (PWA) accessibility for mobile devices, and others!"
  },
  {
    id: 6,
    title: "Can I access Vaid software on mobile devices?",
    value:
      "Yes, Vaid software is accessible as a Progressive Web Application (PWA), allowing users to access the platform from any device with a web browser. The PWA is optimized for mobile use, providing a seamless user experience on smartphones and tablets."
  },
];

const page = () => {
  const [email, setEmail] = useState('');
  const [active, setActive] = useState("collapse1");

  useEffect(() => {
    document.querySelector("body").classList.add("home-three");
  }, []);


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/subscribe-newsletter/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setEmail(''); // Limpiar el campo después de la suscripción
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to subscribe');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      {/* Hero area start */}
      <section
        id="home"
        className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100"
      >
        <div className="container">
          <div className="row gap-55 align-items-center">
            <div className="col-lg-6">
              <div
                className="hero-content style-three rmb-55"
                data-aos="fade-left"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <h1>
                  
                
                  #1 en Soluciones de Gestión de <span>Organizaciones</span>
                </h1>
                <p>
                Diseñado para empoderar a todo tipo de organizaciones, ofreciendo soluciones de gestión innovadoras y eficientes.               </p>
              
                <a href="/auth/register" className="theme-btn mt-15 mb-10">
                  Comenzar <i className="far fa-arrow-right" />
                </a>
                <ul className="icon-list style-two">
                  <li>
                    <i className="fal fa-check" /> Gratuito
                  </li>
                  <li>
                    <i className="fal fa-check" /> Seguro
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 rel z-1">
              <div
                className="hero-three-image"
                data-aos="fade-right"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <img src="assets/images/backgrounds/bg-landing.jpg" alt="Hero" style={{borderRadius:'10px'}}/>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Hero area End */}
      {/* Client Logos Area Start */}
      <section className="client-logo-area pt-120 rpt-100 pb-90 rpb-70 bgc-navyblue">
        <div
          className="section-title text-center text-white mb-60"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-offset={50}
        >
          <h4>Organizaciones Que Nos Apoyaron</h4>
        </div>
        <div className="client-logo-wrap logo-white">
          <div
            className="client-logo-item"
            data-aos="fade-up"
            data-aos-duration={1000}
            data-aos-offset={50}
          >
            <a href="https://vasodeleche.org/" target="_blank">
              <img
                src="assets/images/client-logos/vaso.png"
                alt="Client Logo"
              />
            </a>
          </div>
          <div
            className="client-logo-item"
            data-aos="fade-up"
            data-aos-delay={50}
            data-aos-duration={1000}
            data-aos-offset={50}
          >
            <a href="https://vasodeleche.org/" target="_blank">
              <img
                src="assets/images/client-logos/vaso.png"
                alt="Client Logo"
              />
            </a>
          </div>
          <div
            className="client-logo-item"
            data-aos="fade-up"
            data-aos-delay={100}
            data-aos-duration={1000}
            data-aos-offset={50}
          >
            <a href="https://vasodeleche.org/" target="_blank">
              <img
                src="assets/images/client-logos/vaso.png"
                alt="Client Logo"
              />
            </a>
          </div>
          <div
            className="client-logo-item"
            data-aos="fade-up"
            data-aos-delay={150}
            data-aos-duration={1000}
            data-aos-offset={50}
          >
            <a href="https://vasodeleche.org/" target="_blank">
              <img
                src="assets/images/client-logos/vaso.png"
                alt="Client Logo"
              />
            </a>
          </div>
          <div
            className="client-logo-item"
            data-aos="fade-up"
            data-aos-delay={200}
            data-aos-duration={1000}
            data-aos-offset={50}
          >
            <a href="https://vasodeleche.org/" target="_blank">
              <img
                src="assets/images/client-logos/vaso.png"
                alt="Client Logo"
              />
            </a>
          </div>

        </div>
      </section>
      {/* Client Logos Area End */}
      {/* Tab Area Start */}
      <section id="about" className="tab-area-two bgc-lighter pt-125 rpt-105">
        <div className="container">
          <div className="row justify-content-center">
            <div
              className="col-xl-7 col-lg-9 col-md-11"
              data-aos="fade-up"
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="section-title text-center mb-35">
                <span className="subtitle-one mb-20">
                  <i className="flaticon-layers" /> ¿Por Qué Usar Vaid?
                </span>
                <h2>
                  Software de gestión todo en uno, simple e innovador.
                </h2>
              </div>
            </div>
          </div>
          <Tab.Container defaultActiveKey={"tabTwo1"}>
            <div
              className="row justify-content-center"
              data-aos="fade-up"
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="col-lg-10">
                <Nav
                  as={"ul"}
                  className="nav advanced-tab style-two mb-55"
                  role="tablist"
                >
                  <Nav.Item as={"li"}>
                    <Nav.Link as={"button"} eventKey="tabTwo1">
                      
                      Soluciones Innovadoras

                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as={"li"}>
                    <Nav.Link as={"button"} eventKey="tabTwo2">
                      Fácil de Usar
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as={"li"}>
                    <Nav.Link as={"button"} eventKey="tabTwo3">
                      Excelentes Analíticas
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>
            <Tab.Content className="tab-content">
              <Tab.Pane className="tab-pane fade" eventKey="tabTwo1">
                <div className="row align-items-center justify-content-center">
                  <div className="col-xl-5 col-lg-6">
                    <div
                      className="content rmb-55"
                      data-aos="fade-left"
                      data-aos-duration={1000}
                      data-aos-offset={50}
                    >
                      <div className="section-title mb-30">
                        <h3>Revolucionando la Productividad</h3>
                      </div>
                      <p>
                      Desbloquear soluciones innovadoras significa adoptar características que maximizan la eficiencia y minimizan los obstáculos. Este enfoque fomenta una cultura de innovación, donde cada interacción se optimiza para la productividad y la comodidad, empoderando a los usuarios para alcanzar sus objetivos con facilidad.
                     </p>
                      <ul className="icon-list style-two my-35">
                        <li>
                          <i className="fal fa-check" /> Adopta una Conexión Sin Fronteras

                        </li>
                        <li>
                          <i className="fal fa-check" /> Potenciando la Productividad en Cada Paso



                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div
                      className="image text-left text-lg-end"
                      data-aos="fade-right"
                      data-aos-duration={1000}
                      data-aos-offset={50}
                    >
                      <img src="assets/images/placeholder547x487.png" alt="Tab" style={{borderRadius:'10px'}}/>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane className="tab-pane fade" eventKey="tabTwo2">
                <div className="row align-items-center justify-content-center">
                  <div className="col-lg-6">
                    <div className="image">
                    <img src="assets/images/placeholder547x487.png" alt="Tab" style={{borderRadius:'10px'}}/>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-6">
                    <div className="content rmt-55">
                      <div className="section-title mb-30">
                        <h3>Soluciones Sin Esfuerzo para Cada Tarea</h3>
                      </div>
                      <p>
En el mundo de las soluciones innovadoras, la facilidad de uso es primordial. Nuestra plataforma encarna esta filosofía al ofrecer características intuitivas que simplifican incluso las tareas más complejas. Cada interacción está diseñada pensando en la experiencia del usuario. Con nuestro enfoque, navegar por las tareas se vuelve sencillo, permitiendo a los usuarios lograr más con menos esfuerzo.

                      </p>
                      <ul className="icon-list style-two my-35">
                        <li>
                          <i className="fal fa-check" /> Diseño Amigable
                        </li>
                        <li>
                          <i className="fal fa-check" /> Donde la Eficiencia se Encuentra con la Facilidad
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane className="tab-pane fade" eventKey="tabTwo3">
                <div className="row align-items-center justify-content-center">
                  <div className="col-xl-5 col-lg-6">
                    <div className="content rmb-55">
                      <div className="section-title mb-30">
                        <h3>Revelando el Poder de los Datos</h3>
                      </div>
                      <p>
Con potentes herramientas de análisis de datos a tu alcance, te brindamos el poder de desbloquear todo el potencial de tu información, transformando datos en bruto en inteligencia procesable. Desde la identificación de tendencias emergentes hasta la previsión de futuras oportunidades, nuestra plataforma te equipa con las herramientas necesarias para impulsar el crecimiento y la innovación.

                      </p>
                      <ul className="icon-list style-two my-35">
                        <li>
                          <i className="fal fa-check" /> Transformando Conocimientos en Inteligencia Accionable
                        </li>
                        <li>
                          <i className="fal fa-check" /> Impulsando el Crecimiento y la Innovación
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="image text-left text-lg-end">
                    <img src="assets/images/placeholder547x487.png" alt="Tab" style={{borderRadius:'10px'}}/>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </section>
      {/* Tab Area End */}
      {/* What We Offer Area Start */}
      <section
        id=""
        className="what-we-offer-area bgc-lighter pt-100 rpt-80 pb-90 rpb-70"
      >
        <div className="container">
          <div
            className="row justify-content-center"
            data-aos="fade-up"
            data-aos-duration={1000}
            data-aos-offset={50}
          >
            <div className="col-xl-7 col-lg-9 col-md-11">
              <div className="section-title text-center mb-55">
                <span className="subtitle-one mb-20">
                  <i className="fas fa-cog" /> What We Offer
                </span>
                <h2>Powerful Features To Help You Manage Your Organization</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-xl-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="iconic-box style-five">
                <div className="icon">
                  <i className="flaticon-security" />
                </div>
                <div className="content">
                  <h5>
                      Secure &amp; Confidential
                  </h5>
                  <p>
                  Our advanced security frameworks and encryption 
                  technologies ensure that all your data remains secure.                  
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="iconic-box style-five">
                <div className="icon">
                  <i className="flaticon-goal" />
                </div>
                <div className="content">
                  <h5>
                      Save time
                  </h5>
                  <p>
                    Vaid can save your time and money, and offer you free and appropriate reasonable business.
                </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="iconic-box style-five">
                <div className="icon">
                  <i className="flaticon-sketching" />
                </div>
                <div className="content">
                  <h5>
                    Enhance Productivity
                  </h5>
                  <p>
                  By focusing on key performance areas, 
                  Vaid enables your team to achieve more in less time.                   
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="iconic-box style-five">
                <div className="icon">
                  <i className="flaticon-web-address" />
                </div>
                <div className="content">
                  <h5>
                    Manage all your projects
                  </h5>
                  <p>
                    From initiation to completion, manage your tasks, resources, 
                    and timelines efficiently using our project management tools.                   </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={100}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="iconic-box style-five">
                <div className="icon">
                  <i className="flaticon-efficiency" />
                </div>
                <div className="content">
                  <h5>
                    Optimize Resources
                  </h5>
                  <p>
                  Vaid not only optimizes your resources 
                  but also provides cost-effective and suitable solutions for your enterprise needs.                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="iconic-box style-five">
                <div className="icon">
                  <i className="flaticon-market-research" />
                </div>
                <div className="content">
                  <h5>
                    Automatically track work
                  </h5>
                  <p>
                  Utilize Vaid to effortlessly monitor your work progress. 
                  This system captures real-time data on tasks, providing you insights and analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* What We Offer Area End */}
      {/* Management Area Start */}
      <section
        className="management-area bgp-bottom bgc-navyblue"
        style={{
          backgroundImage: "url(assets/images/backgrounds/mamagement.png)",
        }}
      >
        <div className="container">
          <div className="row gap-110 align-items-center pt-80 rpt-65 pb-65 rpb-45">
            <div className="col-lg-6">
              <div
                className="management-content text-white mt-40"
                data-aos="fade-right"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <div className="section-title mb-30">
                  <h2>Take Control of Your Organization Management</h2>
                </div>
                <p>
                Our platform offers you the tools and flexibility needed to
                 streamline your processes, enhance team coordination, and
                  increase operational efficiency. From HR management 
                  to event planning and resource tracking, our solution provides 
                  you with the control you need to drive your organization's success to new heights.
                  </p>
                <div className="row gap-50 pt-25">
                  <div className="col-md-6">
                    <div className="iconic-box style-nine text-white">
                      <div className="icon">
                        <i className="fal fa-laptop-code" />
                      </div>
                      <div className="content">
                        <h5>
                          Mobile Friendly
                        </h5>
                        <p>
                          Our platform is meticulously crafted to be mobile-friendly.                        
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="iconic-box style-nine text-white">
                      <div className="icon">
                        <i className="fal fa-cog" />
                      </div>
                      <div className="content">
                        <h5>
                            Powerful Prediction
                        </h5>
                        <p>
                        Experience the strength of precise foresight with our prediction algorithms.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="management-images my-40"
                data-aos="fade-left"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <img
                  src="assets/images/440.png"
                  alt="Management"
                />
                <div className="management-over">
                  <img
                    src="assets/images/2136.png"
                    alt="Management"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="bg-white" />
          <div className="management-bottom pt-105 rpt-85">
            <div
              className="image rel z-2 text-center"
              data-aos="zoom-in-up"
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <img
                src="assets/images/backgrounds/vaid_design_bg.png"
                alt="Management"
              />
            </div>
            <div
              className="check-list-item one"
              data-aos="fade-left"
              data-aos-delay={200}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <i className="fas fa-check" />
              <h6>Efficient</h6>
            </div>
            <div
              className="check-list-item two"
              data-aos="fade-rihgt"
              data-aos-delay={200}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <i className="fas fa-check" />
              <h6>Simple</h6>
            </div>
            <div
              className="check-list-item three"
              data-aos="fade-left"
              data-aos-delay={300}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <i className="fas fa-check" />
              <h6>Secure</h6>
            </div>
            <div
              className="check-list-item four"
              data-aos="fade-rihgt"
              data-aos-delay={300}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <i className="fas fa-check" />
              <h6>Innovative</h6>
            </div>
          </div>
        </div>
      </section>
      {/* Management Area End */}
      {/* How To Manage Area Start */}
      <section className="how-to-manage-area bgc-lighter pt-125 rpt-105 pb-125 rpb-80" id='services'>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-9">
              <div
                className="section-title text-center mb-55"
                data-aos="fade-up"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <span className="subtitle-one mb-20">
                  <i className="fas fa-tools" /> How To Manage
                </span>
                <h2>Increased Your Productivity by Using Vaid</h2>
              </div>
            </div>
          </div>
          <div className="row gap-60 align-items-center">
            <div className="col-lg-6">
              <div
                className="how-to-manage-image rmb-55"
                data-aos="fade-left"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <img
                  src="assets/images/placeholderimage723.png"
                  alt="How To Manage"
                />
              </div>
            </div>
            <div
              className="col-lg-6"
              data-aos="fade-right"
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <div className="feature-icon-box style-three">
                <div className="icon-title">
                  <div className="icon">
                    <i className="far fa-check" />
                  </div>
                  <h5>Empower Your Team with Effective HR Management</h5>
                </div>
                <p>
                Drive your team's growth and productivity with our efficient human resources (HR)
                 management solution. Our platform offers the tools to attract, and 
                 develop your organization's members.                 
                 </p>
              </div>
              <div className="feature-icon-box style-three">
                <div className="icon-title">
                  <div className="icon">
                    <i className="far fa-check" />
                  </div>
                  <h5>Effortless Event and Task Organization</h5>
                </div>
                <p>
                Simplify event and task planning and execution with our integrated management platform. 
                Our solution provides you 
                with the tools to efficiently coordinate all your activities.
                </p>
              </div>
              <div className="feature-icon-box style-three">
                <div className="icon-title">
                  <div className="icon">
                    <i className="far fa-check" />
                  </div>
                  <h5>Optimize Resource Allocation</h5>
                </div>
                <p>
                Streamline your resource management with Vaid, maximizing efficiency in 
                resource allocation and utilization. Our solution equips you with the necessary 
                tools to make decisions and maximize
                 the use of your resources.                 
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How To Manage Area End */}
      {/* FAQs Area Start */}
      <section
        id="faqs"
        className="faqs-area bgc-lighter pt-125 rpt-105 pb-105 rpb-85"
      >
        <div className="container">
          <div className="row gap-120">
            <div className="col-lg-5">
              <div
                className="faq-left-content rmb-55"
                data-aos="fade-left"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                <div className="section-title mb-25">
                  <span className="subtitle-one mb-20">
                    <i className="fas fa-usd-square" /> FAQs
                  </span>
                  <h2>Frequently Asked Questions</h2>
                </div>
                <p>
                From details about our products and services to usage 
                guidelines and policies, this questions were designed 
                to deliver the information you need.               
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <Accordion
                className="accordion"
                defaultActiveKey={active}
                id="accordionOne"
                data-aos="fade-right"
                data-aos-duration={1000}
                data-aos-offset={50}
              >
                {accordionItems.map((item) => (
                  <AkpagerAccordion
                    key={item.id}
                    title={item.title}
                    event={`collapse${item.id}`}
                    onClick={() =>
                      setActive(
                        active == `collapse${item.id}`
                          ? ""
                          : `collapse${item.id}`
                      )
                    }
                    active={active} >                    
                    {item.value} {/* Mostrar el contenido del panel */}
                    </AkpagerAccordion>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
      {/* FAQs Area End */}
      {/* Newsletter Area Start */}
      <section className="newsletter-area bgc-lighter">
        <div className="container">
          <div
            className="newsletter-one-wrap border bgs-cover px-2 px-lg-5 py-120 rpy-100"
            style={{
              backgroundImage: "url(assets/images/backgrounds/newsletter.png)",
            }}
          >
            <div
              className="row justify-content-center text-center"
              data-aos="fade-up"
              data-aos-duration={1000}
              data-aos-offset={15}
            >
              <div className="col-lg-7">
                <div className="section-title mb-30">
                  <h3>Suscribe to Newsletter!</h3>
                  <p>Please enter your email and get your answer.</p>
                </div>
                <form className="newsletter-form style-three" onSubmit={handleEmailSubmit}>
                  <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="input-nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                  <button type="submit">
                    Send <i className="far fa-arrow-right" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Newsletter Area End */}
    </LandingLayout>
  );
};
export default page;
