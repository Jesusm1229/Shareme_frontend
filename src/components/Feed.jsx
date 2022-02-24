import { selectOptions } from '@testing-library/user-event/dist/select-options';
import React, {useState, useEffect} from 'react';
//useParams es para saber los parametros que se están pasando, como las categorías que se están pasando
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {

 const [loading, setloading] = useState(false);
 const [pins, setpins] = useState(null);

 const { categoryId } = useParams(); //hook


 //Cómo fecth los post. Fecth todas las categorías o una específica. Se debe usar las funcionalidades de Sanity

 //useEffect que va a llamar al iniciar la aplicación y cada vez que la categoría componente cambie. Para saber si la categoría cambia se puede revisar si cambia el URL
 useEffect(() => {
    setloading(true);

    if(categoryId){// Acá se carga una categoría específica
        const query = searchQuery(categoryId);

        client.fetch(query)
        .then((data) =>{
            setpins(data);
            setloading(false);
        } )
    }
    else { // Acá se cargan todas las categorías
        client.fetch(feedQuery)
        .then((data) => {
            setpins(data);
            setloading(false);
        });        
    }
 }, [categoryId])

 if(loading) return <Spinner message={"Estamos añadiendo ${ideaName}  a tu Feed"}/>

 if(!pins?.length) return <h2>No hay pins disponibles</h2>

  return (
    <div>
        {/* Se carga los pins en el layout */}
        {pins && <MasonryLayout pins = {pins} /> }
    </div>
  )
}

export default Feed