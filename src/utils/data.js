//Acá están los queries del projecto
 //Sanity tiene su propio query GROQ
//Query para sacar los users
export const userQuery = (userId) => {
    //Trata de darme un documento de tipo user que tenga un id como el userId 
    const query = `*[_type == "user" && _id == '${userId}']`;

    return query;
}

export const searchQuery = (searchTerm) => {
   //Query se busca el titulo, sino se busca la categoria, sino se busca el about de cada pin. IMPORTANTE: el * te ayuda a hacer la búsqueda incluso antes de terminar de escribir
    const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']
    {
        image{
            asset -> {
                url
            }
        },
        _id,
        destination,
        postedBy -> {
            _id,
            userName,
            image
        },
        save[] {
            _key,
            postedBy -> {
                _id,
                userName,
                image
            },
        },
    }`; 

    return query;      

}

export const feedQuery = `*[_type == 'pin'] | order(_createAt desc) {
    image{
        asset->{
          url
        }
      },
          _id,
          destination,
          postedBy->{
            _id,
            userName,
            image
          },
          save[]{
            _key,
            postedBy->{
              _id,
              userName,
              image
            },
          },
}`;