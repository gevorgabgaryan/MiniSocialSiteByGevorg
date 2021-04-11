const {Schema, model}=require('mongoose')

let TokenSchema=new Schema({
    userId:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

let TokenModel=model('token',TokenSchema)

module.exports={
    TokenModel
}