// layout.jsx
import React from 'react';
import RequireAuth from '@/components/utils/RequireAuth';
import RequireComplete from '@/components/utils/RequireComplete';
import '@/public/assets/scss/custom.scss';
import RequireForm from '@/components/utils/RequireForm';

const Layout = ({ children }) => {
    return (
        <RequireAuth>
            <RequireComplete>
                {children}
            </RequireComplete>
        </RequireAuth>
    );
};

export default Layout;
