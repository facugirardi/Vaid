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
    title: "¿Qué es Vaid?",
    value:
      "Vaid es una plataforma integral diseñada para optimizar y gestionar las operaciones de organizaciones. Ofrece varios módulos y funcionalidades orientadas a digitalizar los procesos internos, mejorar la gestión de toda la organización y optimizar la asignación de recursos."
  },
  {
    id: 2,
    title: "¿Es Vaid un software gratuito?",
    value:
      "Sí, el software de Vaid está disponible de forma gratuita para cualquier tipo de organización. Por favor, póngase en contacto con nuestro equipo para obtener más información sobre las opciones de elegibilidad."
  },
  {
    id: 3,
    title: "¿Es personalizable el software de Vaid para adaptarse a las necesidades específicas de nuestra organización?",
    value:
      "Sí, el software de Vaid está diseñado para ser personalizable y adaptarse a los requisitos únicos de cada organización. Nuestro equipo puede trabajar con usted para adaptar la plataforma a los flujos de trabajo, procesos y branding de su organización."
  },
  {
    id: 4,
    title: "¿Es seguro el software de Vaid?",
    value:
      "Sí, la seguridad es una prioridad para nosotros. El software de Vaid emplea medidas de seguridad robustas para proteger los datos de su organización y garantizar el cumplimiento de las regulaciones de protección de datos. Continuamente monitoreamos y actualizamos nuestros sistemas para protegernos contra posibles amenazas."
  },
  {
    id: 5,
    title: "¿Cuáles son las características clave del software de Vaid?",
    value:
      "Algunas de las características clave del software de Vaid incluyen: herramientas de gestión de recursos humanos, gestión de eventos y actividades, asignación de recursos y gestión de proyectos, capacidades de generación de informes estadísticos, accesibilidad como Aplicación Web Progresiva (PWA) para dispositivos móviles, ¡y más!"
  },
  {
    id: 6,
    title: "¿Puedo acceder al software de Vaid en dispositivos móviles?",
    value:
      "Sí, el software de Vaid es accesible como una Aplicación Web Progresiva (PWA), lo que permite a los usuarios acceder a la plataforma desde cualquier dispositivo con un navegador web. La PWA está optimizada para uso móvil, proporcionando una experiencia de usuario fluida en teléfonos inteligentes y tabletas."
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
                  <i className="fas fa-cog" /> Lo Que Ofrecemos
                </span>
                <h2>Funciones Poderosas Para Ayudar a Gestionar Su Organización</h2>
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
                      Seguro y Confidencial
                  </h5>
                  <p>
                  Nuestros avanzados marcos de seguridad garantizan que todos sus datos permanezcan seguros.                
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
                      Ahorra Tiempo
                  </h5>
                  <p>
                    Vaid puede ahorrarle tiempo y dinero, y ofrecerle soluciones empresariales gratuitas y adecuadas.
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
                    Mejore la Productividad
                  </h5>
                  <p>
                  Al centrarse en las áreas clave, Vaid permite a su equipo lograr más en menos tiempo.
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
                    Gestione Sus Proyectos
                  </h5>
                  <p>
                    Desde el inicio al final, gestione sus tareas, recursos y cronogramas de manera eficiente utilizando nuestras herramientas de gestión de proyectos.
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
                  <i className="flaticon-efficiency" />
                </div>
                <div className="content">
                  <h5>
                    Optimice los Recursos
                  </h5>
                  <p>
                   
                  Vaid no solo optimiza sus recursos, sino que también proporciona soluciones rentables y adecuadas para las necesidades de su empresa.


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
                  <i className="flaticon-market-research" />
                </div>
                <div className="content">
                  <h5>
                    Monitorea tu Trabajo
                  </h5>
                  <p>
Utilice Vaid para monitorear el progreso de su trabajo sin esfuerzo. Este sistema captura datos en tiempo real, brindándole información y análisis.

                  </p>
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
                  <h2>Tome el Control de su Organización</h2>
                </div>
                <p>
Nuestra plataforma le ofrece las herramientas y la flexibilidad necesarias para optimizar sus procesos, mejorar la coordinación del equipo y aumentar la eficiencia operativa. Desde la gestión de recursos humanos hasta la planificación de eventos y el seguimiento de recursos, nuestra solución le brinda el control que necesita para llevar el éxito de su organización a nuevos niveles.

                  </p>
                <div className="row gap-50 pt-25">
                  <div className="col-md-6">
                    <div className="iconic-box style-nine text-white">
                      <div className="icon">
                        <i className="fal fa-laptop-code" />
                      </div>
                      <div className="content">
                        <h5>
                          Amigable para Móviles
                        </h5>
                        <p>
                          Nuestra plataforma está cuidadosamente diseñada para ser compatible con dispositivos móviles.
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
                            Potente Predicción
                        </h5>
                        <p>
                        Experimente la fuerza de una previsión precisa con nuestros algoritmos de predicción.
                        </p>
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
              <h6>Eficiente</h6>
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
              <h6>Seguro</h6>
            </div>
            <div
              className="check-list-item four"
              data-aos="fade-rihgt"
              data-aos-delay={300}
              data-aos-duration={1000}
              data-aos-offset={50}
            >
              <i className="fas fa-check" />
              <h6>Innovador</h6>
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
                  <i className="fas fa-tools" /> Cómo Gestionar
                </span>
                <h2>Aumente Su Productividad con Vaid</h2>
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
                  <h5>Empodere a Su Equipo con una Gestión Efectiva</h5>
                </div>
                <p>
Impulse el crecimiento y la productividad de su equipo con nuestra solución eficiente de gestión de recursos humanos (RRHH). Nuestra plataforma ofrece las herramientas necesarias para atraer y desarrollar a los miembros de su organización.

                 </p>
              </div>
              <div className="feature-icon-box style-three">
                <div className="icon-title">
                  <div className="icon">
                    <i className="far fa-check" />
                  </div>
                  <h5>Organización de Eventos y Tareas Sin Esfuerzo</h5>
                </div>
                <p>
                  Simplifique la planificación y ejecución de eventos y tareas con nuestra plataforma de gestión integrada. Nuestra solución le brinda las herramientas para coordinar eficientemente todas sus actividades.
                </p>
              </div>
              <div className="feature-icon-box style-three">
                <div className="icon-title">
                  <div className="icon">
                    <i className="far fa-check" />
                  </div>
                  <h5>Optimice la Asignación de Recursos</h5>
                </div>
                <p>

Simplifique la gestión de sus recursos con Vaid, maximizando la eficiencia en la asignación y utilización de recursos. Nuestra solución le proporciona las herramientas necesarias para tomar decisiones informadas y maximizar el uso de sus recursos.

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
                  <h2>Preguntas Frecuentes</h2>
                </div>
                <p>
Desde detalles sobre nuestros productos y servicios hasta pautas de uso y políticas, estas preguntas están diseñadas para brindarle la información que necesita.

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
                  <h3>¡Suscríbete al Boletín!</h3>
                  <p>Por favor, ingrese su correo electrónico y obtenga su respuesta.</p>
                </div>
                <form className="newsletter-form style-three" onSubmit={handleEmailSubmit}>
                  <input
                  type="email"
                  placeholder="Ingresa tu email"
                  required
                  className="input-nl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                  <button type="submit">
                    Enviar <i className="far fa-arrow-right" />
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
