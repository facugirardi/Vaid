import React from "react";

//import images
import logoDark from "@assets/images/logo-dark.svg";
import { Col, Row } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

const FooterBlock = () => {
    return (
        <>
            <div className="auth-sidefooter">
                <Image src={logoDark} className="img-brand img-fluid" alt="images" />
                <hr className="mb-3 mt-4" />
                <Row>
                    <Col className="my-1">
                        <p className="m-0">Made with &#9829; by Team
                            <Link href="https://themeforest.net/user/phoenixcoded" target="_blank"> Phoenixcoded</Link></p>
                    </Col>
                    <div className="col-auto my-1">
                        <ul className="list-inline footer-link mb-0">
                            <li className="list-inline-item"><Link href="/dashboard">Home</Link></li>
                            <li className="list-inline-item"><Link href="https://pcoded.gitbook.io/light-able/" target="_blank">Documentation</Link></li>
                            <li className="list-inline-item"><Link href="https://phoenixcoded.support-hub.io/" target="_blank">Support</Link></li>
                        </ul>
                    </div>
                </Row>
            </div>
        </>
    );
};

export default FooterBlock;