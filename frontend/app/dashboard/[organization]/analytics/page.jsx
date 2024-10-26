'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './statistics.css';
import { Card, Col, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import axios from 'axios';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Page = () => {
    const { data: user } = useRetrieveUserQuery();
    const [donations, setDonations] = useState([]);
    const [organizationId, setOrganizationId] = useState("");
    const [buysell, setBuysell] = useState([]);
    const [buySellTotal, setBuySellTotal] = useState(0);
    const [donationTotal, setDonationTotal] = useState(0);
    const [totalRecaudation, setTotalRecaudation] = useState(0);
    const [donationsByMonth, setDonationsByMonth] = useState([]);
    const [operationsByMonth, setOperationsByMonth] = useState([]);

    useEffect(() => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const pathSegments = url.pathname.split('/');
        const dashboardIndex = pathSegments.indexOf('dashboard');
        if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
            setOrganizationId(pathSegments[dashboardIndex + 1]);
        }
    }, []);
  
    useEffect(() => {
        const fetchData = async () => {
            if (organizationId) {
                try {
                    const donationsResponse = await axios.get(`http://localhost:8000/api/donations/`, {
                        params: { org_id: organizationId },
                    });
                    setDonations(donationsResponse.data);

                    const buySellResponse = await axios.get(`http://localhost:8000/api/organization/${organizationId}/operation`);
                    setBuysell(buySellResponse.data);

                    const totalBuySellResponse = await axios.get(`http://localhost:8000/api/organization/TotalAmountOperation`, {
                        params: { ong: organizationId },
                    });
                    setBuySellTotal(totalBuySellResponse.data.total_amount);

                    const totalDonationResponse = await axios.get(`http://localhost:8000/api/organization/TotalAmountDonation`, {
                        params: { ong: organizationId },
                    });
                    setDonationTotal(totalDonationResponse.data.total_amount);
                    setTotalRecaudation(totalDonationResponse.data.total_amount + totalBuySellResponse.data.total_amount);

                    const donationsByMonthResponse = await axios.get(`http://localhost:8000/api/organization/DonationMonth`, {
                        params: { ong: organizationId },
                    });
                    setDonationsByMonth(donationsByMonthResponse.data);

                    const operationsByMonthResponse = await axios.get(`http://localhost:8000/api/organization/OperationMonth`, {
                        params: { ong: organizationId },
                    });
                    setOperationsByMonth(operationsByMonthResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [organizationId]);

    const series = [
        {
            name: 'Ventas',
            data: operationsByMonth.map(item => item.total_donations),
        },
        {
            name: 'Compras',
            data: operationsByMonth.map(item => item.total_donations_previous),
        },
    ];

    const series2 = [
        {
            name: 'Donaciones',
            data: donationsByMonth.map(item => item.total_donations),
        },
    ];
    const series1 = [44, 55, 13, 43, 22, 0, 10];


    const options = {
        chart: { height: 250, type: 'bar', fontFamily: 'Inter, sans-serif' },
        plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        colors: ['#3276E8', '#202020', '#3EBFEA'],
        stroke: { show: true, width: 1, colors: ['transparent'] },
        xaxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec'] },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: val => `$${val}` } }
    };

    const options1 = {
        chart: { height: 250, type: 'pie', fontFamily: 'Inter, sans-serif' },
        labels: ['Tools', 'Money', 'Medications', 'Food', 'Clothes', 'Drinks', 'Others'],
        colors: ['#3276E8', '#2BC155', '#FF3E3E', '#795548', '#9C27B0', '#FF9800', '#9E9E9E'],
        legend: { show: true, position: 'bottom' },
        dataLabels: { enabled: false, dropShadow: { enabled: false } },
        responsive: [{ breakpoint: 480, options1: { legend: { position: 'bottom' } } }],
    };

    return (
        <Layout>
            <Row>
                <Col md={5}>
                    <Card>
                        <Card.Header><h5>Operaciones en este año</h5></Card.Header>
                        <Card.Body>
                            <ReactApexChart className="apex-charts" options={options} series={series} type="bar" height={215} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header><h5>Donaciones en este año</h5></Card.Header>
                        <Card.Body>
                            <ReactApexChart className="apex-charts" options={options} series={series2} type="bar" height={215} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Header><h5>Donaciones por categoría</h5></Card.Header>
                        <Card.Body>
                            <ReactApexChart className="apex-charts" options={options1} series={series1} type="pie" height={230} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={5}>
                    <div className="card2">
                        <h5>Compra/Venta</h5>
                        {buysell.length === 0 ? (
                            <p>No se encontraron registros.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='text-center'>Nombre</th>
                                        <th className='text-center'>Unidades</th>
                                        <th className='text-center'>Monto</th>
                                        <th className='text-center'>Fecha</th>
                                        <th className='text-center'>Operación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buysell.map(item => (
                                        <tr key={item.id}>
                                            <td className='text-center p-donation'><b>{item.description}</b></td>
                                            <td className='text-center p-donation'>{item.quantity}</td>
                                            <td className='text-center p-donation'>$ {item.amount}</td>
                                            <td className='text-center p-donation'><b>{item.date}</b></td>
                                            <td className={`text-center p-donation ${item.type === 'Compra' ? 'text-green' : 'text-red'}`}>
                                                {item.type}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Col>
                <Col md={5}>
                    <div className="card2">
                        <h5>Donaciones</h5>
                        {donations.length === 0 ? (
                            <p>No se encontraron registros.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='text-center'>Descripción</th>
                                        <th className='text-center'>Unidades</th>
                                        <th className='text-center'>Fecha</th>
                                        <th className='text-center'>Categoría</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map(item => (
                                        <tr key={item.id}>
                                            <td className='text-center p-donation'><b>{item.description}</b></td>
                                            <td className="text-center p-donation">
                                                {item.type === "Dinero" ? `$ ${item.quantity}` : item.quantity}
                                            </td>
                                            <td className='text-center p-donation'><b>{item.date}</b></td>
                                            <td className='text-center p-donation'>{item.type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Col>
                <Col md={2}>
                    <Card className='custom-card'>
                        <Card.Header><h5>Recaudación Operaciones</h5></Card.Header>
                        <Card.Body>
                            <div className='h2 d-block'><strong className="number">$&nbsp;{buySellTotal}</strong></div>
                        </Card.Body>
                    </Card>
                    <Card className='custom-card mt-2'>
                        <Card.Header><h5>Recaudación Donaciones</h5></Card.Header>
                        <Card.Body>
                            <div className='h2 d-block'><strong className="number">$&nbsp;{donationTotal}</strong></div>
                        </Card.Body>
                    </Card>
                    <Card className='custom-card mt-2'>
                        <Card.Header><h5>Recaudación Total</h5></Card.Header>
                        <Card.Body>
                            <div className='h2 d-block'><strong className="number">$&nbsp;{totalRecaudation}</strong></div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default Page;
