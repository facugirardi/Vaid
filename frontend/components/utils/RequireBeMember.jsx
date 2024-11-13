'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

export default function RequireBeMember({ children }) {
    const { push } = useRouter();
    const { data: user, isLoading, error } = useRetrieveUserQuery();
    const [organizationId, setOrganizationId] = useState(null);
    const [isMemberOfOrganization, setIsMemberOfOrganization] = useState(false);
    const [isOrgAccount, setIsOrgAccount] = useState(false);

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
        const checkOrganizationMembership = async () => {
            try {
                const orgAccountResponse = await fetch(`http://localhost:8000/api/user/${user.id}/check-usertype`, { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const orgAccountData = await orgAccountResponse.json();

                if (orgAccountData?.user_type === 2) {
                    console.log('Checking organization membership for organization account');
                    const response = await fetch(`http://localhost:8000/api/organization/${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();
                    console.log(data)
                    if (data?.id === parseInt(organizationId)) {
                        setIsMemberOfOrganization(true);
                    } else {
                        window.location.href = '/dashboard';
                    }
                } else {
                    const response = await fetch(`http://localhost:8000/api/organizations/membership?user_id=${user?.id}&organization_id=${organizationId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setIsMemberOfOrganization(data.is_member);
                    console.log(data)
                    if (data.is_member === false) {
                        window.location.href = '/dashboard';
                    }
                }
            } catch (error) {
                toast.error(`Failed to verify membership. Error: ${error.message}`);
            }
        };

        if (user && organizationId) {
            checkOrganizationMembership();
        }
    }, [user, organizationId]);

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading user data</div>;
    }

    return <>{children}</>;
}
