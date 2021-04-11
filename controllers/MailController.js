const nodemailer=require('nodemailer');

const config={
    service:"gmail",
    auth:{
        user:process.env.nodemailerUser,
        pass:process.env.nodemailerPassword
    },
    tls:{
        rejectUnauthorized:false
    },
    debug:true
}

const transporter=nodemailer.createTransport(config)

transporter.verify((err,success)=>{
    if(err) console.log(err.message)
    else console.log("connected to SMTP")
})

class MailController{
 async   sendMail(to,subject,text=null,html=null){
   try{ 
    let options={
            to,
            subject,
            text,
            html
        }
       return await transporter.sendMail(options)
    }catch(err){
        return err.message
    }
  }
}

module.exports=new MailController()