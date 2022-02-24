import React, { useState, useEffect } from 'react'

import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

const Search = ({ searchTerm }) => {

  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

//useEffect para obtener los pins para un query específico
  useEffect(()=>{
    if(searchTerm){
      setLoading(true);

      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query)
        .then((data)=>{
          setPins(data);
          setLoading(false);	
        })

    } else{
      client.fetch(feedQuery)
        .then((data)=>{
          setPins(data);
          setLoading(false);	
        })
    }

  }, [searchTerm]) // cambiará cada vez que el el término de búsqueda cambie

  

  return (
    <div>
      { loading && <Spinner message= "Buscando pins"/> }
      {/**Si hay pins se cargan */}
      {pins?.length !== 0 && <MasonryLayout pins={pins}/> }
      {/**Si no hay pins se informa */}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl">
          No se encontraron pins
        </div>
      )}
    </div>    
  )
}

export default Search