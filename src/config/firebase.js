
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCZ6dSf4RewzCnJmoYeK6Afd7CnJM5PDAc",
  authDomain: "chat-app-at-c6697.firebaseapp.com",
  projectId: "chat-app-at-c6697",
  storageBucket: "chat-app-at-c6697.appspot.com",
  messagingSenderId: "484659604120",
  appId: "1:484659604120:web:672ae8c3825da06f107eed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth,email,password);
        const user = res.user;
        console.log(res,"abc");
        await setDoc(doc(db,"users",user.uid),
    {
        id:user.uid,
        username:username.toLowerCase(),
        email,
        name:"",
        avatar:"",
        bio:"Hey! I am using this chat app",
        lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats",user.uid),{
        chatsData:[]
    })
    } catch (error) {
        console.error(error)
        toast.error(error.code)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email,password) => {
    try {
        await signInWithEmailAndPassword(auth,email,password)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }

}

const resetPassword = async (email) => {
    if (!email) {
       toast.error("Enter your email");
       return null; 
    }
    try {
        const userRef = collection(db,"users");
        const q = query(userRef, where("email", "==",email));
        const querySnap = await getDocs(q);

        if (!querySnap) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent");
        }
        else {
            toast.error("Email doesn't exists")
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
        
    }
}

export {signup,login,logout,auth,db,resetPassword}
