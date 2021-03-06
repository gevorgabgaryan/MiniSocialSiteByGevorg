const {model, Schema}=require("mongoose")

let UserSchema=new Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        email:true,
        lowercase:true,
        required:true
    },
    password:{
        type:String
    },
    isEmailVerifyed:{
        isVerify:{
            type:Boolean,
            default:false
        },
        code:{
            type:String
        }
    },
    image:{
        type:String,
        default:'default.png'
    },
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    education:{
        type:String,
    },
    workplace:{
        type:String,
    },
    city:{
        type:String,
    },
    friends:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }],
    friendRequests:[{
        type:Schema.Types.ObjectId,
        ref:"user"
    }],
    posts:[{
        type:Schema.Types.ObjectId,
        ref:"post"
    }],
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"comment"
    }],
    role:{
        type:String,
        default:"user"
    }
},{
    timestamps:true
})

let UserModel=model('user',UserSchema)

module.exports={
    UserModel
}