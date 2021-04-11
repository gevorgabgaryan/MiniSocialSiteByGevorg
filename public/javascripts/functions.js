const mainContainer=document.querySelector('#mainContainer')
const userInfoContainer=document.querySelector('#userInfoContainer')
const nonFriendsUsersContainer=document.querySelector('#nonFriendsUsersContainer')
const postsContainer=document.querySelector('#postsContainer')
const onlinesContainer=document.querySelector('#onlinesContainer')
const nowOnlinesContainer=document.querySelector('#nowOnlinesContainer')
const privateMessagesContainer=document.querySelector('#privateMessagesContainer')
const friendRequestContainer=document.querySelector('#friendRequestContainer')


const homeFunction=()=>{
    fetch("/",{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("accessToken"),
            "Content-Type":"application/json"
        }
    }).then(res=>res.json())
    .then(data=>{
        let {error}=data
        if(error){
            if(error=="jwt expired"){
                refreshTokensFunction(homeFunction)
                return
            }
            loginFunction()             
            return
        }
     
        let {userInfo,nonFriendUsers}=data
        HomePageViewWithContent(userInfo)
        //sendi user info for useing in socket
        newUserConnected()
         userHomeId=userInfo.id;
         userHomeUsername=userInfo.username;
         userHomeImage=userInfo.image  
         localStorage.setItem("userHomeId",userHomeId)

         //displaying non frineds
         nonFriendUsers.forEach(user=>oneNonFriendUser(user))

          //displaying friend request
          userInfo.friendRequests.forEach(user=>oneFriendRequest(user))
      
    })

    
}

function HomePageViewWithContent(userInfo){
       let {username,image, id,}=userInfo
        userInfoContainer.innerHTML="";
         userInfoContainer.insertAdjacentHTML("beforeend",` 
         <p class="px-5">
          <button class="btn btn-primary float-right" id="logOut">LogOut</button></a> 
         </p> 
         <h1>User Info</h1>
         <h5>${username}</h4>
         <img src="/images/${image}" width="250" height="250">
         <p>
             <a href="/profile/${id}">Profile</a>
         </p>
    `)


     //log out
    let logOut=document.querySelector("#logOut");
    logOut.addEventListener("click",()=>{
        fetch("/auth/logout",{
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
    })
}
//
function oneNonFriendUser(userInfo){
    let {_id, username, image}=userInfo
    let h5=nonFriendsUsersContainer.querySelector("h5")
    h5.insertAdjacentHTML(`afterend`,`
    <section class="nonFriendUserConatiner" id="non_${_id}">
      <p><img src="/images/${image}" alt="" class="nonFriendUserImage"> ${username}</p> 
      <p>
        <button class="addFriend btn btn-primary">Add Friend</button>
      </p>
      <p>  
        <a href="/profile/${_id}"><button class="btn btn-primary ">View Profile</button></a> 
      </p>
    </section>
    `)

}

//
function oneFriendRequest(userInfo){
    let {_id, username, image}=userInfo
    let h5=friendRequestContainer.querySelector("h5")
    h5.insertAdjacentHTML(`afterend`,`
    <section class="friendRequestConatiner" id="fr_${_id}">
      <p><img src="/images/${image}" alt="" class="friendRequestImage"> ${username}</p> 
      <p>
        <button class="confirmFriend btn btn-primary">Confirm friend</button>
      </p>
      <p>  
        <a href="/profile/${_id}"><button class="btn btn-primary ">View Profile</button></a> 
      </p>
    </section>
    `)

}


const loginFunction=()=>{
    mainContainer.innerHTML=""
    mainContainer.insertAdjacentHTML(`afterbegin`,`
    <form id="loginForm" >
    <p id="loginErrors" class='text-danger'><p>
        <div class="form-group">
            <label for="email">Email address:</label>
            <input type="email" class="form-control" placeholder="Enter email" name="email">
        </div>
        <div class="form-group">
            <label for="pwd">Password:</label>
            <input type="password" class="form-control" placeholder="Enter password" name="password">
        </div>
        <button type="submit" class="btn btn-primary" id="loginBtn">Submit</button>
        </form>
        <p class="py-5">
               <button id="forRegisterBtn" class="btn btn-success" >Register Now</button>
        </p>

    `)
    //sumbit login
    let loginErrors=document.querySelector('#loginErrors')
    let loginForm=document.querySelector('#loginForm')
    loginForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        let loginInfo={
            email:loginForm.elements['email'].value,
            password:loginForm.elements['password'].value,
        }
        fetch(`/auth/login`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify(loginInfo)
        }).then(res=>res.json())
        .then(data=>{
            let {error, accessToken, refreshToken}=data
            if(error){
               return loginErrors.innerHTML=error
            }
            localStorage.setItem('accessToken',accessToken)
            localStorage.setItem('refreshToken',refreshToken)
            location.href="/"
           
        })
    })

    //login page register button
     let forRegisterBtn=document.querySelector('#forRegisterBtn')
     forRegisterBtn.addEventListener('click',registerFunction)

}

