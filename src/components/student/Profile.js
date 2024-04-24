import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserAuth } from "../contexts/userAuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const Profile = () => {
  const { user } = useUserAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    department: "",
    secondaryDepartment: "",
    specialisation: "",
    gender: "",
    dob: "",
    alternateContactNumber: "",
    currentCPI: "",
    tenthBoard: "",
    tenthMarks: "",
    twelfthBoardYear: "",
    entranceExam: "",
    category: "",
    currentAddress: "",
    friendsName: "",
    disability: "",
    expectedGraduationYear: "",
    program: "",
    secondaryProgram: "",
    preference: "",
    personalEmail: "",
    contactNumber: "",
    whatsappNumber: "",
    ugCPI: "",
    tenthBoardYear: "",
    twelfthBoard: "",
    twelfthMarks: "",
    entranceExamRank: "",
    categoryRank: "",
    permanentAddress: "",
    friendsContactDetails: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getDoc(doc(db, "users", user.uid));
        setFormData((prevData) => ({ ...prevData, ...userData.data() }));
        // console.log(formData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    if (user) {
      fetchData();
    }

    return () => {
    };
  }, [user]);
  // console.log(user);
  const theme = createTheme({
    palette: {
      primary: {
        main: "#808080",
      },
      secondary: {
        main: "#808080",
      },
    },
  });
  const inputStyle = {
    margin: "10px",
    width: "360px",
  };
  const textFieldStyle = {
    width: "100%",
    // maxWidth: "80vw",
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO: Handle form submission (e.g., send data to backend)
    try{
      const colRef = doc(db, "users", user.uid);
      setLoading(true);
      await updateDoc(colRef, formData);
      setLoading(false);
    }catch(err){
      console.log(err);
    }
    // console.log("Form data submitted:", formData);
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{ width: "800px", maxWidth: "90vw", margin: "auto" }}
          elevation={3}
        >
          <h1 style={{ textAlign: "center" }}>Profile</h1>
          <form
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
            }}
            onSubmit={handleSubmit}
          >
            <div style={inputStyle}>
              <Typography variant="body1">Name</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                onChange={handleChange("name")}
                disabled
                value={formData.name}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">IITK Email</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                onChange={handleChange("email")}
                value={formData.email}
                sx={textFieldStyle}
                disabled
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">IITK Roll No.</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                onChange={handleChange("rollNumber")}
                value={formData.rollNumber}
                sx={textFieldStyle}
                disabled
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Department</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.department}
                onChange={handleChange("department")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Secondary Department</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.secondaryDepartment}
                onChange={handleChange("secondaryDepartment")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Program</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.program}
                onChange={handleChange("program")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Secondary Program</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.secondaryProgram}
                onChange={handleChange("secondaryProgram")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Specialisation</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.specialisation}
                onChange={handleChange("specialisation")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Preference</Typography>
              {/* <TextField
              required
              id="filled-required"
              defaultValue=""
              variant="filled"
              onChange={handleChange("preference")}
              sx={textFieldStyle}
            ></TextField> */}
              <FormControl sx={textFieldStyle}>
                {/* <InputLabel>Gender</InputLabel> */}
                <Select
                  value={formData.preference}
                  onChange={handleChange("preference")}

                >
                  <MenuItem value="male">Industrial</MenuItem>
                  <MenuItem value="female">Academic</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Gender</Typography>
              <FormControl sx={textFieldStyle}>
                {/* <InputLabel>Gender</InputLabel> */}
                <Select
                  value={formData.gender}
                  onChange={handleChange("gender")}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Date of Birth</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                type="date"
                value={formData.dob}
                onChange={handleChange("dob")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Contact Number</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.contactNumber}
                onChange={handleChange("contactNumber")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Current CPI</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.currentCPI}
                onChange={handleChange("currentCPI")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Tenth Board</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.tenthBoard}
                onChange={handleChange("tenthBoard")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Tenth Marks</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.tenthMarks}
                onChange={handleChange("tenthMarks")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Tenth Board Year</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.tenthBoardYear}
                onChange={handleChange("tenthBoardYear")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Twelfth Board</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.twelfthBoard}
                onChange={handleChange("twelfthBoard")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Twelfth Marks</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.twelfthMarks}
                onChange={handleChange("twelfthMarks")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Twelfth Board Year</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.twelfthBoardYear}
                onChange={handleChange("twelfthBoardYear")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Entrance Exam</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.entranceExam}
                onChange={handleChange("entranceExam")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Entrance Exam Rank</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.entranceExamRank}
                onChange={handleChange("entranceExamRank")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Category</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.category}
                onChange={handleChange("category")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Category Rank</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.categoryRank}
                onChange={handleChange("categoryRank")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Disability</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.disability}
                onChange={handleChange("disability")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Current Address</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.currentAddress}
                onChange={handleChange("currentAddress")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Permanent Address</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.permanentAddress}
                onChange={handleChange("permanentAddress")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Friends Name</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.friendsName}
                onChange={handleChange("friendsName")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Friends Contact Details</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.friendsContactDetails}
                onChange={handleChange("friendsContactDetails")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Expected Graduation Year</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.expectedGraduationYear}
                onChange={handleChange("expectedGraduationYear")}
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Personal Email</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.personalEmail}
                onChange={handleChange("personalEmail")}
                sx={textFieldStyle}
              ></TextField>
            </div>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              padding: "10px",
              paddingRight: "20px",
              width: "100%",
            }}
          >
            <Button
              onClick={handleSubmit}
              variant="contained"
              type="submit"
              sx={{backgroundColor:"green", "&:hover": { backgroundColor: "#008000de" }}}
              disabled={loading}
            >
              Update
            </Button>
          </div>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Profile;
