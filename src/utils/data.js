//Acá están los queries del projecto
//Query para sacar los users
export const userQuery = (userId) => {
    //Trata de darme un documento de tipo user que tenga un id como el userId 
    const query = `*[_type == "user" && _id == '${userId}']`;

    return query;
}