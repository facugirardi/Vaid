import { THEME_MODE } from "@/common/layoutConfig";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Image from "next/image";
import SimpleBar from "simplebar-react";

//import images
import avatar1 from "@/public/assets/images/user/avatar-1.jpg";
import avatar2 from "@/public/assets/images/user/avatar-2.jpg";
import avatar3 from "@/public/assets/images/user/avatar-3.jpg";

const TopBar = ({ handleOffcanvasToggle, changeThemeMode, toogleSidebarHide, toogleMobileSidebarHide }) => {

    const dispatch = useDispatch();
    // Function to handle theme mode change
    const handleThemeChange = (value) => {
        dispatch(changeThemeMode(value));
    };

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };
    return (
        <React.Fragment>
            <header className="pc-header">
                <div className="header-wrapper">
                    <div className="me-auto pc-mob-drp">
                        <ul className="list-unstyled">
                            <li className="pc-h-item pc-sidebar-collapse">
                                <Link href="#" className="pc-head-link ms-0" id="sidebar-hide" onClick={toogleSidebarHide}>
                                    <i className="ti ti-menu-2"></i>
                                </Link>
                            </li>
                            <li className="pc-h-item pc-sidebar-popup">
                                <Link href="#" className="pc-head-link ms-0" id="mobile-collapse" onClick={toogleMobileSidebarHide}>
                                    <i className="ti ti-menu-2"></i>
                                </Link>
                            </li>
                            <Dropdown as="li" className="pc-h-item d-inline-flex d-md-none">
                                <Dropdown.Toggle as="a" className="pc-head-link arrow-none m-0" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="false" aria-expanded="false">
                                    <i className="ph-duotone ph-magnifying-glass"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="pc-h-dropdown drp-search">
                                    <form className="px-3">
                                        <div className="form-group mb-0 d-flex align-items-center">
                                            <input type="search" className="form-control border-0 shadow-none" placeholder="Search here. . ." />
                                            <button className="btn btn-light-secondary btn-search">Search</button>
                                        </div>
                                    </form>
                                </Dropdown.Menu>
                            </Dropdown>
                            <li className="pc-h-item d-none d-md-inline-flex">
                                <form className="form-search">
                                    <i className="ph-duotone ph-magnifying-glass icon-search"></i>
                                    <input type="search" className="form-control" placeholder="Search..." />
                                    <button className="btn btn-search" style={{ padding: "0" }}><kbd>ctrl+k</kbd></button>
                                </form>
                            </li>
                        </ul>
                    </div>

                    <div className="ms-auto">
                        <ul className="list-unstyled">
                            <Dropdown as="li" className="pc-h-item">
                                <Dropdown.Toggle as="a" className="pc-head-link arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="false" aria-expanded="false">
                                    <i className="ph-duotone ph-sun-dim"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
                                    <Dropdown.Item onClick={() => handleThemeChange(THEME_MODE.DARK)}>
                                        <i className="ph-duotone ph-moon"></i>
                                        <span>Dark</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleThemeChange(THEME_MODE.LIGHT)}>
                                        <i className="ph-duotone ph-sun-dim"></i>
                                        <span>Light</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleThemeChange(THEME_MODE.DEFAULT)}>
                                        <i className="ph-duotone ph-cpu"></i>
                                        <span>Default</span>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                                </Dropdown>
                            <li className="pc-h-item">
                                <a className="pc-head-link pct-c-btn" onClick={handleOffcanvasToggle} href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvas_pc_layout">
                                    <i className="ph-duotone ph-gear-six"></i>
                                </a>
                            </li>
                            <Dropdown as="li" className="pc-h-item">
                                <Dropdown.Toggle as="a" className="pc-head-link arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="false" aria-expanded="false">
                                    <i className="ph-duotone ph-diamonds-four"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
                                    <Dropdown.Item>
                                        <i className="ph-duotone ph-user"></i>
                                        <span>My Account</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <i className="ph-duotone ph-gear"></i>
                                        <span>Settings</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <i className="ph-duotone ph-lifebuoy"></i>
                                        <span>Support</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <i className="ph-duotone ph-lock-key"></i>
                                        <span>Lock Screen</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <i className="ph-duotone ph-power"></i>
                                        <span>Logout</span>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown
                                as="li"
                                show={isDropdownOpen}
                                ref={dropdownRef}
                                className="pc-h-item">
                                <Dropdown.Toggle
                                    aria-expanded={isDropdownOpen}
                                    onClick={toggleDropdown}
                                    as="a"
                                    className="pc-head-link arrow-none me-0" data-bs-toggle="dropdown" href="#"
                                    aria-haspopup="false">
                                    <i className="ph-duotone ph-bell"></i>
                                    <span className="badge bg-success pc-h-badge">3</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-notification dropdown-menu-end pc-h-dropdown">
                                    <div className="dropdown-header d-flex align-items-center justify-content-between">
                                        <h4 className="m-0">Notifications</h4>
                                        <ul className="list-inline ms-auto mb-0">
                                            <li className="list-inline-item">
                                                <Link href="/application/mail" className="avtar avtar-s btn-link-hover-primary">
                                                    <i className="ti ti-link f-18"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <SimpleBar className="dropdown-body text-wrap header-notification-scroll position-relative h-100"
                                        style={{ maxHeight: "calc(100vh - 235px)" }}
                                    >
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <p className="text-span">Today</p>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0">
                                                        <Image src={avatar2} alt="user-image" className="user-avtar avtar avtar-s" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="d-flex">
                                                            <div className="flex-grow-1 me-3 position-relative">
                                                                <h6 className="mb-0 text-truncate">Keefe Bond added new tags to 💪
                                                                    Design system</h6>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <span className="text-sm">2 min ago</span>
                                                            </div>
                                                        </div>
                                                        <p className="position-relative text-muted mt-1 mb-2"><br /><span className="text-truncate">Lorem Ipsum has been
                                                            the industry&apos;s standard dummy text ever since the 1500s.</span></p>
                                                        <span className="badge bg-light-primary border border-primary me-1 mt-1">web design</span>
                                                        <span className="badge bg-light-warning border border-warning me-1 mt-1">Dashboard</span>
                                                        <span className="badge bg-light-success border border-success me-1 mt-1">Design System</span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0">
                                                        <div className="avtar avtar-s bg-light-primary">
                                                            <i className="ph-duotone ph-chats-teardrop f-18"></i>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="d-flex">
                                                            <div className="flex-grow-1 me-3 position-relative">
                                                                <h6 className="mb-0 text-truncate">Message</h6>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <span className="text-sm text-muted">1 hour ago</span>
                                                            </div>
                                                        </div>
                                                        <p className="position-relative text-muted mt-1 mb-2"><br /><span className="text-truncate">Lorem Ipsum has been
                                                            the industry&apos;s standard dummy text ever since the 1500s.</span></p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <p className="text-span">Yesterday</p>
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0">
                                                        <div className="avtar avtar-s bg-light-danger">
                                                            <i className="ph-duotone ph-user f-18"></i>
                                                            </div>
                                                            </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="d-flex">
                                                            <div className="flex-grow-1 me-3 position-relative">
                                                                <h6 className="mb-0 text-truncate">Challenge invitation</h6>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <span className="text-sm text-muted">12 hours ago</span>
                                                            </div>
                                                        </div>
                                                        <p className="position-relative text-muted mt-1 mb-2"><br /><span className="text-truncate"><strong> Jonny aber
                                                        </strong> invites you to join the challenge</span></p>
                                                        <button className="btn btn-sm rounded-pill btn-outline-secondary me-2">Decline</button>
                                                        <button className="btn btn-sm rounded-pill btn-primary">Accept</button>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0">
                                                        <Image src={avatar2} alt="user-image" className="user-avtar avtar avtar-s" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="d-flex">
                                                            <div className="flex-grow-1 me-3 position-relative">
                                                                <h6 className="mb-0 text-truncate">Keefe Bond <span className="text-body"> added new tags to </span> 💪
                                                                    Design system</h6>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <span className="text-sm text-muted">2 min ago</span>
                                                            </div>
                                                        </div>
                                                        <p className="position-relative text-muted mt-1 mb-2"><br /><span className="text-truncate">Lorem Ipsum has been
                                                            the industry&apos;s standard dummy text ever since the 1500s.</span></p>
                                                        <button className="btn btn-sm rounded-pill btn-outline-secondary me-2">Decline</button>
                                                        <button className="btn btn-sm rounded-pill btn-primary">Accept</button>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="list-group-item">
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0">
                                                        <div className="avtar avtar-s bg-light-success">
                                                            <i className="ph-duotone ph-shield-checkered f-18"></i>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <div className="d-flex">
                                                            <div className="flex-grow-1 me-3 position-relative">
                                                                <h6 className="mb-0 text-truncate">Security</h6>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <span className="text-sm text-muted">5 hours ago</span>
                                                            </div>
                                                        </div>
                                                        <p className="position-relative text-muted mt-1 mb-2">Lorem Ipsum is simply dummy text of the printing and
                                                            typesetting industry. Lorem Ipsum has been the industry&apos;s standard
                                                            dummy text ever since the 1500s.</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </SimpleBar>
                                    <div className="dropdown-footer">
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="d-grid"><button className="btn btn-primary">Archive all</button></div>
                                            </div>
                                            <div className="col-6">
                                                <div className="d-grid"><button className="btn btn-outline-secondary">Mark all as read</button></div>
                                            </div>
                                        </div>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown as="li" className="pc-h-item header-user-profile">
                                <Dropdown.Toggle className="pc-head-link arrow-none me-0" data-bs-toggle="dropdown" href="#"
                                    aria-haspopup="false" data-bs-auto-close="outside" aria-expanded="false" style={{ border: "none" }}>
                                    <Image src={avatar2} alt="user-image" width={40} className="user-avtar" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-user-profile dropdown-menu-end pc-h-dropdown">
                                    <div className="dropdown-header d-flex align-items-center justify-content-between">
                                        <h4 className="m-0">Profile</h4>
                                    </div>
                                    <div className="dropdown-body">
                                        <SimpleBar className="profile-notification-scroll position-relative" style={{ maxHeight: "calc(100vh - 225px)" }}>
                                        <ul className="list-group list-group-flush w-100">
                                                <li className="list-group-item">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-shrink-0">
                                                            <Image src={avatar2} alt="user-image" width={50} className="wid-50 rounded-circle" />
                                                        </div>
                                                        <div className="flex-grow-1 mx-3">
                                                            <h5 className="mb-0">Carson Darrin</h5>
                                                            <a className="link-primary" href="mailto:carson.darrin@company.io">carson.darrin@company.io</a>
                                                        </div>
                                                        <span className="badge bg-primary">PRO</span>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-key"></i>
                                                            <span>Change password</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-envelope-simple"></i>
                                                            <span>Recently mail</span>
                                                        </span>
                                                        <div className="user-group">
                                                            <Image src={avatar1} alt="user-image" className="avtar" />
                                                            <Image src={avatar2} alt="user-image" className="avtar" />
                                                            <Image src={avatar3} alt="user-image" className="avtar" />
                                                        </div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-calendar-blank"></i>
                                                            <span>Schedule meetings</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                </li>
                                                <li className="list-group-item">
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-heart"></i>
                                                            <span>Favorite</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-arrow-circle-down"></i>
                                                            <span>Download</span>
                                                        </span>
                                                        <span className="avtar avtar-xs rounded-circle bg-danger text-white">10</span>
                                                    </Dropdown.Item>
                                                </li>
                                                <li className="list-group-item">
                                                    <div className="dropdown-item">
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-globe-hemisphere-west"></i>
                                                            <span>Languages</span>
                                                        </span>
                                                        <span className="flex-shrink-0">
                                                            <select className="form-select bg-transparent form-select-sm border-0 shadow-none">
                                                                <option value="1">English</option>
                                                                <option value="2">Spain</option>
                                                                <option value="3">Arabic</option>
                                                            </select>
                                                        </span>
                                                    </div>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-flag"></i>
                                                            <span>Country</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                    <div className="dropdown-item">
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-moon"></i>
                                                            <span>Dark mode</span>
                                                        </span>
                                                        <div className="form-check form-switch form-check-reverse m-0">
                                                            <input className="form-check-input f-18" id="dark-mode" type="checkbox"
                                                                role="switch" />
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-user-circle"></i>
                                                            <span>Edit profile</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-star text-warning"></i>
                                                            <span>Upgrade account</span>
                                                            <span className="badge bg-light-success border border-success ms-2">NEW</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-bell"></i>
                                                            <span>Notifications</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                        <i className="ph-duotone ph-gear-six"></i>
                                                            <span>Settings</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                </li>
                                                <li className="list-group-item">
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-plus-circle"></i>
                                                            <span>Add account</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-power"></i>
                                                            <span>Logout</span>
                                                        </span>
                                                    </Dropdown.Item>
                                                </li>
                                            </ul>
                                        </SimpleBar>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ul>
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
};

export default TopBar;

