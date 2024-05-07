import React, { useEffect, useState } from "react";
import { Typography, TextField, Button, Alert } from "@mui/material";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "./contexts/userAuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./auth.css";

const LogIn = () => {
  const navigate = useNavigate();
  const { logIn } = useUserAuth();

  useEffect(()=>{
    const localEmail = JSON.parse(window.localStorage.getItem('SIP_USER_EMAIL'))
    const localPassword = JSON.parse(window.localStorage.getItem('SIP_USER_PSD'))
    console.log(localEmail,localPassword);
    if(localEmail!=null && localPassword!=null){
      setEmail(localEmail);
      setPassword(localPassword);
      const handleLocalStorage = async() => {
        try {
          setLoading(true);
          const res = await logIn(localEmail, localPassword);
          if (!res.user.emailVerified) {
            setError("Please verify your email on your registered email address");
            setLoading(false);
            return;
          }
          const userData = await getDoc(doc(db, "users", res.user.uid));
          if (userData.exists()) {
            const data = userData.data();
            if (data.userType === "student") {
              console.log("student");
              if(data.freeze){
                setError("Your account has been frozen by the admin");
                setLoading(false);
                return;
              }else if(!data.verified){
                setError("Your account has not been verified by the admin yet");
                setLoading(false)
                return;
              }
              navigate("/student");
            } else if (data.userType === "recruiter") {
              console.log("recruiter")
              console.log(data);
              if(data.freeze){
                setError("Your account has been frozen by the admin");
                setLoading(false)
                return;
              }else if(!data.verified){
                setError("Your account has not been verified by the admin yet");
                setLoading(false)
                return;
              }
              navigate("/recruiter");
            }else if (data.userType === "admin") {
              navigate("/admin");
            }
          } else {
            setError("User does not exist");
          }
          // console.log(res,userData.data());
        } catch (err) {
          setError(err.message);
        }
        setLoading(false);
      }
      handleLocalStorage();
    }
  },[])

  const textArea = {
    width: "100%",
    maxWidth: "400px",
    margin: "5px",
    borderRadius: "10px",
    // maxWidth: "300px",
  };
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@iitk\.ac\.in$/;
    if (!email || !password) {
      setError("Please fill all the fields");
    }else {
      setError("");
      setMessage("Logged In Successfully");
      try {
        setLoading(true);
        const res = await logIn(email, password);
        if (!res.user.emailVerified) {
          setError("Please verify your email on the registered email address");
          setLoading(false)
          return;
        }
        // navigate("/student");
        const userData = await getDoc(doc(db, "users", res.user.uid));
        if (userData.exists()) {
          console.log(userData.data());
          const data = userData.data();
          window.localStorage.setItem('SIP_USER_EMAIL',JSON.stringify(email));
          window.localStorage.setItem('SIP_USER_PSD',JSON.stringify(password));
          if (data.userType === "student") {
            console.log("student");
            if(data.freeze){
              setError("Your account has been frozen by the admin");
              setLoading(false)
              return;
            }else if(!data.verified){
              setError("Your account has not been verified by the admin yet");
              setLoading(false)
              return;
            }
            navigate("/student");
          } else if (data.userType === "recruiter") {
            if(data.freeze){
              setError("Your account has been frozen by the admin");
              setLoading(false)
              return;
            }else if(!data.verified){
              setError("Your account has not been verified by the admin yet");
              setLoading(false)
              return;
            }
            navigate("/recruiter");
          }else if (data.userType === "admin") {
            navigate("/admin");
          }
        } else {
          setError("User does not exist");
        }
        // console.log(res,userData.data());
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    // console.log(email, password);
  };
  return (
    <>
      <div
        style={{
          textAlign: "right",
          position: "fixed",
          top: "0",
          zIndex: "2",
          width: "100%",
          padding: "20px",
          boxSizing: "border-box",
          zIndex: "2",
        }}
      >
        <Link
          to={"/signup"}
          style={{ textDecoration: "none", color: "turquoise", margin: "5px" }}
        >
          Sign Up
        </Link>
        <Link
          to={"/"}
          style={{ textDecoration: "none", color: "turquoise", margin: "5px" }}
        >
          Contact Us
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <div className="authLeftSide">
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              marginTop: "40px",
              margin: "5px",
            }}
          >
            <img
              src="./images/login.png"
              alt="logo"
              style={{ width: "100px", height: "100px", margin: "auto" }}
            />
            <p
              style={{
                fontWeight: "700",
                fontSize: "30px",
                color: "turquoise",
              }}
            >
              Login
            </p>
          </div>
          <form
            type="submit"
            style={{
              display: "flex",
              flexDirection: "column",
              // maxWidth: "400px",
              justifyContent: "space-around",
              alignItems: "center",
            }}
            onSubmit={handleSubmit}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {/* {!error && message && <Alert severity="success">{message}</Alert>} */}
            <TextField
              required
              label="Email"
              variant="outlined"
              sx={textArea}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              label="Password"
              variant="outlined"
              sx={textArea}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "turquoise",
                margin:"5px",
                "&:hover": { backgroundColor: "turquoise" },
              }}
              type="submit"
              disabled={loading}
            >
              LogIn
            </Button>
            <div style={{ textAlign: "right", width: "100%", margin: "5px" }}>
              <Link
                to={"/forgotpassword"}
                style={{
                  textDecoration: "none",
                  color: "turquoise",
                  textAlign: "right",
                }}
              >
                forgot password?
              </Link>
            </div>
          </form>
          <div style={{ margin: "5px" }}>
            New User?{" "}
            <Link
              to={"/signup"}
              style={{
                textDecoration: "none",
                color: "turquoise",
                textAlign: "right",
              }}
            >
              Register here
            </Link>{" "}
          </div>
        </div>
        <div className="authRightSide">
          <div className="ellipse ellipse-1"></div>
          <div className="ellipse ellipse-2"></div>
          <div className="ellipse ellipse-3"></div>
          <div className="ellipse ellipse-4"></div>
          <div className="ellipse ellipse-5"></div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
