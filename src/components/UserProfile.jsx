import React, { useState, useEffect} from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { GoogleLogout } from 'react-google-login'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner';

//Estilo de botones
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState('Creado'); //Creado a Crear
    const [activeBtn, setActiveBtn] = useState('Creado');

    const navigate = useNavigate();

    const { userId } = useParams();

    //useEffect para fecth la data
    useEffect(() =>{
        const query = userQuery(userId)

        client.fetch(query)
        .then((data)=> {
            setUser(data[0]); //Se toma el primer usuario
        })
    }, [userId]) //Cada vez que el userId cambie

    //useEffect para fetch guardados y creados
    useEffect(() => {
        if (text === 'Created') {
          const createdPinsQuery = userCreatedPinsQuery(userId);
    
          client.fetch(createdPinsQuery).then((data) => {
            setPins(data);
          });
        } else {
          const savedPinsQuery = userSavedPinsQuery(userId);
    
          client.fetch(savedPinsQuery).then((data) => {
            setPins(data);
          });
        }
      }, [text, userId]);
      

    const logout = () => {
        localStorage.clear();

        navigate('/login');
    }

    if(!user) {
        return <Spinner message="Cargando perfil..."/>
    }


    return (
        <div className='relative pb-2 h-full justify-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center '>
                        {/**Se colocan imagenes random */}
                        <img
                            className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
                            src="https://source.unsplash.com/1600x900/?nature,photography,technology"
                            alt="banner-pic"
                        />
                        <img
                            className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                            src={user.image}
                            alt="user-pic"
                        />
                        <h1 className="font-bold text-3xl text-center mt-3">
                            {user.userName}
                        </h1>
                        <div className='absolute top-0 z-1 right-0 p-2'>
                            {userId === user._id && (
                               <GoogleLogout
                               clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                               render={(renderProps) => (
                                 <button
                                   type="button"
                                   className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                                   onClick={renderProps.onClick}
                                   disabled={renderProps.disabled}
                                 >
                                   <AiOutlineLogout color="red" fontSize={21} />
                                 </button>
                               )}
                               onLogoutSuccess={logout}
                               cookiePolicy="single_host_origin"
                             />
                           )}
                        </div>
                    </div>
                    <div className="text-center mb-7">
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('created');
                            }}
                            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Creado
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('saved');
                            }}
                            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Guardado
                        </button>
                    </div>
                    {/**Sólo si hay pins */}
                    {pins?.length ? (
                        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                            <MasonryLayout pins={pins} />
                        </div>
                    ): (
                        <div>
                            No se encontraron pins
                        </div>
                    )}
                    
                </div>
            </div>
            
        </div>
    )
}

export default UserProfile
