

//checkin is user logedIn
if(localStorage.getItem('accessToken'))
    homeFunction()
 else
    loginFunction()   

 
    //send friend request

    nonFriendsUsersContainer.addEventListener("click",e=>{
       if(e.target.classList.contains("addFriend")){
          let idObj={
             id:e.target.parentNode.parentNode.id.slice(4),
          }
          fetch("/addFriend",{
            method:"POST",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("accessToken"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify(idObj)
        }).then(res=>res.json(idObj))
        .then(data=>{
            let {error,result}=data
            if(error){
                if(error=="jwt expired"){
                    refreshTokensFunction(homeFunction)
                    return
                }
                alert(error)            
                return
            }
         
           if(result){
             e.target.parentNode.parentNode.remove()
           }
          
        })

       }
    })


    //confirmfriend request
    friendRequestContainer.addEventListener("click",e=>{
        if(e.target.classList.contains("confirmFriend")){
           let idObj={
              id:e.target.parentNode.parentNode.id.slice(3),
           }
           fetch("/confirmFriend",{
             method:"POST",
             headers:{
                 "Authorization":"Bearer "+localStorage.getItem("accessToken"),
                 "Content-Type":"application/json"
             },
             body:JSON.stringify(idObj)
         }).then(res=>res.json(idObj))
         .then(data=>{
             let {error,result}=data
             if(error){
                 if(error=="jwt expired"){
                     refreshTokensFunction(homeFunction)
                     return
                 }
                 alert(error)            
                 return
             }
          
            if(result){
              e.target.parentNode.parentNode.remove()
            }
           
         })
 
        }
     })