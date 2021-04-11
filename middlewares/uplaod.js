const multer=require("multer");
const path=require("path");
const sharp=require("sharp");
const fs=require("fs");

let Storage=multer.diskStorage({
    destination:path.join(__dirname,"..","/public/images/uploads"),
    filename:(req,file,cb)=>{
       cb(null,Date.now()+file.originalname)
    }
})

const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

let upload=multer({
    storage:Storage,
    limits:4*1024*1024,
    fileFilter:multerFilter
}).single("imageFile")

const imageResizer=async (req,res,next)=>{
    try {
        if(req.file){
            let {path,filename}=req.file
            await sharp(path).
            resize(250,250,{
                fit:"cover",
                position:"center"
            }).jpeg({quality:100})
            .toFile(__dirname+"/../public/images/"+filename)
            .then(()=>{
                fs.unlinkSync(path)
                next()
            }).catch(err=>{
                next(err)
            })

        }else{
            next()
        }
        
    } catch (err) {
        next(err)
    }
}

module.exports={
    upload,
    imageResizer
}