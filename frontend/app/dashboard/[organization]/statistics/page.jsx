// page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/layouts/dashboard/index';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import './statistics.css';
import { Card, Col, Row, Tab } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Page = () => {
    const { data: user, isError, isLoading } = useRetrieveUserQuery();
    const router = useRouter();

    const series = [
        {
            name: 'This Month',
            data: [44, 55, 57, 56, 61, 58, 63]
        },
        {
            name: 'Prev Month',
            data: [76, 85, 101, 98, 87, 105, 91]
        },
        
    ];

    const options = {
        chart: {
            height: 250,
            type: 'bar'
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#1DE9B6', '#04A9F5', '#3EBFEA'],
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return '$ ' + val + ' thousands';
                }
            }
        }
    };

    const series1 = [44, 55, 13, 43, 22];

    const options1 = {
        chart: {
            height: 250,
            type: 'pie'
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        colors: ['#04A9F5', '#1DE9B6', '#3EBFEA', '#F4C22B', '#F44236'],
        legend: {
            show: true,
            position: 'bottom'
        },
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: false
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options1: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };

    return (
        <Layout>
            <Row>
            <React.Fragment>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <h5>Transactions</h5>
                    </Card.Header>
                    <Card.Body>
                        <ReactApexChart
                            dir="ltr"
                            className="apex-charts"
                            options={options}
                            series={series}
                            type="bar"
                            height={250}
                        />
                    </Card.Body>
                </Card>
            </Col>
            </React.Fragment>

            <React.Fragment>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <h5>Donations</h5>
                    </Card.Header>
                    <Card.Body>
                        <ReactApexChart
                            dir="ltr"
                            className="apex-charts"
                            options={options}
                            series={series}
                            type="bar"
                            height={250}
                        />
                    </Card.Body>
                </Card>
            </Col>
            </React.Fragment>

            <React.Fragment>
            <Col md={4}>
                <Card>
                    <Card.Header>
                        <h5>Pie Charts</h5>
                    </Card.Header>
                    <Card.Body>
                        <ReactApexChart
                            dir="ltr"
                            className="apex-charts"
                            options={options1}
                            series={series1}
                            type="pie"
                            height={350}
                        />
                    </Card.Body>
                </Card>
            </Col>
            </React.Fragment>

                <React.Fragment>
                <Col md={4}>
                    <Card className='custom-card'>
                        <Card.Header>
                            <h5>Buy and Sell report</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className='h2 d-block'>
                                <strong className="number">$&nbsp;8.00</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                </React.Fragment>
                <React.Fragment>
                <Col md={4}>
                    <Card className='custom-card'>
                        <Card.Header>
                            <h5>Donation report</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className='h2 d-block'>
                                <strong className="number">$&nbsp;8.00</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                </React.Fragment>
            
            
            <Row className="mt-4"> 
                <React.Fragment>
                <Col md={12}>
                    <Card className='custom-card'>
                        <Card.Header>
                            <h5>Total recaudation</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className='h2 d-block'>
                                <strong className="number">$&nbsp;8.00</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                </React.Fragment>
            </Row>

            </Row>
        </Layout>
    );
};

export default Page;
