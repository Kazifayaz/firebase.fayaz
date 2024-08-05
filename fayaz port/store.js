




const userDetial = document.querySelector(".userdetails")
const editsprofile = document.getElementById("editsprofile")
function createusercollection(user){
 
    firebase.firestore().collection("users")
    .doc(user.uid)
    .set({
        uid:user.uid,
        name:user.displayName,
        email:user.email,
        phone:"",
        specialty:"",
        portfolioUrl:"",
        experience:""
    })
}

// async function getuserinfo(userID){

//     if (userID) {
//         const userInfoSnap = await firebase.firestore()
//         .collection("users")
//         .doc(userID)
//         .get()
    
    
//        const userinfo = userInfoSnap.data();
//        if(userinfo){
//         userDetial.innerHTML = `
//         <h3>${userinfo.name}</h3>
//         <h3>${userinfo.email}</h3>
//         <h3>${userinfo.phone}</h3>
//         `
//        }
//     } else {
//          userDetial.innerHTML = `
//         <h3>please login</h3>
//         `
//     }
 
// }

async function getuserinfoRealtime(userID){

    if (userID) {
        const userdocRef = await firebase.firestore()
        .collection("users")
        .doc(userID)
        userdocRef.onSnapshot((doc)=>{
            if(doc.exists){
                const userinfo = doc.data();
                if(userinfo){
                 userDetial.innerHTML = `
                 <h3 style="color:greenyellow ; text-align: center; ">${userinfo.name}</h3>
                 <h3 style="color:greenyellow ; text-align: center; ">${userinfo.email}</h3>
                 <h3 class="hello">${userinfo.phone}</h3>
                  <h3>${userinfo.specialty}</h3>
                  <h3>${userinfo.portfolioUrl}</h3>
                <h3>${userinfo.experience}</h3> 
                `
                 editsprofile["profileEmail"].value = userinfo.email
                  editsprofile["phone"].value = userinfo.phone
                  editsprofile["specialty"].value = userinfo.specialty
                  editsprofile["portfolioUrl"].value = userinfo.portfolioUrl
                  editsprofile["experience"].value = userinfo.experience
                  
                  if(firebase.auth().currentUser.photoURL){
                      document.querySelector("#propic").src = firebase.auth().currentUser.photoURL 
                  }
                }
            }
        })
    } else {
         userDetial.innerHTML = `
        <h3>please login</h3>
        `
    } 
}
function userupdate(e){
 e.preventDefault()
 const userDocRef = firebase
 .firestore()
 .collection("users")
 .doc(firebase.auth().currentUser.uid);

userDocRef.update({
    name: editsprofile["name"].value,
    email : editsprofile["profileEmail"].value,
    phone: editsprofile["phone"].value,
    specialty : editsprofile["specialty"].value,
    portfolioUrl: editsprofile["portfolioUrl"].value,
    experience: editsprofile["experience"].value

    
})

}

function uploadimg (e){
    // console.log(e.target.files);
    const uid = firebase.auth().currentUser.uid;
    const fileRef = firebase.storage().ref().child(`/users/${uid}/profile`);
    const uploadTask = fileRef.put(e.target.files[0])

    uploadTask.on('state_changed', 
        (snapshot) => {
         
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          if(progress=='100')alert("uploaded pic")
          
        }, 
        (error) => {
          console.log(error);
        }, 
        () => {
        
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            firebase.auth().currentUser.updateProfile({
                photoURL: downloadURL
              })
          });
        }
      );
}
