
//Referencias html

const button = document.getElementById('google_signout')
const btnIngresar = document.querySelector('.btn')
const formulario = document.querySelector('#formulario')
const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://rest-serverb.herokuapp.com/api/auth/';
const formularioRegistro = document.querySelector('#miFormulario')


//Iniciar sesion mediante formulario
formulario.addEventListener('submit', (event) => {
    event.preventDefault()

    const { password, correo } = formulario 

    const data = {
        password : password.value,
        correo : correo.value
    }


    fetch(url + 'login',{
        method : 'POST',
        body : JSON.stringify(data),
        headers: { 'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then( ({ msg , token}) => {
        if( msg ) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usuario o contraseña incorrectos!'
            })
        }

        formulario.reset()
        localStorage.setItem('token', token)
        window.location = 'chat.html'
    })
    .catch(err => {
        console.log(err);
    })
    
})


//Iniciar sesion con google signin
function handleCredentialResponse(response){
    //Google token : ID_TOKEN
    //console.log("id_token",response.credential)

    const body = {id_token : response.credential}

    fetch(url + 'google',{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    .then(({token}) => {
        //window.location = `chat.html?name=${resp.usuario.nombre}`
        //console.log(data)
        //localStorage.setItem('email',data.usuario.correo)
        localStorage.setItem('token',token);
        window.location = 'chat.html'
    })
    .catch(console.warn)
}

button.onclick = () =>{
    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()

    google.accounts.id.revoke(localStorage.getItem('email'), done=>{
        localStorage.clear()
        location.reload()
    })
}


//Registrar nuevo usuario 
formularioRegistro.addEventListener('submit', (event) =>{
    event.preventDefault()

    const { correo,nombre,password } = formularioRegistro

    const data = {
        correo: correo.value,
        nombre: nombre.value,
        password: password.value
    }


    fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        body : JSON.stringify(data),
        headers : { 'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(({usuario, errors}) => {
        if( usuario ) {
            formularioRegistro.reset()
            return Swal.fire(
                'Good job!',
                'Usuario creado correctamente!',
                'success'
            )
        }

        if( errors ) {
            return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Este correo ya se encuentra registrado!',
                footer: '<a href="index.html">Inicia sesión</a>'
            })
        }
    })

})