function registerFunction(){
    mainContainer.innerHTML=""
    mainContainer.insertAdjacentHTML(`afterbegin`,`
    <form  id="registerForm" >
        <p id="registerErrors" class='text-danger'><p>
         <div class="form-group">
            <label for="username">User Name:</label>
            <input type="text" class="form-control" placeholder="Enter username" name="username">
        </div>
        <div class="form-group">
            <label for="email">Email address:</label>
            <input type="email" class="form-control" placeholder="Enter email" name="email">
        </div>
        <div class="form-group">
            <label for="pwd">Password:</label>
            <input type="password" class="form-control" placeholder="Enter password" name="password">
        </div>
        <button type="submit" class="btn btn-primary" id="registerBtn">Submit</button>
        </form>
        <p class="py-5">
               <button id="forLoginBtn" class="btn btn-success" >Login</button>
               <button id="cancelRegisterBtn" class="btn btn-warning" >Cancel</button>
        </p>

    `)
    let registerErrors=document.querySelector('#registerErrors')
    let registerForm=document.querySelector('#registerForm')
    registerForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        let registerUserInfo={
            username:registerForm.elements['username'].value,
            email:registerForm.elements['email'].value,
            password:registerForm.elements['password'].value,
        }
        fetch(`/auth/register`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify(registerUserInfo)
        }).then(res=>res.json())
        .then(data=>{
            let {error,emailSent,id}=data
            if(error){
               return registerErrors.innerHTML=error
            }
            if(emailSent)
               verifyFunction(id)
            else  
               loginFunction()
        })
    })
    //login form
     let forLoginBtn=document.querySelector('#forLoginBtn')
     forLoginBtn.addEventListener('click',loginFunction)
    //main page
    let cancelRegisterBtn=document.querySelector('#cancelRegisterBtn')
    cancelRegisterBtn.addEventListener('click',()=>{
        location.href="/"
    })

}

function verifyFunction(userId){
  try{  
    mainContainer.innerHTML=""
    mainContainer.insertAdjacentHTML(`afterbegin`,`
    <form  id="verifyForm" >
        <p id="verifyErrors" class='text-danger'><p>
         <div class="form-group">
            <label for="code">Your Code:</label>
            <input type="text" class="form-control" placeholder="Enter your code" name="code">
        </div>
        <div class="form-group">
             <input type="hidden" class="form-control" value="${userId}" name="userId">
        </div>
      
        <button type="submit" class="btn btn-primary" >Verify Your Email</button>
        </form>
   
    `)
    let verifyErrors=document.querySelector('#verifyErrors')
    let verifyForm=document.querySelector('#verifyForm')
    verifyForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        let verifyInfo={
            code:verifyForm.elements['code'].value,
            id:verifyForm.elements['userId'].value,
        }
        fetch(`/auth/verifyemail`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                "Accept":"application/json",
            },
            body:JSON.stringify(verifyInfo)
        }).then(res=>res.json())
        .then(data=>{
            let {error}=data
            if(error){
               return verifyErrors.innerHTML=error
            }
             loginFunction()
          
        })
    })
 }catch(err){
     console.log(err)
 } 
}

function refreshTokensFunction(fuctionName){

    fetch("/auth/refreshtokens",{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("refreshToken"),
            "Content-Type":"apllication/json"
        }
    }).then(res=>res.json())
    .then(data=>{
        let {error,accessToken,refreshToken}=data
        if(error){
            alert(error)
            loginFunction()             
            return
        }

        localStorage.setItem('accessToken',accessToken)
        localStorage.setItem('refreshToken',refreshToken)
        fuctionName()
        
    })

}