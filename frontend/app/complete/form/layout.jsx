// layout.jsx
import React from 'react';
import RequireAuth from '@/components/utils/RequireAuth';
import RequireComplete from '@/components/utils/RequireComplete';
import '@/public/assets/scss/custom.scss';
import RequireBeUser from '@/components/utils/RequireBeUser';

const Layout = ({ children }) => {
    return (
        <RequireAuth>
            <RequireComplete>
              <RequireBeUser>
                  {children}
              </RequireBeUser>
            </RequireComplete>
        </RequireAuth>
    );
};

export default Layout;
