
const {MessageModel}=require('../models/MessageModel')
const {UserModel}=require('../models/UserModel')
const fs=require("fs");
const path=require("path");
class IndexController{
    /**
     * rendring main page
     * @param {*} req reuest main page
     * @param {*} res rendring index.ejs
     */
    index(req,res){
       res.render('index.ejs')
    }

    async homePageInfo(req,res){
        let user=await UserModel.findOne({_id:req.user.id}).populate('friendRequests',"username image").lean().exec();
     
        let nonFriendUsers=await UserModel.find({_id:{$nin:[req.user.id,...user.friends, ...user.friendRequests]}}).select("username image")
        user.id=req.user.id
        res.json({userInfo:user,nonFriendUsers})
    }

    //get one to one messages
    getOneToOnemessages(req,res){
    
        let to=req.body.to;
        let from=req.body.from;
        MessageModel.find({
            $or:[
                {to:from,from:to},
                {to:to,from:from}
            ]
        }).sort({createdAt:1}).exec((err,messages)=>{
            if(err) return res.json({error:err.message})
            res.json({messages})
        })
    }

    //profile view
   async profileView(req,res){
        let id=req.params.id
        let profileInfo=await UserModel.findOne({_id:id}).select("image username").exec();
        res.render("profile",{info:profileInfo})

    }

    //change photo

   async changePhoto(req,res){
        try {
            if(req.file){
                let user=await UserModel.findOne({_id:req.user.id}).select("image").exec()
                let oldImageName=user.image
                user.image=req.file.filename
                let savedUser=await user.save()
                //removing old image 
                if(oldImageName!="default.png"){
                    fs.unlinkSync(path.join(__dirname,"..","/public/images",oldImageName))
                }              
                
                res.json({imageName:savedUser.image})
            }else{
                res.json({fileError:"no attached file or no image attached"})
            }
            
        } catch (err) {
            res.json({error:err.message})
            
        }
    }
 //add friend request
 async friendRequest(req,res){
    try {
       
        let friendUser=await UserModel.findOne({_id:req.body.id}).select("friendRequests");
        if(!friendUser.friendRequests.includes(req.user.id)){
            friendUser.friendRequests.push(req.user.id);
            await friendUser.save();
            res.json({result:"done"});
            //real time notifying about freind request
            let io=require("../socket").get();
            if(io){
             let fromUser={
                _id:req.user.id,
                username:req.user.username,
                image:req.user.image,
                }

             io.to(req.body.id).emit("friend request",fromUser)
                
            }
           

            return
        }

        res.json({error:"Allready request sent"});
        
    } catch (err) {
        res.json({error:err.message})
    }
}
   
    
     //confirm friend request
     async confirmRequest(req,res){
        try {
       
            let friendUser=await UserModel.findOne({_id:req.body.id}).select("friends");
            if(!friendUser.friends.includes(req.user.id)){
                //adding  other user friends field
                friendUser.friends.push(req.user.id);
                await friendUser.save();
                 //adding  my friends field
                let meUser=await UserModel.findOne({_id:req.user.id}).select("friends friendRequests");
                   
                    meUser.friends.push(req.body.id);
                    meUser.friendRequests=meUser.friendRequests.filter(id=>{
                       
                    return `${id}`!=`${req.body.id}`   
                    })
                   
                    await meUser.save();
                
                res.json({result:"done"});
                //real time notifying about freind request
                let io=require("../socket").get();
                if(io){
                 let fromUser={
                        _id:req.user.id,
                        username:req.user.username,
                        image:req.user.image,
                    }

                 io.to(req.body.id).emit("confirm request",fromUser)
                    
                }
               

                return
            }

            res.json({error:"Allready friends"});
            
        } catch (err) {
      
            res.json({error:err.message})
        }
    }

    //profiel info
    async profileInfo(req,res){
        let user= await UserModel.findOne({_id:req.user.id}).select("friends").populate("friends","username image")
        res.json({user})
    }

    //delete friend
 
     async deleteFriend(req,res){
        try {       
            let friendUser=await UserModel.findOne({_id:req.body.id}).select("friends");
            if(friendUser.friends.includes(req.user.id)){
                //adding  other user friends field
                friendUser.friends=friendUser.friends.filter(id=>id!=req.user.id)
                await friendUser.save();
                 //adding  my friends field
                let meUser=await UserModel.findOne({_id:req.user.id}).select("friends");
                   
                meUser.friends=meUser.friends.filter(id=>id!=req.body.id)
                
                await meUser.save();    
                
                res.json({result:"done"});
       
                return
            }

            res.json({error:"Allready friends"});
            
        } catch (err) {
      
            res.json({error:err.message})
        }
    }
}

module.exports=new IndexController()