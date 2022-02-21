//Masonry es un grid que no tiene el mismo height
import React from 'react'
//Se usa el package de masonry
import Masonry from 'react-masonry-css';
import Pin from './Pin';

//Se debe crear el breakpoint 
const breakpointObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1200: 3,
    1000: 2,
    500: 1, //Mobile
}

const MasonryLayout = ({ pins }) => {
  return (
      //Se llama el masonty
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
         {pins?.map((pin) => <Pin key={pin._id} pin={pin} className="w-max" />)}
    </Masonry>
  )
}

export default MasonryLayout