import RequireAuth from '@/components/utils/RequireAuth'

export default function Layout({ children }){
    return <RequireAuth>{children}</RequireAuth>
}