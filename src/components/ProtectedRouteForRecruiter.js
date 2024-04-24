import React,{useEffect} from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "./contexts/userAuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const ProtectedRouteForRecruiter = ({ children }) => {
  let { user } = useUserAuth();
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getDoc(doc(db, "users", user.uid));
          const userType = userData.data().userType;

          if (userType === "student") {
            return children;
          } else {
            return <Navigate to="/" />;
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
    return () => {
      //   cleanup
    };
  }, [user]);
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRouteForRecruiter;
