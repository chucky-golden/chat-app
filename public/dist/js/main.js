// initialize socket, make sure socket is linked in your project
const socket = io()
let chatsec = document.getElementById('chat-section')
let innerchatdiv = document.getElementById('d1')

$(document).ready(function(){
    
    // receive any message sent from server showing who joined chat
    socket.on('userWelcome', message => {

        let sentuserid = message.userid

        let chatuser = document.querySelector('#chatuser').value
        let chatuserid = document.querySelector('#chatuserid').value
        let notify = document.querySelector('#notify')

        if(chatuserid == sentuserid){
            notify.innerHTML = chatuser + ' just joined'
            setTimeout(() => {
                notify.innerHTML = ''
            }, 3000);
        }else{
            return false
        }   

    })


    // receive any message sent from server
    socket.on('message', message => {
        let aUserid = document.querySelector('#activeUserid').innerHTML

        // add received message to chat-screen display
        if(aUserid === message.receiverid || aUserid === message.activeUserid){
            outputMessage(message, aUserid)
            
            // scroll down on new message
            chatsec.scrollTop = chatsec.scrollHeight
        }
        
    })

    // output message to DOM
    outputMessage = (message, mine) => {
        let myid = message.activeUserid
        let activeUser = message.activeUser
        let msg = message.msg

        let from = mine == myid ? 'me' : activeUser
        let rowclass = mine == myid ? 'd-flex justify-content-start mb-2' : 'd-flex justify-content-end mb-4'
        let bgclass = mine == myid ? 'bg-info sent text-dark' : 'bg-primary sent'

        var d = new Date(); 
        var dt = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " "  
            + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(); 

        let div = document.createElement('div')
        div.innerHTML = `
           <div class="${rowclass}">
                <div class="${bgclass}">
                    <p><b>${from}:</b><br>${msg}</p>
                    <p class="d-flex justify-content-end">${dt}</p>
                </div>
           </div>
        `
        innerchatdiv.appendChild(div)
    }



    // loading chat screen and sending welcome message
    
    let activeUser = document.querySelector('#activeUser').innerHTML
    let activeUserid = document.querySelector('#activeUserid').innerHTML

    let data = { 'userid': activeUserid, 'user': activeUser }
            
    // send loggedin user id through socket to the server
    socket.emit('userWelcome', data)
       


    // message when submitted
    let chatform = document.querySelector('#chat-form')
    chatform.addEventListener('submit', (e) => {
        e.preventDefault();
        // get message typed and user details
        let user = document.querySelector('#chatuser').value
        let userid = document.querySelector('#chatuserid').value

        const msg = document.querySelector('#msg').value
        let activeUser = document.querySelector('#activeUser').innerHTML
        let activeUserid = document.querySelector('#activeUserid').innerHTML

        let data = {
            'receiver': user,
            'receiverid': userid,
            'activeUser': activeUser,
            'activeUserid': activeUserid,
            'msg': msg,
            'category': 'Sports'
        }
        
        // send message through socket to the server
        socket.emit('chatMessage', data)
        document.querySelector('#msg').value = ''

    })

})