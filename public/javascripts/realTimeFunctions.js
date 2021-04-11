//one online user container creator
function oneOnlineUser(user){
    //the same user dont show online second time
    if(nowOnlinesContainer.querySelector(`#o${user.id}`)) return;

    nowOnlinesContainer.insertAdjacentHTML("afterbegin",`
    <section class="oneOnlineUserContainer" id="o${user.id}">
        <img src="/images/${user.image}" alt="" class="onlineUserImage">
        <img src="/images/circle.gif" alt="" class="onlineUserIcon">
        ${user.username}
    </section>
    `
    )
}

//private message part

nowOnlinesContainer.addEventListener("click",(e)=>{
    let userIdAccepter=e.target.closest(".oneOnlineUserContainer").id.slice(1)
    let useranemAccepter=e.target.closest(".oneOnlineUserContainer").textContent.trim()
   if(privateMessagesContainer.querySelector(`#p${userIdAccepter}`)) return;
   onePrivateMassegeWindow(useranemAccepter,userIdAccepter)
})

//close on  messagie window

privateMessagesContainer.addEventListener("click",(e)=>{
    if(e.target.classList.contains("close"))
        e.target.parentNode.parentNode.remove()
    
    
})


function onePrivateMassegeWindow(usernameAccepter,userIdAccepter){
     //geting ald messages
     let fromTo={
         from:userHomeId,
         to:userIdAccepter
     }
     fetch("/getmessages",{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("accessToken"),
            "Content-Type":"application/json"
        },
        body:JSON.stringify(fromTo)
    }).then(res=>res.json())
    .then(data=>{
        let {error, messages}=data
        if(error){
            if(error=="jwt expired"){
                refreshTokensFunction(refreshingTokensForMessages)
                function refreshingTokensForMessages(){
                    onePrivateMassegeWindow(usernameAccepter,userIdAccepter)
                }
                return
            }
            alert(error)            
            return
        }
        messages.forEach(message=>dispalyingOneMessage(message))
    })
    if(privateMessagesContainer.querySelector(`#p${userIdAccepter}`)){
       return
     }
    privateMessagesContainer.insertAdjacentHTML(`afterbegin`,`
        <section class="private_message_container" id="p${userIdAccepter}">
        <div class="header">
            <div class="accepter">
              ${usernameAccepter}
            </div>
            <button type="button" class="btn-close close" aria-label="Close">
              &#9746;
            </button>
            
        </div>
        
        <div class="messageContainer">
    
            
        </div>  


        <form action="" class="chatForm">
            <textarea type="text" name="text"></textarea>
            <input type="hidden" name="to" value="${userIdAccepter}">
            <input type="hidden" name="from" value="${userHomeId}">
            <input type="hidden" name="fromUsername" value="${userHomeUsername}">
            <input type="hidden" name="fromImage" value="${userHomeImage}">
            <input type="submit" value="Send" class="chatFormBtn">
        </form>
    </section>
    `)


}

//sending message

privateMessagesContainer.addEventListener("click",(e)=>{
    if(e.target.classList.contains("chatFormBtn")){
        e.preventDefault();
        let form =e.target.parentNode;
        let messageInfo={
            text:form.elements["text"].value,
            to:form.elements["to"].value,
            from:form.elements["from"].value,
            fromUsername:form.elements["fromUsername"].value,
            fromImage:form.elements["fromImage"].value,
        }

     
        socket.emit("private message",messageInfo)  
        form.elements["text"].value=""  
    }
})

//displayin one message
function dispalyingOneMessage(data){
    let {from,text, fromUsername,fromImage,createdAt,to}=data
    if(data.to==userHomeId){
      if(!privateMessagesContainer.querySelector(`#p${from}`)){
        onePrivateMassegeWindow(fromUsername,from)
      }else{
         oneMessageView(from,text,fromUsername,fromImage,createdAt,"flaot-left") 
      }      
    }else{
        oneMessageView(to,text,userHomeUsername,userHomeImage,createdAt,"flaot-right")
    }
}

//one message view
function oneMessageView(select,text,username,image,time,position){
    let messageContainer=privateMessagesContainer.querySelector(`#p${select}`)
    .querySelector(".messageContainer");
      messageContainer.insertAdjacentHTML(`afterbegin`,`
      
        <section class="onePrivateMessageContainer ${position}" >
            <img src="/images/${image}" alt="" class="onePrivateMessageImage"><b>${username}</b>
            <p>${text}</p>
            <p>${time}</p>
        </section>
     `)

}