

const socket=io()
const $location=document.getElementById('send-location')
const $form=document.getElementById('message-form')
const $submitButton=document.getElementById('sub_btn')
const $messages=document.getElementById('messages')
const $message_template=document.getElementById('message-template').innerHTML
const $locationLink=document.getElementById('location-message-template').innerHTML
const $sidebarTemplates=document.getElementById('sidebar-template').innerHTML
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on('message',message=>{
    const html=Mustache.render($message_template,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a'),
        username:message.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
    
    autoscroll()
})
socket.on('locationMessage',link=>{
    const html=Mustache.render($locationLink,{
        url:link.url,
        username:link.username,
        createdAt:moment(link.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
   
    autoscroll()
})
socket.on('roomData',({room,users})=>{
    const html=Mustache.render($sidebarTemplates,{
        room,
        users        
    })
    document.querySelector('#sidebar').innerHTML=html
})

$form.addEventListener('submit',(e)=>{
    e.preventDefault()
    $submitButton.setAttribute('disabled','disabled')
    socket.emit('welcome',e.target.elements[0].value,(error)=>{
        $submitButton.removeAttribute('disabled')
        e.target.elements[0].value=""
        e.target.elements[0].focus()
        if(error){
            return console.log(error)
        }
        console.log('Message Delivered')
    })
})

$location.addEventListener('click',e=>{
    if(!navigator.geolocation){
        return alert('Open this with new browser')
    }
    $location.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition(postion=>{
        socket.emit('sendLocation',{
            latitude:postion.coords.latitude,
            longitude:postion.coords.longitude
        },()=>{
            $location.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})