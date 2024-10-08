import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Row, Col } from "react-bootstrap";


const BreadcrumbItem = ({ mainTitle, subTitle }) => {
  return (
    <React.Fragment>
    <Head>
      <title>{subTitle} | Vaid</title>
    </Head>
    <div className="page-header">
      <div className="page-block">
        <Row className="row align-items-center">
          <Col className="col-md-12">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link className='link-global' href="/dashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="#">{mainTitle}</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                {subTitle}
              </li>
            </ul>
          </Col>
          <Col className="col-md-12">
            <div className="page-header-title">
              <h2 className="mb-0">{subTitle}</h2>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    </React.Fragment>
  );
};

export default BreadcrumbItem;
