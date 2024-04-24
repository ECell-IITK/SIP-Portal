import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  AppBar,
  Box,
  Typography
} from "@mui/material"; 
import SwipeableViews from "react-swipeable-views";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import PropTypes, { array } from "prop-types";
import { useTheme } from "@mui/material/styles";
import { useUserAuth } from "./contexts/userAuthContext";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const SignUp = () => {
  const theme = useTheme();
  const {signUp, emailVerification } = useUserAuth();
  const navigate = useNavigate();

  const textArea = {
    width: "100%",
    marginTop: "5px",
    marginBottom: "5px",
    // maxWidth: "300px",
  };

  const [value, setValue] = useState(0);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rollNumber,setRollNumber] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setIndex(index);
  };

  useEffect(() => {
    console.log("Error:", error);
    console.log("Message:", message);
  }, [error, message]);

  const handleSubmitOfStudent = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const emailRegex = /^[a-zA-Z0-9._-]+@iitk\.ac\.in$/;
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all the fields");
    } else if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
    } else if (!checked) {
      setError("Please accept the terms and conditions");
    }else if(!emailRegex.test(email)){
      setError("Please enter a valid IITK email");
    }
     else {
      try {
        setLoading(true);
        const res = await signUp(email, password);
        const res2 = await setDoc(doc(db, "users", res.user.uid), {
          name: name,
          email: email,
          userType: "student",
          createdAt: serverTimestamp(),
          rollNumber: rollNumber,
          data: [],
          appliedJobList: [],
          freeze: false,
          recruitedStatus: "pending",
        });
        await emailVerification().then(() => {
          setMessage("Email verification sent");
        });
        navigate("/");
      } catch (err) {
        // console.log(err)
        setError(err.message);
      } finally {
        if (!error) {
          setMessage("User Created Successfully");
        }
        setLoading(false);
        console.log(error, message);
      }
    }
    // if (!error) {
    //   setMessage("User Created Successfully");
    // }
    // setLoading(false);
    // console.log(error, message);
    // console.log(res)
    // console.log(name, email, password, confirmPassword, checked);
  };
  const handleSubmitOfRecruiter = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all the fields");
    } else if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
    } else if (!checked) {
      setError("Please accept the terms and conditions");
    } else {
      try {
        setLoading(true);
        const res = await signUp(email, password);
        const res2 = await setDoc(doc(db, "users", res.user.uid), {
          name: name,
          companyName: companyName,
          email: email,
          userType: "recruiter",
          designation: designation,
          contactNumber: contactNumber,
          createdAt: serverTimestamp(),
          freeze: false,
          verified:false,
        });
        await emailVerification().then(() => {
          setMessage("Email verification sent");
        });
        navigate("/");
      } catch (err) {
        // console.log(err)
        setError(err.message);
      } finally {
        if (!error) {
          setMessage("User Created Successfully");
        }
        setLoading(false);
        console.log(error, message);
      }
    }
    // console.log(name, email, password, confirmPassword, checked);
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
        }}
      >
        <Link
          to={"/"}
          style={{ textDecoration: "none", color: "turquoise", margin: "5px" }}
        >
          Login
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
              src="./images/signup.png"
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
              SIGN UP
            </p>
            <Typography variant="subtitle2" color="grey">
              Please check the inbox after signup for email verification
            </Typography>
          </div>
          {error && <Alert severity="error">{error}</Alert>}
          {!error && message && <Alert severity="success">{message}</Alert>}
          <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{ marginTop: "5px" }}
          >
            <Tabs value={value} onChange={handleChange} variant="fullWidth">
              <Tab label="Student" {...a11yProps(0)} />
              <Tab label="Recruiter" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
            sx={{ padding: "00px" }}
          >
            <TabPanel
              value={value}
              index={0}
              dir={theme.direction}
              sx={{ padding: "00px" }}
            >
              <form
                type="submit"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "800px",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  padding: "0px",
                }}
                onSubmit={handleSubmitOfStudent}
              >
                <TextField
                  required
                  label="Full Name"
                  variant="outlined"
                  sx={textArea}
                  onChange={(e) => setName(e.target.value)}
                />
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
                  label="IIT Roll Number"
                  variant="outlined"
                  sx={textArea}
                  type="text"
                  onChange={(e) => setRollNumber(e.target.value)}
                />
                <TextField
                  required
                  label="Password"
                  variant="outlined"
                  sx={textArea}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  required
                  label="Confirm Password"
                  variant="outlined"
                  sx={textArea}
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => setChecked(e.target.checked)}
                      />
                    }
                    label={
                      <p>
                        <span>I accept the </span>
                        <Link
                          to={"/"}
                          style={{ textDecoration: "none", color: "turquoise" }}
                        >
                          intern policy
                        </Link>
                      </p>
                    }
                  />
                </FormGroup>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    backgroundColor: "turquoise",
                    "&:hover": { backgroundColor: "turquoise" },
                  }}
                  type="submit"
                  disabled={loading}
                >
                  Sign Up
                </Button>
              </form>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <form
                type="submit"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "800px",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  padding: "0px",
                }}
                onSubmit={handleSubmitOfRecruiter}
              >
                <TextField
                  required
                  label="Company Name"
                  variant="outlined"
                  sx={textArea}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <TextField
                  required
                  label="Full Name"
                  variant="outlined"
                  sx={textArea}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  required
                  label="Designation"
                  variant="outlined"
                  sx={textArea}
                  onChange={(e) => setDesignation(e.target.value)}
                />
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
                  label="Contact Number"
                  variant="outlined"
                  sx={textArea}
                  type="text"
                  onChange={(e) => setContactNumber(e.target.value)}
                />
                <TextField
                  required
                  label="Password"
                  variant="outlined"
                  sx={textArea}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  required
                  label="Confirm Password"
                  variant="outlined"
                  sx={textArea}
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => setChecked(e.target.checked)}
                      />
                    }
                    label={
                      <p>
                        <span>I accept the </span>
                        <Link
                          to={"/"}
                          style={{ textDecoration: "none", color: "turquoise" }}
                        >
                          terms and conditions
                        </Link>
                      </p>
                    }
                  />
                </FormGroup>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    backgroundColor: "turquoise",
                    "&:hover": { backgroundColor: "turquoise" },
                  }}
                  type="submit"
                  disabled={loading}
                >
                  Sign Up
                </Button>
              </form>
            </TabPanel>
          </SwipeableViews>

          <div style={{ margin: "5px" }}>
            Already have an account?{" "}
            <Link
              to={"/"}
              style={{
                textDecoration: "none",
                color: "turquoise",
                textAlign: "right",
              }}
            >
              Login here
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

export default SignUp;
