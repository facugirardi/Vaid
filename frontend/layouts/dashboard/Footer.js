import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="pc-footer">
            <div className="footer-wrapper container-fluid">
                <div className="row">
                    <div className="col-sm-6 ms-auto my-1">
                        <ul className="list-inline footer-link mb-0 justify-content-sm-end d-flex">
                            <li className="list-inline-item"><Link href="/">Home</Link></li>
                            <li className="list-inline-item"><Link href="#" target="_blank">Support</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;