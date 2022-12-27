import React from 'react';
import logoImage from '../assets/images/logo.png';

function Footer() {
    return (
        <div className="flex px-9 py-20 bg-gradient-to-r from-black to-gray-900 shadow w-full h-[200px]">
            <div className="w-1/6 h-full">
                <img src={logoImage} />
            </div>
            <p className="text-base font-bold text-white" style={{width: 915, height: 45}}>This is Mover DB website to show movie list by user filter section.<br/>User can search movies to see with movie title and rating...</p>
        </div>
    );
}

export default Footer;