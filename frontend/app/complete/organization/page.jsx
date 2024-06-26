
"use client";
import React, { useState } from 'react';
import LandingLayout from "@/layouts/LandingLayout";
import './comp-org.css';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import FeatherIcon from "feather-icons-react";
import { countries } from "@/common/countries";
import axios from 'axios';

const Page = () => {
    const { push } = useRouter();
    const { data: user } = useRetrieveUserQuery();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const onFileChange = event => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setPreview(URL.createObjectURL(event.target.files[0]));
        } else {
            setFile(null);
            setPreview(null);
        }
    };

 

  
const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', event.target['org-name'].value);
    formData.append('description', event.target['description'].value);
    formData.append('country', event.target['country'].value);
    formData.append('user_id', user.id);

    const formData2 = new FormData();
    if (file) {
        formData2.append('image', file);
    }
    formData2.append('user_id', user.id);

    try {
        const response = await axios.post('http://localhost:8000/api/upload-image', formData2, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        });

        if (response.status === 201) {
            try {
                const response = await fetch('http://localhost:8000/api/user/organization', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    try {
                        const response = await fetch(`http://localhost:8000/api/user/${user.id}/complete`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                user_type: 2,
                                is_completed: 1,
                            }),
                        });

                        if (response.ok) {
                            push('/dashboard');
                        } else {
                            toast.error('Network response was not ok.');
                        }
                    } catch (error) {
                        toast.error('Failed to update user. Error: ', error);
                    }
                } else {
                    const errorData = await response.json();
                    toast.error(`Failed to create organization: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                toast.error('Error submitting form');
            }
        } else {
            toast.error('Error uploading image.');
        }
    } catch (error) {
        console.error('Error submitting image: ', error);
        toast.error('Error submitting image');
    }
};






    return (
        <LandingLayout header footer bodyClass={"home-three"} onePage>
            <section className="hero-area-three bgs-cover bgc-lighter pt-210 rpt-150 pb-100">
                <div className="container">
                    <div className="d-flex justify-content-center">
                        <div className='wrapper-complete-user'>
                            <form onSubmit={handleSubmit}>
                                <div className='flex-item-logo'>
                                    <img src="/assets/images/vaidpng3.png" alt="" className='imgLogo_login'/>
                                </div>
                                <div className="input-box flex-item-upload">
                                    <label htmlFor="upload-button" className="upload-button">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="preview-img" />
                                        ) : (
                                            <div className="icon-container">
                                                <FeatherIcon icon="upload" />
                                            </div>
                                        )}
                                        <input id="upload-button" type="file" onCha nge={onFileChange} style={{ display: 'none' }} />
                                    </label>
                                    <label className='label_input upl-label'>Click to upload a picture</label>
                                </div>
                                <div className="input-box flex-item">
                                    <label className='label_input'>Organization Name</label>
                                    <input name='org-name' type="text" placeholder='Enter the name of your organization' required />
                                </div>
                                <div className="input-box flex-item">
                                    <label className='label_input'>Country</label>
                                    <select name='country' className='country_label' required>
                                        {countries.map((country, index) => (
                                            <option key={index} value={country.name}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-box flex-item">
                                    <label className='label_input'>Description</label>
                                    <input className='description-org' name='description' type="text" placeholder='Enter a description' required />
                                </div>
                                <div className='flex-item'>
                                    <button type="submit">Continue</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </LandingLayout>
    );
};

export default Page;
