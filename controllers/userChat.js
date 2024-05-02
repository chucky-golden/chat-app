const Chats = require('../models/chatModel');
const User = require('../models/userModel');

// load chat room
const chatLoad = async (req, res) => {
    const receiverid = req.params.id

    const user = await User.findById(receiverid)

    const loadchats = await Chats.find({
        $or: [
          { sender_id: req.session.user._id, receiver_id: receiverid },
          { receiver_id: req.session.user._id, sender_id: receiverid }
        ]
      });
      console.log(loadchats);

    try{
        res.render('chatroom', { user:req.session.user, friend: user, chats:loadchats })
    }catch(err){
        console.log(err.message);
    }
}


// save chat to database
const saveChat = async (data) => {
    try{
        const senderid = data.activeUserid
        const receiverid = data.receiverid
        const msg = data.msg

        const chat = await new Chats({
            sender_id: senderid,
            receiver_id: receiverid,
            message: msg
        }).save()

        if(chat !== null){
            return true
        }else{
            return false
        }
       
    }
    catch(err){
        console.log(err.message); 
    }
}


module.exports = {
    chatLoad,
    saveChat
}