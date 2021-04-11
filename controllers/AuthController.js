const {UserModel}=require('../models/UserModel');
const {TokenModel}=require('../models/TokenModel')
const bcrypt=require('bcryptjs')
const random=require('random')
const { sendMail } = require('./MailController')
const { getTokens } = require('./TokenController')
const jwt=require('jsonwebtoken')
require('dotenv').config()
class AuthController{
  /**
   * saving new user in DB
   * @param {*} req geting req.body whit user info
   * @param {*} res sending json user db id username email and if error sending err
   */
   async registerNewUser(req,res){
     try{  
      let hashedpassword=bcrypt.hashSync(req.body.password) 
      let newUser=new UserModel({
          username:req.body.username,
          email:req.body.email,
          password:hashedpassword,

      })
      //createin random code
      let randCode=random.int(1e5,1e6-1)
      newUser.isEmailVerifyed.code=randCode;
      let savedUser=await newUser.save()
      let result=await sendMail(savedUser.email,"Verify yor email",`Your code is ${randCode}`)
      //if mail sent resul has response emailSnet is true
      if(result && result.response)
        res.json({id:savedUser._id, username:savedUser.username,email:savedUser.email,emailSent:true})
      else
       res.json({id:savedUser._id, username:savedUser.username,email:savedUser.email,emailSent:false})  
     }catch(err){
             res.json({error:err.message})
     }
    }
    /**
   * chacking code from email and Db
   * @param {*} req geting req.body whit user id and eaml sent code
   * @param {*} res sending json done
   */
    async verifyemail(req,res){
      try{
       let user=await UserModel.findOne({_id:req.body.id})
       if(!user) return res.json({error:"No such user"})
       if(`${req.body.code}`===`${user.isEmailVerifyed.code}`){
            user.isEmailVerifyed.isVerify=true
            await user.save()
            res.json({result:"done",id:user._id})
       }else{
         return res.json({error:`Code dont much`})
       }

      }catch(err){
        console.log(err)
        res.json({error:err.message})
      }
    }

    async loginUser(req,res){
      try{
        //finding user
        let user=await UserModel.findOne({email:req.body.email});
        if(!user) return res.json({error:`Invalid email or password`})
       //checking user
       let passwordOk=bcrypt.compareSync(req.body.password,user.password)
       if(!passwordOk) return res.json({error:`Invalid email or password`})

       let {error}=getTokens(user)
        if(error) return res.json({error})

        let { accessToken, refreshToken}=await getTokens(user)

        res.json({user,accessToken,refreshToken})

      }catch(err){
        res.json({error:err.message})
      }  
    }
    //log out
    logOut(req,res){
      try{

        if(req.headers["authorization"]){
  
          let token=req.headers["authorization"].split(" ")[1];
          if(token){
              jwt.verify(token,process.env.jwtRefreshSecret,async (err,decoded)=>{
                  if(err) return res.json({error:err.message})
                  try{
                    let {tokenId}=decoded
                    let result=await TokenModel.deleteOne({_id:tokenId});
                    console.log(result)
                    res.json({deleteCount:result.deletedCount})


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

        //delete account
        deleteAccount(req,res){
          try{
    
            if(req.headers["authorization"]){
      
              let token=req.headers["authorization"].split(" ")[1];
              if(token){
                  jwt.verify(token,process.env.jwtRefreshSecret,async (err,decoded)=>{
                      if(err) return res.json({error:err.message})
                      try{
                        let {tokenId}=decoded;

                        let tokenObj=await TokenModel.findOne({_id:tokenId});
                        let {userId}=tokenObj
                        await TokenModel.deleteMany({userId:userId});
                        await UserModel.deleteOne({_id:userId})
                      
                        res.json({result:"done"})
    
    
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
}

module.exports=new AuthController()