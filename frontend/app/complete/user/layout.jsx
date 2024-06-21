import RequireAuth from '@/components/utils/RequireAuth'
import NonRequireComplete from '@/components/utils/NonRequireComplete'

export default function Layout({ children }){
    return( 
    
    <RequireAuth>
        <NonRequireComplete>
            {children}
        </NonRequireComplete>        
    </RequireAuth>
)}
