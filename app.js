const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose=require('mongoose');
const jwt=require("jsonwebtoken");

const indexRouter = require('./routes/IndexRouter');
const authRouter = require('./routes/AuthRouter');
require('dotenv').config();
//mongoDb connect
(async ()=>{
   try{
     await mongoose.connect(process.env.mongoDbLink,{
       useNewUrlParser:true,
       useUnifiedTopology:true
     })
     console.log('mongoDbConnected')
   }catch(err){
     console.log(err)
   }

})();



const app = express();

const http = require('http');
const { createMessage } = require('./models/MessageModel');

/**
 * Create HTTP server.
 */

 const server = http.createServer(app);

 //start socket.io
 const io=require("./socket").init(server);

 //socket middlware
 io.use((socket,next)=>{
   try{ 
    if(socket.handshake.auth && socket.handshake.auth.token){
     jwt.verify(socket.handshake.auth.token,process.env.jwtAccessSecret,(err,decoded)=>{
       if(err) return next(err);
       socket.user={
         id:decoded.id,
         username:decoded.username,
         image:decoded.image
         }
        next() 
     })


    }else{
      next(newError("no token"))
    }
 
   }catch(err){
     next(err)
   }
 })

 io.on("connection",socket=>{
   try{
      const user=socket.user;
      const id=socket.user.id;
      //creatin room with name every user vor sending privat info
      socket.join(id)
      
      let onlineUsers=new Set();
      
      for(let [,socket] of  io.of("/").sockets){
        if(id==socket.user.id) continue;
        onlineUsers.add(JSON.stringify(socket.user))
      }

      io.to(socket.id).emit("online users",[...onlineUsers])
      socket.broadcast.emit("user connected", user)


      socket.on("disconnect",()=>{
        socket.broadcast.emit("user disconnect", socket.user.id)
      })

     socket.on("private message",async data=>{  
         let message=await createMessage(data);
 
        io.to(data.to).to(data.from).emit("private message",message)
     })

   }catch(err){
     console.log(err);
     io.to(socket.id).emit("error",err.message)
   }   
 })

 //end socket.io

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports ={
  app,
  server
}
