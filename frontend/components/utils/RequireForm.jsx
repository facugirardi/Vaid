'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

export default function RequireForm({ children }) {
    const { push } = useRouter();
    const { data: user, isLoading, error } = useRetrieveUserQuery();
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/person/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 404) {
                    push('/not-found');
                    return;
                }
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUserDetails(data);
            } catch (error) {
                toast.error(`Failed to retrieve user. Error: ${error.message}`);
            }
        };

        if (user) {
            fetchUserDetails();
        }
    }, [user, push]);

    useEffect(() => {
        if (!isLoading && userDetails && userDetails.user.is_form === false) {
            push('/complete/form');
        }
    }, [isLoading, userDetails, push]);

    if (isLoading || !user) {
        return <div>Loading...</div>; // Show loading spinner or message
    }

    if (error) {
        return <div>Error loading user data</div>; // Show error message
    }

    if (userDetails && userDetails.user.is_form === false) {
        return null; // Prevent rendering children if form is not completed
    }

    return <>{children}</>;
}
