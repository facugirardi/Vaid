"use client";
import LandingLayout from "@/layouts/LandingLayout";
import { useEffect, useState } from "react";
import './PassReset.css';
import { useResetPasswordConfirmMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const breaks = Array(10).fill(0).map((_, i) => <br key={i} />); // borrar cuando se haga el login


const page = ( { params } ) => {
  const [resetPasswordConfirm, { isLoading }] = useResetPasswordConfirmMutation();
  const { push } = useRouter();

  const [formData, setFormData] = useState({
      new_password : '',
      re_new_password : ''
  });

  const { new_password, re_new_password } = formData


  const onChange = (event) => {
      const { name, value } = event.target;
      setFormData({...formData, [name]: value });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const { uid, token } = params;

    resetPasswordConfirm({ uid, token, new_password, re_new_password })
        .unwrap()
        .then(() => {
            toast.success('Password succesfully changed')
            push('/auth/login');
        })
        .catch((error) => {
            console.log(error); // Muestra el error en la consola
        
            if (error.data && typeof error.data === 'object') {
                Object.keys(error.data).forEach(key => {
                    const messages = error.data[key];
                    if (Array.isArray(messages)) {
                        messages.forEach(message => {
                            toast.error(message); // Muestra cada mensaje de error individualmente
                        });
                    } else {
                        toast.error(messages); // Muestra un mensaje directo
                    }
                });
            } else if (error.message) {
                // Si solo hay un mensaje de error general
                toast.error(error.message);
            } else {
                // Mensaje de error genérico si no hay información específica
                toast.error('Failed to change password. Please try again.');
            }
        })
}






  useEffect(() => {
    document.querySelector("body").classList.add("home-three");
  }, []);
  const [active, setActive] = useState("collapse1");
  return (
    <LandingLayout header footer bodyClass={"home-three"} onePage>
      {/* Signup area start */}
      <section
        className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100"
      >
        <div className="container">
          <div className="d-flex justify-content-center">
        <div className='wrapper'>
            <form onSubmit={onSubmit}>
                <div className='flex-item-logo'>
                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                </div>

                <div className='flex-item-logo'>
                    <h3>Change your password</h3>
                </div>

                <div className="input-box flex-item">
                    <label className='label_input'>Enter your new password</label>
                    <input onChange={onChange} value={new_password} name='new_password' type="password" placeholder='Enter new password' required />
                </div>


                <div className="input-box flex-item">
                    <label className='label_input'>Confirm your new password</label>
                    <input onChange={onChange}  value={re_new_password} name='re_new_password' type="password" placeholder='Confirm new password' required />
                </div>

                <div className='flex-item'>
                <button type="submit">Change</button>
                </div>

                
            </form>
        </div>
            {breaks} {/*borrar cuando se haga el login*/}      

          </div>
        </div>
      </section>
      {/* Signup area End */}
    </LandingLayout>
  );
};
export default page;

