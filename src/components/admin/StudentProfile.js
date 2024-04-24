import React,{useState, useEffect} from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
import { db } from "../firebase";
import { collection, getDocs, query, where, updateDoc, doc, onSnapshot, getDoc } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { useUserAuth } from '../contexts/userAuthContext';
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
export const StudentProfile = ({id}) => {
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
            const userData = await getDoc(doc(db, "users", id));
            setFormData((prevData) => ({ ...prevData, ...userData.data() }));
            // console.log(formData);
          } catch (error) {
            console.error("Error fetching data:", error.message);
          }
        };
          fetchData();
    
        return () => {
        };
      }, []);
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
          >
            <div style={inputStyle}>
              <Typography variant="body1">Name</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
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
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Preference</Typography>
              <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.preference}
                sx={textFieldStyle}
              ></TextField>
              <FormControl sx={textFieldStyle}>
              </FormControl>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Gender</Typography>
              <FormControl sx={textFieldStyle}>
                <TextField
                required
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.gender}
                sx={textFieldStyle}
              ></TextField>
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
                sx={textFieldStyle}
              ></TextField>
            </div>
            <div style={inputStyle}>
              <Typography variant="body1">Alternate Contact Number</Typography>
              <TextField
                id="filled-required"
                defaultValue=""
                variant="filled"
                value={formData.alternateContactNumber}
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
                sx={textFieldStyle}
              ></TextField>
            </div>
          </form>
        </Paper>
      </ThemeProvider>
    </>
  )
}

export default StudentProfile
