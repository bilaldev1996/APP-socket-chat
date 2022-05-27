const { Socket } = require('socket.io')
const { comprobarJWT } = require('../helpers')
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes()

const socketController = async( socket = new Socket(), io ) =>{

    const usuario = await comprobarJWT(socket.handshake.headers['x-token'])

    if(!usuario) {
        return socket.disconnect()
    }


    //Agregar al usuario conectado
    chatMensajes.conectarUsuario( usuario )

    
    //Emitir a todas las personas si alguien se ha conectado
    io.emit('usuarios-activos',chatMensajes.usuariosArr)

    //Enviar los 10 ultimos mensajes al usuarios nuevo que se conecto
    socket.emit('recibir-mensajes',chatMensajes.ultimos10)

    //conectarlo a una sala especial
    socket.join(usuario.id) //global , socket.id , usuario.id






    //Limipiar cuando alguien se desconecta
    socket.on('disconnect', () =>{
        chatMensajes.desconectarUsuario( usuario.id )
        io.emit('usuarios-activos',chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje', ( { mensaje, uid } ) => {

        if( uid ) {
            //Mensaje privado - a una persona con ese uid
            socket.to(uid).emit('mensaje-privado',{de : usuario.nombre,mensaje})
        }else{
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje )
            io.emit('recibir-mensajes',chatMensajes.ultimos10)
        }
        
    })

}



module.exports = {
    socketController
}