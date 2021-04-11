const jwt=require("jsonwebtoken")
require("dotenv").config()


//chanking access token , is valid, expired or not
const verifyToken=(req,res,next)=>{
    try{

      if(req.headers["authorization"]){

        let token=req.headers["authorization"].split(" ")[1];
        if(token){
            jwt.verify(token,process.env.jwtAccessSecret,(err,decoded)=>{
                if(err) return res.json({error:err.message})
                 req.user={
                    id:decoded.id,
                    email:decoded.email,
                    username:decoded.username,
                    image:decoded.image
                 }
                 next()
            })

        }else{
            res.json({error:`No token provided`})
        }


      }else{
        res.json({error:`No autorization header`})
      }


    }catch(err){
        res.json({error:err.message})
    }

}

module.exports={
    verifyToken
}