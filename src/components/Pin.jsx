import React from 'react'
import { urlFor } from '../client'

const Pin = ({ pin: {postedBy, image, _id, destination} }) => {
  return (
    <div>
        {/* Se trae la imagen según sanity*/}
        <img className='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()}/>
    </div>
  )
}

export default Pin