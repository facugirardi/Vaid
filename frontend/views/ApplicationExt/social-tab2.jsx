
import React, { useEffect, useState } from 'react';
import { Card, Nav } from "react-bootstrap";
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const SocialTab = () => {
  const { data: user } = useRetrieveUserQuery();
  const [userType, setUserType] = useState(null);

  const checkComplete = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${user.id}/check-usertype`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch completion status');
        }

        const data = await response.json();
        setUserType(data.user_type);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  useEffect(() => {
    checkComplete();
  }, [user]);

  return (
    <React.Fragment>
      <Card>
        <Card.Body className="py-0">
          <Nav variant="tabs" className="profile-tabs" id="myTab" role="tablist">
            <Nav.Item>
              {userType === 2 ? (
                <Nav.Link eventKey="friendsRequest" id="friends-tab">
                  <i className="ph-duotone ph-user-circle-plus me-2"></i>Details
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link eventKey="friendsRequests" id="friends-tab">
                    <i className="ph-duotone ph-user-circle-plus me-2"></i>Organizations
                  </Nav.Link>
                  <Nav.Link eventKey="friendsRequest" id="friends-tab">
                    <i className="ph-duotone ph-user-circle-plus me-2"></i>User Details
                  </Nav.Link>
                </>
              )}
            </Nav.Item>
          </Nav>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default SocialTab;
