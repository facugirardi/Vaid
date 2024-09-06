import { THEME_MODE } from "@/common/layoutConfig";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Image from "next/image";
import SimpleBar from "simplebar-react";
import { useLogoutMutation } from "@/redux/features/authApiSlice";
import { logout as setLogout } from '@/redux/features/authSlice'; 
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import './topbar.css'

import avatar from "@/public/assets/images/user/avatar-2.jpg";
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
//import images

const TopBar = ({ handleOffcanvasToggle, changeThemeMode, toogleSidebarHide, toogleMobileSidebarHide }) => {

    const { data: user, isError, isFetching, isLoading } = useRetrieveUserQuery();
    const [avatar2, setImage] = useState(avatar);

    const backendUrl = 'http://localhost:8000'; // Cambia esto a la URL de tu backend
    
   const fetchImage = async () => 
        {
        const formData = new FormData();
        formData.append('user_id', user.id);
        try {
            const response = await fetch(`http://localhost:8000/api/retrieve-logo?user_id=${user.id}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();

                if (data.images.length > 0) {
                    console.log(data.images)
                    const imageUrl = `${backendUrl}${data.images[0].image}`;

                    if (imageUrl) {
                        console.log("Image URL:", imageUrl); // Verificar la URL de la imagen en la consola
                        setImage(imageUrl); // Asegúrate de usar la propiedad correcta
                    } else {
                        setImage(avatar); // Usar imagen por defecto si no se encuentra imagen
                    }
                } else {
                    toast.error('No image found for the specified user');
                }
            } else {
                toast.error('Error fetching image');
            }
        } catch (error) {
            toast.error('Error fetching image');
        }
    };

    if(!isFetching){
    useEffect(() => {
        fetchImage();
       
    }, []);
    }
    const dispatch = useDispatch();
    // Function to handle theme mode change
    const handleThemeChange = (value) => {
        dispatch(changeThemeMode(value));
    };
    const { push } = useRouter();

    const dispatch2 = useAppDispatch();
    const [logout] = useLogoutMutation();
    const { isAuthenticated } = useAppSelector(state => state.auth);

    const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        dispatch2(setLogout())
        toast.success('Logged out successfully.');
        window.location.href = '/auth/login';
      })
      .catch(() => {
        dispatch2(setLogout())
        toast.success('Logged out successfully.');
        window.location.href = '/auth/login';
      })
    }

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

                    <div className="ms-auto">
                        <ul className="list-unstyled">
                            <Dropdown as="li" className="pc-h-item header-user-profile">
                                <Dropdown.Toggle className="pc-head-link arrow-none me-0" data-bs-toggle="dropdown" href="#"
                                    aria-haspopup="false" data-bs-auto-close="outside" aria-expanded="false" style={{ border: "none" }}>
                                    <Image src={avatar2} alt="logo" width={40} height={40} className="user-avtar" />
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
                                                            <Image src={avatar2} alt="logo" width={50} height={50} className="wid-50 rounded-circle" />
                                                        </div>
                                                        <div className="flex-grow-1 mx-3">
                                                            <h5 className="mb-0">{user.first_name} {user.last_name}</h5>
                                                            <a className="link-primary">{user.email}</a>
                                                        </div>
                                                    </div>
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
                                                            </select>
                                                        </span>
                                                        </div>
                                                </li>
                                                <li className="list-group-item">
                                                <div className="dropdown-item" onClick={handleLogout}>
                                                        <span className="d-flex align-items-center">
                                                            <i className="ph-duotone ph-sign-out"></i>
                                                            <a>Logout</a>
                                                        </span>
                                                        </div>
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

