'use client'

import { useAppSelector } from "@/redux/hooks"
import { useRouter } from 'next/navigation';

export default function RequireAuth({ children }){
    const { push } = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth)

    if (!isAuthenticated){
        return push('/auth/login')
    }

    return <>{children}</>
}
