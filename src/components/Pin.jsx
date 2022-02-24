import React, { useState } from 'react'
import { client, urlFor } from '../client'
import { Link, useNavigate } from 'react-router-dom';
//V4 Identifier Id para cada post
import { v4 as uuidv4 } from 'uuid';
//Iconos
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser';



const Pin = ({ pin: {postedBy, image, _id, destination, save} }) => {

 const [postHovered, setPostHovered] = useState(false);

 

 const navigate = useNavigate();

 const userInfo = fetchUser();

 //Se necesita saber si el user ya salvó o no un pin. Esto se hace haciendo una comprobación con el id de google del usuario 
 //Detalle de optimización: como destruimos el save en la declaración de pin, podemos referir al save? directo
 //Encerrar en paréntesis lo vuelve numero, ! booleano
 const alredySaved = !!(save?.filter((item) => item?.postedBy?._id === userInfo?.googleId))?.length;
 
/*Explicación detallada de lo que ocurre arriba:
User 1, User que salvaron imagen [2,3,1] -> [1].length -> 1 -> !1 -> false -> !false -> true
4, [2,3,1] -> [].length -> 0 -> !0 -> true -> !true -> false
*/
    //Función para guardar las imagenes 
    const savePin = (id) => {
        if(!alredySaved)
        {   
            
            client
            .patch(id)
            .setIfMissing({ save: [] }) // Docu Sanity: Sets the given attributes to the document if they are not currently set. Does NOT merge objects. The operation is added to the current patch, ready to be commited by commit()
            .insert('after', 'save[-1]', [{
                _key: uuidv4(),
                userId: userInfo?.googleId,
                postedBy: {
                  _type: 'postedBy',
                  _ref: userInfo?.googleId,
                },
              }])
              .commit() //Docu sanity: Commit the patch, returning a promise that resolves to the first patched document
              .then(() => {
                window.location.reload(); //Se recarga la página
           
              });
        }

    }

    //Función para eliminar las imagenes guardada
    const deletePin = (id) => {
        client
        .delete(id)
        .then(() =>{
            window.location.reload();
        })
    }

  return (
      <div className='m-2'>
          <div
              onMouseEnter={() => setPostHovered(true)}
              onMouseLeave={() => setPostHovered(false)}
              onClick={() => navigate(`/pin-detail/${_id}`)}
              className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
          >
              {/* Se trae la imagen según sanity*/}
              <img className='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()} />
                {/*se comprueba si al post se le hace hover */ }
                {postHovered && (
                    <div
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2'
                        //En este caso se debe usar además un style por problemas con el tailwind
                        style = {{ height: '100%'}}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    //Esto es para descargar esa imagen en específico
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    //Recibe evento. Se coloca stop para que sólo haga la descargar y no se trigueree lo demás
                                    onClick={(e)=> e.stopPropagation()}
                                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                >
                                    <MdDownloadForOffline/>
                                </a>
                            </div>
                            {/*Se comprueba si el usuario ya salvó ese post. Este valor tiene truco, se puede sacar del fetch del usuario que se hizo en el home comoponent. En ese caso, se puede crear un utils del fecth al usuario.  */}
                            {alredySaved ? (
                                <button type="button" className='bg-red-500 opacity-75 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none'>
                                 {/*Se muestra cuántas personas han guardado la imagen */}  
                                 {save?.length} Guardado
                                </button>                                    
                            ): (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        savePin(_id);
                                    }}
                                type="button" className='bg-red-500 opacity-75 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none'>
                                    Guardar
                                </button>
                            )}
                        </div>

                        {/**Botón de link de la imagen */}
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a 
                                href={destination}
                                target= "_blank"
                                rel="noreferrer"
                                className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md'
                                >
                                <BsFillArrowUpRightCircleFill/>
                                    { destination.length > 20 ? destination.slice(8, 20): destination.slice(8)}
                                </a>
                            )}

                            {/** Botón para borrar */}
                            {postedBy?._id === userInfo?.googleId && (
                                <button
                                    type= 'button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className='bg-white p-2 opacity-75 hover:opacity-100 text-dark font-bold  text-base rounded-3xl hover:shadow-md outlined-none'
                                 >
                                     <AiTwotoneDelete/>
                                </button>
                            )} 
                        </div>                       
                    </div>
                )}
          </div>
          {/**Usuario que creó el post */}
          <Link to={`user-profile/${userInfo?._id}`} className="flex gap-2 mt-2 items-center">
            <img 
                className="w-8 h-8 rounded-full object-cover"
                src={postedBy?.image}
                alt="user-profile"
            />
            <p className='font-semibold capitalize'>{postedBy?.userName}</p>
          </Link>
      </div>
  )
}
 
export default Pin