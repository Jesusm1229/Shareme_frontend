export const fetchUser = () => {
    //Se crea el usuario. Se comprueba que no sea indefinido, de no serlo se obtiene se convierte a JSON. De no tener al usuario se le hace un clear
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
    
    return userInfo
}