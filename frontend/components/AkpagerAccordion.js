import { Accordion } from "react-bootstrap";

const AkpagerAccordion = ({ event, active, onClick, title, children }) => {
  return (
    <div className="accordion-item">
      <h5 className="accordion-header">
        <Accordion.Toggle
          as={"button"}
          className={`accordion-button ${active == event ? "" : "collapsed"}`}
          eventKey={event}
          aria-expanded={active == event ? "true" : "false"}
          onClick={() => onClick()}
        >
          {title}
        </Accordion.Toggle>
      </h5>
      <Accordion.Collapse eventKey={event} className="accordion-collapse">
        <div className="accordion-body">
          <p>
            {children}
          </p>
        </div>
      </Accordion.Collapse>
    </div>
  );
};

export default AkpagerAccordion;
