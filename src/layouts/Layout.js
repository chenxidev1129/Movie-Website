import React from 'react';
import Footer from "./Footer";

function Layout({children}) {
    return (
        <div>
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default Layout;