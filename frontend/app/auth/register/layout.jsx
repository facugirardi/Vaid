import NonRequireAuth from '@/components/utils/NonRequireAuth'

export default function Layout({ children }){
    return <NonRequireAuth>{children}</NonRequireAuth>
}