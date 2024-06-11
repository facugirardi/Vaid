import Link from "next/link";
import React from "react";

const Footer = () => {
    return (
        <footer className="pc-footer">
            <div className="footer-wrapper container-fluid">
                <div className="row">
                    <div className="col-sm-6 my-1">
                        <p className="m-0">Made with &#9829; by Team <Link href="https://themeforest.net/user/phoenixcoded"
                            target="_blank">Phoenixcoded</Link></p>
                    </div>
                    <div className="col-sm-6 ms-auto my-1">
                        <ul className="list-inline footer-link mb-0 justify-content-sm-end d-flex">
                            <li className="list-inline-item"><Link href="/">Home</Link></li>
                            <li className="list-inline-item"><Link href="https://pcoded.gitbook.io/light-able/"
                                target="_blank">Documentation</Link></li>
                            <li className="list-inline-item"><Link href="https://phoenixcoded.support-hub.io/" target="_blank">Support</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;