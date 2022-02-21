//rafce para crear react template
import React from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import logo from '../assets/logo.png';

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize';

const categories = [
    {name: 'Animales'},
    {name: 'Wallpapers'},
    {name: 'Fotografía'},
    {name: 'Gaming'},
    {name: 'Coding'},
    {name: 'Otros'}
]

const sidebar = ({ user, closeToggle }) => {
    const handleCloseSidebar = () => {
        //Si closeToggle existe
        if(closeToggle) 
            closeToggle(false);
    }

    return (
        <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
            <div className="flex flex-col">
                <Link
                    to="/"
                    className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                    onClick={handleCloseSidebar}>
                    <img src={logo} alt="logo" className="w-full"></img>
                </Link>

                <div className="flex flex-col gap-5">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                        >
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover cateogries</h3>
                    {categories.slice(0, categories.length - 1).map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                            onClick={handleCloseSidebar}
                            //El key es para recorrer el array
                            key={category.name}
                        >
                            {category.name}
                        </NavLink>
                    ))}                    
                </div>
                {/*Footer del nav bar */}
            </div>
            {user && (
                /*Estilo del footer del navbar*/
                <Link
                    to={`user-profile/${user._id}`}
                    className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
                    /*Cuando se hace click en el sidebar se redirige al homepage */
                    onClick={handleCloseSidebar}
                >
                    <img src={user.image} className="w-10 h-10 rounded-full" alt="user profile" />
                    <p>{user.userName}</p>


                </Link>
            )}        

        </div>
    )
}

export default sidebar
