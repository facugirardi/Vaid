// page.jsx
"use client"

import React, { ReactElement, useMemo } from "react";
import Layout from '@/layouts/dashboard/index';
import BreadcrumbItem from '@/common/BreadcrumbItem';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import TableContainer from '@/common/TableContainer';
import { Card, Col, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

import { userData } from "@/common/JsonData";

const page = () => {

    console.log(userData)

    const columns = useMemo(
        () => [
            {
                header: "Name",
                enableColumnFilter: false,
                accessorKey: "avatar",
                cell: (cellProps) => {
                    return (
                        <div className="d-inline-block align-middle" >
                            <Image src={cellProps.getValue()} alt="user image" className="img-radius align-top m-r-15" width={40} />
                            <div className="d-inline-block">
                                <h6 className="m-b-0">{cellProps.row.original.Name}</h6>
                                <p className="m-b-0 text-primary">Android developer</p>
                            </div>
                        </div>
                    )
                }, 
            },
            {
                header: "Position",
                accessorKey: "Position",
                enableColumnFilter: false,
            },
            {
                header: "Office",
                accessorKey: "Office",
                enableColumnFilter: false,
            },
            {
                header: "Age",
                accessorKey: "Age",
                enableColumnFilter: false,
            },
            {
                header: "Start date",
                accessorKey: "Startdate",
                enableColumnFilter: false,
            },
            {
                header: "Status",
                enableColumnFilter: false,
                accessorKey: "status",
                cell: (cellProps) => {
                    return (
                        <>
                            {
                                cellProps.getValue() === "Active" ?
                                    <span className="badge bg-light-success">{cellProps.getValue()}</span>
                                    :
                                    <span className="badge bg-light-danger">{cellProps.getValue()}</span>
                            }
                            <div className="overlay-edit">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item m-0"><Link href="#" className="avtar avtar-s btn btn-primary"><i className="ti ti-plus f-18"></i></Link></li>
                                    <li className="list-inline-item m-0"><Link href="#" className="avtar avtar-s btn bg-white btn-link-danger"><i className="ti ti-cross f-18"></i></Link></li>
                  
                                </ul>
                            </div>
                        </>
                    

                    )
                },
            },
        ], []
    )
    const { data: user, isError, isLoading } = useRetrieveUserQuery();

    if (isLoading) return <p>Loading...</p>;
    if (isError || !user) return <p>Error loading user data!</p>;

    return (
        <Layout>
            <BreadcrumbItem mainTitle="Human Resources" subTitle="Candidates" />
            
            <Row>
                <Col sm={12}>
                    <Card className="border-0 table-card user-profile-list">
                        <Card.Body>
                            <TableContainer
                                columns={(columns || [])}
                                data={(userData || [])}
                                isGlobalFilter={true}
                                isBordered={false}
                                customPageSize={5}
                                tableClass="table-hover"
                                theadClass="table-light"
                                isPagination={true}
                            />
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

        </Layout>
    );
};

export default page;
