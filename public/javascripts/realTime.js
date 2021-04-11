const URL="http://localhost:3000/";

const socket=io(URL,{
   autoConnect:false
})

function newUserConnected(){
   try{ 
    let token=localStorage.getItem("accessToken");
    socket.auth={
       token
    };
    socket.connect()
 }catch(err){
     console.log(err)
 } 

}
//connection error
socket.on("connect_error",(err)=>{
    if(err.message=="jwt expired"){
        refreshTokensFunction(newUserConnected)
    }else{
        // alert(err.message)
        // loginFunction()
    }
})

//online users
socket.on("online users",data=>{
    data.forEach(user=>{
         oneOnlineUser(JSON.parse(user))
    })
   
})

//user connected
socket.on("user connected",data=>{
    oneOnlineUser(data)
})
//on disconect
socket.on("user disconnect",(userId)=>{
      nowOnlinesContainer.querySelector(`#o${userId}`).remove()
})
// socket.on("disconnect",()=>{
//     socket.disconnect()
//   })



//private message listener

socket.on("private message",data=>{

    dispalyingOneMessage(data)
   
})


//friend request

socket.on("friend request",data=>{
 
    alert("friend request")
    oneFriendRequest(data)
})

//confirm request

socket.on("confirm request",data=>{
   
    alert(`${data.username} accept friend request`)
})
