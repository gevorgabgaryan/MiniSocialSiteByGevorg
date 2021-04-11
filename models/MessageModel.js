const {model, Schema}=require("mongoose")

let MessageSchema=new Schema({
    text:{
        type:String
    },
    from:{
        type:String,
        email:true,
        lowercase:true,
        required:true
    },
    fromUsername:{
        type:String
    },
    fromImage:{
         type:String
        
    },
    to:{
        type:String,
    }
},{
    timestamps:true
})

let MessageModel=model('Message',MessageSchema)

async function createMessage(data){
    let message=new MessageModel(data)

    return await message.save()
}

module.exports={
    MessageModel,
    createMessage
}