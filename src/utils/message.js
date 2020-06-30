const createMessage=(username,text)=>{
    return {
        text,
        username,
        createdAt:new Date().getTime()
    }
}
const generateLocation=(url,username)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}
module.exports={
    createMessage,
    generateLocation
}