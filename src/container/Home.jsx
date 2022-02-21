import React, { useState, useRef, useEffect} from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';

import Pins from './Pins';

import { userQuery } from '../utils/data';

import { client } from '../client';
import logo from '../assets/logo.png';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {

    //hook con función del botón de menú
    const [ToggleSidebar, setToggleSidebar] = useState(false);
    //hook con user
    const [user, setUser] = useState(null);
    //Hook Ref
    const scrollRef = useRef(null);


    //Se crea el usuario. Se comprueba que no sea indefinido, de no serlo se obtiene se convierte a JSON. De no tener al usuario se le hace un clear
    const userInfo = fetchUser();


    //Ahora el user se saca de sanity. Este componente tendrá un dependecy array vacio
    useEffect(() => {
      //Sanity query. Se llama de utils
       const query = userQuery(userInfo?.googleId);

       client.fetch(query)
       .then((data) => {
           setUser(data[0]);//Se obtiene un sólo y específico user- SetUser es un stateField
       })
    }, []);


    //Hook para poner el scroll hasta el top de la página
    useEffect(() => {
        scrollRef.current.scrollTo(0,0);
    }, [])

    return (
        //se coloca flex container medium devices empty column, high of screen. Aminación a la medida que el div carga ease out
        <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
            {/* el display será hidden pero dispositivos medium serán flex, porque se tendrán dos diferentes sidebars, una para moviles y otro la web   */}
            <div className="hidden md:flex h-screen flex-initial">
                {/*Si el usuario existe, entonces envía el usuario, de lo contrario: false*/}
                <Sidebar user={user && user} />
            </div>
            {/*se */}
            <div className="flex md:hidden flex-row">
                <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
                    {/*se coloca icono y statefield para la función del menú. El setToggle se manda true indicando la posibilidad de abrirlo y cerrarlo*/}
                    <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-28" />
                    </Link>
                    {/*Ahora apunta a un bloque dinámico de código. No se sabe el usuario pero se saca del local storage*/}
                    <Link to={`user-profile/${user?._id}`}>
                        <img src={user?.image} alt="user-pic" className="w-9 h-9 rounded-full " />
                    </Link>
                </div>
                {/*Se comprueba si el sidebar está toggling. Se prepara para mostrar algo */}
                {ToggleSidebar && (
                    /*tomará 4f del espacio*/
                    <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                        <div className="absolute w-full flex justify-end items-center p-2">
                            <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
                        </div>
                        {/*Se renderiza el sidebar de nuevo. Sidebar user={} MOVIL*/}
                        <Sidebar closeToggle={setToggleSidebar} user={user && user} />
                    </div>
                )}
            </div>

            <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
                <Routes>
                    {/*  : indica que será dinámico */}
                    <Route path="/user-profile/:userId" element={<UserProfile />} />
                    {/* Se muestra usuario sólo si usuario existe */}
                    <Route path="/*" element={<Pins user={user && user} />} />
                </Routes>
            </div>
        </div>
    )
}

export default Home
