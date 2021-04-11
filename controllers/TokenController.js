const { ref } = require('@hapi/joi')
const jwt=require('jsonwebtoken')
const {TokenModel}=require('../models/TokenModel')
const { UserModel } = require('../models/UserModel')

require('dotenv').config()

async function getTokens(user){
 try{
    let payload={
         id:user._id,
         email:user.email,
         username:user.username,
         image:user.image
    }
  
   
    let accessToken=jwt.sign(payload,process.env.jwtAccessSecret,{expiresIn:process.env.jwtAccessSecretLT})

    //creating refresh token
    let refreshTokenObj=await TokenModel.create({userId:user._id});
    let payloadRefresh={tokenId:refreshTokenObj._id}

    let refreshToken=jwt.sign(payloadRefresh,process.env.jwtRefreshSecret,{expiresIn:process.env.jwtRefreshSecretLT})

     return { accessToken, refreshToken}

}catch(err){
     console.log(err)
     return {error:err.message}
 }

}

const createNewTokens=(req,res)=>{
     try{

          if(req.headers["authorization"]){
    
            let token=req.headers["authorization"].split(" ")[1];
            if(token){
                jwt.verify(token,process.env.jwtRefreshSecret,async (err,decoded)=>{
                    if(err) return res.json({error:err.message})
                    try{
                      let {tokenId}=decoded
                      let refreshTokenOld=await TokenModel.findOne({_id:tokenId})
                      if(!refreshTokenOld) return res.json({error:"no such refresh token"})  
                      //finding user
                       let {userId}=refreshTokenOld 
                       let user=await UserModel.findOne({_id:userId})

                       if(!user) return res.json({error:"no such user"})

                       let { accessToken, refreshToken}=await getTokens(user)

                       res.json({user,accessToken,refreshToken})



                    }catch(err){
                         console.log(err)
                         res.json({error:err.message}) 
                    }

                   
                  
                })
    
            }else{
                res.json({error:`No token provided`})
            }
    
    
          }else{
            res.json({error:`No autorization header`})
          }
    
    
        }catch(err){
            console.log(err)
            res.json({error:err.message})
        }
}

module.exports={
    getTokens,
    createNewTokens
}