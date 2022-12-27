import React from 'react';
import logoImage from '../assets/images/logo.png';
import searchIcon from '../assets/images/search_icon.png';

function Header() {
    return (
        <div className="flex px-9 py-8 bg-gradient-to-r from-black to-gray-900 shadow w-full h-[96px]">
            <div className="w-1/6 h-full">
                <img src={logoImage} />
            </div>
            <div className="flex w-full justify-center">
                <div className="relative w-96 h-10">
                    <input className="flex space-x-24 items-center justify-end flex-1 h-full w-full px-5 pt-1.5 pb-2 bg-gray-800 rounded-2xl text-white" placeholder="Search Movies & People" />
                    <img className="absolute top-2 right-4 w-6 h-5 rounded-lg" src={searchIcon}/>
                </div>
            </div>
        </div>
    );
}

export default Header;