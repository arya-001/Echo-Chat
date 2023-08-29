const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    messageType:{
        type: String,
        enum: ['text', 'image', 'audio', 'video', 'location'],
        required: true
    },
    message:String,
    imageUrl:String,
    audioUrl:String,
    videoUrl:String,
    location:String,
    timeStamp:{
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;