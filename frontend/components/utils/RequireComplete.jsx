'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

export default function RequireComplete({ children }) {
    const { push } = useRouter();
    const { data: user } = useRetrieveUserQuery();
    const [isCompleted, setIsCompleted] = useState(null);

    useEffect(() => {
        let isMounted = true; 
        const checkComplete = async () => {
            if (user?.id && isMounted) {
                try {
                    const response = await fetch(`http://localhost:8000/api/user/${user.id}/check-complete`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch completion status');
                    }
                    const data = await response.json();
                    if (isMounted) {
                        setIsCompleted(data.is_completed);
                    }
                } catch (error) {
                    console.error('An error occurred:', error);
                }
            }
        };

        checkComplete();

        return () => {
            isMounted = false; 
        };
    }, [user?.id]); 

    if (isCompleted === false) {
        push('/');
        return null;
    }
    return isCompleted ? <>{children}</> : null;
}
