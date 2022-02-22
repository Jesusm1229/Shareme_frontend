import React, { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { client } from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data'


//Categories [{name: 'sports', image: ''}]


const CreatePin = ({ user }) => {
  const [title, settitle] = useState('');
  const [about, setabout] = useState('');
  const [destination, setdestination] = useState('');
  const [loading, setloading] = useState(false);
  const [field, setfield] = useState(null);
  const [category, setcategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
      setWrongImageType(false);
      setloading(true);  
      client.assets
      .upload('image', e.target.files[0], { contentType: type, filename: name }) //Como el objeto es destruido entonces debe usarse el evento
      .then((document) => {
        setImageAsset(document);
      setloading(false);
      })
      .catch((error) => {
        console.log('Upload failed:', error.message);
      });

      }
      else {
        setWrongImageType(true);
      }

  }

  //Función para salvar pin. SANITY 
  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };
      client.create(doc).then(() => {
        navigate('/');
      });
    } else {
      setfield(true);

      setTimeout(
        () => {
          setfield(false);
        },
        2000,
      );
    }
  
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {field && (
        //Mensaje de error si fields no son completados
        <p className='text-red 500 mb-5 text-xl transition-all'>Por favor, completa todos los campos</p>
      )}
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
           {loading && <Spinner />} {/**Si la imagen no carga */}
            {wrongImageType && <p>Tipo de imagen errada</p>} {/**Si el tipo de imagen en errada */}
            {/**Si la imagen no carga */}
            {!imageAsset ? (
              //File input upload 
              <label>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-col justify-center items-center">
                  <p className="font-bold text-2xl">
                    <AiOutlineCloudUpload />
                  </p>
                  <p className="text-lg">Click to upload</p>
                </div>
                  <p className='mt-32 text-gray-400'>
                    JPG, JPEG, SVG, PNG, GIF o TIFF menos de 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>

            ) : (
              <div className='relative h-full'>
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type='button'
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)} //Callback function
                >
                  <MdDelete/>
                </button>
              </div>
            )}
          </div>
        </div>
        {/**Form */}
        {/**USER */}
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          <input
            type="text"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            placeholder="Incluye un título acá"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && ( //Mostrar usuario que crea el post
            <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          {/**ABOUT */}
          <input
            type="text"
            value={about}
            onChange={(e) => setabout(e.target.value)}
            placeholder="Describeme tu Pin"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          {/**DESTINATION */}
          <input
            type="url"
            vlaue={destination}
            onChange={(e) => setdestination(e.target.value)}
            placeholder="Añade el link destino"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />

          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text:lg sm:text-xl">Categoría del Pin</p>
              <select
                onChange={(e) => {
                  setcategory(e.target.value);
                }}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">Selecciona categoría</option>
                {categories.map((item) => (
                  <option className="text-base border-0 outline-none capitalize bg-white text-black " value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Guardar Pin
              </button>
            </div>
          </div>


        </div>

      </div>
    </div>

  )
}

export default CreatePin