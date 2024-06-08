import RequireAuth from '@/components/utils/RequireAuth'
import RequireComplete from '@/components/utils/RequireComplete'

export default function Layout({ children }){
    return( 
    
    <RequireAuth>
        <RequireComplete>
            {children}
        </RequireComplete>        
    </RequireAuth>
)}