const users=[]
const addUser=({id,username,room})=>{
    room=room.trim().toLowerCase()
    username=username.trim().toLowerCase()
    if(!username||!room){
        return{
            error:"Username and room is required"
        }
    }
    const exists=users.find(user=>{
        return user.room===room && user.username===username
    })
    if(exists){
        return {
            error:"User already in use!"
        }
    }
    const user={id,username,room}
    users.push(user)
    return {user}
}
const removeUser=id=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    }
    )
   
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}
const getUser=id=>{
    const user=users.find(user=>user.id===id)
    return user
}
const getUserInRoom=room=>{
    room=room.trim().toLowerCase()
    const room_users=users.filter(user=>user.room===room)
    return room_users
}
/* addUser({
    id:22,
    username:'Jatin ',
    room:' India'})
addUser({
        id:26,
        username:'Jeet ',
        room:' Europe'})    
addUser({
            id:22,
            username:'Jeet ',
            room:' India '})       
/* console.log(users)
console.log(removeUser(22)) */
/* console.log(users)
console.log(getUserInRoom('india'))
console.log(getUser(22)) */ 
module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}