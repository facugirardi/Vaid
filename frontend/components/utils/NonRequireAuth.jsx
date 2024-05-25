'use client'

import { useAppSelector } from "@/redux/hooks"
import { useRouter } from 'next/navigation';

export default function NonRequireAuth({ children }){
    const { push } = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth)

    if (isAuthenticated){
        return push('/')
    }

    return <>{children}</>
}