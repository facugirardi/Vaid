
import React from "react";
import { Card, Nav } from "react-bootstrap";

const SocialTab = () => {
    return (
        <React.Fragment>
            <Card>
                <Card.Body className="py-0">
                    <Nav variant="tabs" className="profile-tabs" id="myTab" role="tablist">

                        <Nav.Item>
                            <Nav.Link eventKey="friendsRequest" id="friends-tab">
                                <i className="ph-duotone ph-user-circle-plus me-2"></i>User Details
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default SocialTab;
