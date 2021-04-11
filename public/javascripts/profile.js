let profileInfo=document.querySelector("#profileInfo");
let profileImg=document.querySelector("#profileImg");



let profileId=location.pathname.slice("/profile/".length);
let userHomeId=localStorage.getItem("userHomeId");

if(localStorage.getItem("accessToken") && userHomeId==profileId){
    profileInfo.insertAdjacentHTML(`beforeend`,`
    <p>
    <button id="editImageBtn">Change Photo</button>  
    </p>
    <section id="editImagePart" hidden >
    <p id="imageChangeError"></p>
    <input type="file" name="file" id="attachFile"> 
    <p>
    <input type="button" value="Save" id="changeBtn"> 
    <input type="button" value="Cancel" id="cancelChangeBtn">
    </p> 

    </section>  
`)


    let editImageBtn=document.querySelector("#editImageBtn");
    let attachFile=document.querySelector("#attachFile");
    let editImagePart=document.querySelector("#editImagePart");
    let changeBtn=document.querySelector("#changeBtn");
    let cancelChangeBtn=document.querySelector("#cancelChangeBtn");
    let imageChangeError=document.querySelector("#imageChangeError");

    editImageBtn.addEventListener("click",()=>{
        editImageBtn.hidden=true
        editImagePart.hidden=false
    })
    //changeing image to atcha image link
    attachFile.addEventListener("change",()=>{
        let link=URL.createObjectURL(attachFile.files[0]);
        profileImg.src=link
    })

    cancelChangeBtn.addEventListener("click",()=>{
        attachFile.value="";
        editImageBtn.hidden=false;
        editImagePart.hidden=true;
    })
   
    changeBtn.addEventListener(`click`,()=>{
       let formData=new FormData();
       formData.append("imageFile",attachFile.files[0]);

       fetch("/changePhoto",{
           method:"POST",
           headers:{
            "Authorization":"Bearer "+localStorage.getItem("accessToken"), 
           },
           body:formData
       }).then(res=>res.json())
       .then(data=>{
           let {error,fileError,imageName}=data;
           if(error){
               alert(error)
               location.href="/"
               return
           }
           if(fileError){
             alert(fileError)
             imageChangeError.innerHTML=""
             imageChangeError=fileError
             return
           }
           profileImg.src="/images/"+imageName;
           attachFile.value="";
           editImageBtn.hidden=false;
           editImagePart.hidden=true;

       })

    })

    document.body.insertAdjacentHTML("beforeend",`
    <p class="p-2 text-center bg-secondary my-3" >
      <button class="btn btn-primary " id="deleteAccount">Delete Account</button>
    </p> 
    <div class="container-fluid text-center ">
        <div class="row">
            <div class="col-md-3" id="friendsContainer">
                <h5>Friends</h5>
                
            </div>
            <div class="col-md-9" id="myPost">
                <h1>Posts</h1>
            </div>
            
                
        </div>
    </div>
    
 
    `)

         //log out
         let deleteAccount=document.querySelector("#deleteAccount");
         deleteAccount.addEventListener("click",()=>{

            let result=confirm("Are you sure delete Account")
            if(result){
                  fetch("/auth/deleteAccount",{
                 method:"POST",
                 headers:{
                     "Authorization":"Bearer "+localStorage.getItem("refreshToken")
                 }
             }).then(res=>res.json())
             .then(data=>{
                 let {error}=data
                 if(error){
                     alert(error);
                     return
                 }
                 localStorage.removeItem("accessToken");
                 localStorage.removeItem("refreshToken");
                 location.href="/";               
                 
              })
            }
           
         })
    let friendsContainer=document.querySelector("#friendsContainer");

    fetch("/profile",{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("accessToken"),
            "Content-Type":"application/json"
        }
    }).then(res=>res.json())
    .then(data=>{
        let {error,user}=data
        if(error){
            location.href="/"            
            return
        }
       
        user.friends.forEach(user=>oneFriend(user))
    })

    function oneFriend(userInfo){
        let {_id, username, image}=userInfo
        let h5=friendsContainer.querySelector("h5")
        h5.insertAdjacentHTML(`afterend`,`
        <section class="nonFriendUserConatiner" id="fri_${_id}">
          <p><img src="/images/${image}" alt="" class="nonFriendUserImage"> ${username}</p> 
          <p>
            <button class="deleteFriend btn btn-primary">Delete Friend</button>
          </p>
          <p>  
            <a href="/profile/${_id}"><button class="btn btn-primary ">View Profile</button></a> 
          </p>
        </section>
        `)
    
    }

    //delete friend
    friendsContainer.addEventListener("click",e=>{
        if(e.target.classList.contains("deleteFriend")){
           let idObj={
              id:e.target.parentNode.parentNode.id.slice(4),
           }
           fetch("/deleteFriend",{
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
               
                location.href="/"         
                 return
             }
          
            if(result){
              e.target.parentNode.parentNode.remove()
            }
           
         })
 
        }
     })

}

