const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
    },
    email:{
        type: String,
        required: true,
        unique:true,

    },
    password: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    receivefollowRequest:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    sendfollowRequest:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    acceptfollowRequest:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    declinefollowRequest:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    verified:{
        type: Boolean,
        default: false,
    },
    verificationToken:String,
    joinedDate:{
        type: Date,
        default: Date.now
    },

});

const User = mongoose.model("User", UserSchema);


module.exports = User; 

//username,
    //email,
    //password,
    //image,
    //friends,
    //sendfollowRequest,
    //receivefollowRequest,
    //acceptfollowRequest,
    //declinefollowRequest,
