import { createContext, useState, useEffect, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail ,sendEmailVerification, deleteUser} from "firebase/auth";
import { auth} from "../firebase";

const  userAuthContext = createContext();

export const UserAuthContextProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const signUp = (email,password) =>{
        return createUserWithEmailAndPassword(auth,email,password);
    }
    const logIn = (email,password) => {
        return signInWithEmailAndPassword(auth,email,password);
    }
    const emailVerification = () =>{
        return sendEmailVerification(auth.currentUser);
    }
    const logOut = () => {
        window.localStorage.setItem('SIP_USER_EMAIL',JSON.stringify(null));
        window.localStorage.setItem('SIP_USER_PSD',JSON.stringify(null));
        return signOut(auth);
    }
    const passwordReset = (email) => {
        return sendPasswordResetEmail(auth,email);
    }
    const deleteUser = (user) =>{
        return deleteUser(auth,user);
    }

    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth,(user) => {
            setUser(user);
        });
        return () => unsubscribed(); 
    });
    return (
        <userAuthContext.Provider value={{user,signUp,logIn,logOut, passwordReset, emailVerification,deleteUser}}>
            {children}
        </userAuthContext.Provider>
    )
}

export const useUserAuth = () =>{
    return useContext(userAuthContext);
}