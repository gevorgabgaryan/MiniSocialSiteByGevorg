const Joi=require('@hapi/joi')
/**validate user sent info  */
const validateRegisterInfo=(req,res,next)=>{
   try{ 
    let Schema=Joi.object({
        username:Joi.string().min(3).max(100),
        email:Joi.string().min(3).max(100).email().required(),
        password:Joi.string().min(3).max(100).required()
    })
    let {error}=Schema.validate(req.body)
    if(error) return res.json({error:error.details[0].message})
    next()
   }catch(err){
     return res.json({error:err.message})
   }
}

/**validate user sent info  */
const validateLoginInfo=(req,res,next)=>{
  try{ 
   let Schema=Joi.object({
       email:Joi.string().min(3).max(100).email().required(),
       password:Joi.string().min(3).max(100).required()
   })
   let {error}=Schema.validate(req.body)
   if(error) return res.json({error:error.details[0].message})
   next()
  }catch(err){
    return res.json({error:err.message})
  }
}

module.exports={
    validateRegisterInfo,
    validateLoginInfo
}