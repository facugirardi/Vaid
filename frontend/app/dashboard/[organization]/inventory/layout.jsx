
// layout.jsx
import React from 'react';
import RequireAuth from '@/components/utils/RequireAuth';
import RequireComplete from '@/components/utils/RequireComplete';
import '@/public/assets/scss/custom.scss';
import RequireForm from '@/components/utils/RequireForm';
import RequireBeMember from '@/components/utils/RequireBeMember';

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
