import React from 'react';
import RequireAuth from '@/components/utils/RequireAuth';
import RequireComplete from '@/components/utils/RequireComplete';
import RequireBeMember from '@/components/utils/RequireBeMember';
import '@/public/assets/scss/custom.scss';

const Layout = ({ children }) => {
    return (
        <RequireAuth>
            <RequireComplete>
                <RequireBeMember>
                    {children}
                </RequireBeMember>
            </RequireComplete>
        </RequireAuth>
    );
};

export default Layout;
