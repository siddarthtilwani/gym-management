// Import the functions you need from the SDKs you need
import { useState ,useEffect } from "react";
import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signOut , signInWithEmailAndPassword} from "firebase/auth"
import {getStorage , ref , uploadBytesResumable , getDownloadURL} from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWTCXcVYlBwE_hBsuAKjWaNSJ0Y9OkCdk",
  authDomain: "fitnessprogym-2fb41.firebaseapp.com",
  databaseURL: "https://fitnessprogym-2fb41-default-rtdb.firebaseio.com",
  projectId: "fitnessprogym-2fb41",
  storageBucket: "fitnessprogym-2fb41.appspot.com",
  messagingSenderId: "328886163871",
  appId: "1:328886163871:web:f47e96afb2dc3866da45aa",
  measurementId: "G-3W13QWFTNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);

// LOG IN RELATED
export function signup(email, password){
    createUserWithEmailAndPassword(auth, email, password)
}

export function logout(){
    return signOut(auth)
}

export function login(email , password){
    return signInWithEmailAndPassword(auth ,email ,password)
}

// CUSTOM HOOK
export function useAuth(){
    const [currentUser, setCurrentUser] = useState()
    
    useEffect(() => {
        const unsub  = onAuthStateChanged(auth , user => {setCurrentUser(user)})
        return unsub
    } , [])
    return currentUser
}

//storage function 
export function upload(file ){
 
if (!file) return;

 const fileRef = ref(storage , file.name)  
 const uploadTask = uploadBytesResumable(fileRef, file) ;
 
 uploadTask.on("state_changed", (snapshot) => {
     const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes)*100
     console.log(progress)
 } , 
 (err) => console.log(err) , 
 () => {getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url))}
 )
 alert("Picture Uploaded")
}