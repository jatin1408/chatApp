const express=require('express')
const app=express()
const path=require('path')
const port=process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')
const http=require('http')
const server=http.createServer(app)
const socketIO=require('socket.io')
app.use(express.static(publicDirectoryPath))
const io=socketIO(server)
const Filter=require('bad-words')
const {getUser,getUserInRoom,addUser,removeUser}=require("./utils/user")
const {createMessage,generateLocation}=require('./utils/message')

io.on('connection',(socket)=>{
    socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',createMessage('Admin','Welcome'))
  
    socket.broadcast.to(user.room).emit('message',createMessage(`${user.username} has joined!`))
    io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUserInRoom(user.room)       
    })
    })
    
    socket.on('welcome',(name,callback)=>{
        const user=getUser(socket.id)
        if(user){
            const filter=new Filter()
            if(filter.isProfane(name)){
                return callback('Don\'t use bad words')
            }
            io.to(user.room).emit('message',createMessage(user.username,name))
            callback()
        }
        else{
            return callback('No user found')
        }
        
    })
    
    socket.on('sendLocation',(pos,callback)=>{
        const user=getUser(socket.id)
        if(user){

        
        io.to(user.room).emit('locationMessage',generateLocation(`https://google.com/maps?q=${pos.latitude},${pos.longitude}`,user.username))
        callback()
        }
        else{
            callback("No user found")
        }
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',createMessage('Admin',`${user.username} has left :)`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)       
            })
        }
    })
})


server.listen(port,()=>{
    console.log('Server started')
})