
import Image from "next/image";
import React from "react";
import { Card, Col, Row, Tab } from "react-bootstrap";
import '@/app/dashboard/profile.css'
// img
import avatar1 from "@/public/assets/images/user/avatar-1.jpg";

const Friends = () => {

    const friendsImg = [
        { id: 1, img: avatar1 },
        { id: 2, img: avatar1 },
        { id: 3, img: avatar1 },
    ]
    return (
        <React.Fragment>
            <Tab.Pane eventKey="friendsRequest">
                <Card>
                    <Card.Body>
                        <Row>
                            {
                                (friendsImg || [])?.map((item, index) => (
                                    <Col xl={6} xxl={4} key={index}>
                                        <Card className="border shadow-none">
                                            <Card.Body>
                                                <div className="text-center">
                                                    <div className="chat-avtar d-sm-inline-flex">
                                                        <Image className="rounded-circle img-thumbnail img-fluid wid-80" src={item.img} alt="User image" />
                                                    </div>
                                                    <div className="my-3">
                                                        <h5 className="mb-0">Organization</h5>
                                                    </div>
                                                </div>
                                                <Row className="g-2">
                                                    <Col xs={6}><div className="d-grid"><button className="btn btn-primary buttonorg_perf">Enter</button></div></Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Row>
                    </Card.Body>
                </Card>
            </Tab.Pane>
        </React.Fragment>
    );

}

export default Friends;
