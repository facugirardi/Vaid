import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
//import images
import logoDark from "@/public/assets/images/vaidpng2.png";
import logoLight from "@/public/assets/images/vaidpng2.png";
import avatar from "@/public/assets/images/user/avatar-2.jpg";
import SimpleBar from "simplebar-react";
import { menuItems } from "./MenuData";
import NestedMenu from "./NestedMenu";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './header.css';

const Header = ({ themeMode }) => {

 
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



  return (
    <React.Fragment>
      <nav className="pc-sidebar" id="pc-sidebar-hide">
        <div className="navbar-wrapper">
          <div className="m-header">
            <a href="/" className="b-brand text-primary">
              {themeMode === "dark" ?
                <Image src={logoLight} alt="logo" width={90} className="logo-lg landing-logo" />
                :
                <Image src={logoDark} alt="logo" width={90} className="logo-lg landing-logo" />
              }
              <span className="badge bg-brand-color-2 rounded-pill ms-2 theme-version">
                Beta v0.1
              </span>
            </a>
          </div>
          {/* <div className="navbar-content"> */}
          <SimpleBar className="navbar-content" style={{ maxHeight: "100vh" }}>
            <ul className="pc-navbar" id="pc-navbar">
              {/* Sidebar  */}
              <NestedMenu menuItems={menuItems} />
            </ul>
          </SimpleBar>
          {/* </div> */}
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Header;
