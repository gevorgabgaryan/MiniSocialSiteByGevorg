const {UserModel}=require('../models/UserModel');
/**
 * Chacking email is taken or not
 * @param {*} req req.body
 * @param {*} res if error sending res.json err
 * @param {*} next nothing
 * @returns 
 */
const checkEmailUnique=async (req,res,next)=>{
   try{ 
    let user=await UserModel.findOne({email:req.body.email}).select('-_id email').lean().exec();

    if(user) return res.json({error:`${user.email} is taken`})
    next()
   }catch(err){
         res.json({error:err.message})
   } 

}

module.exports={
    checkEmailUnique
}