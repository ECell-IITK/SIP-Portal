import React from "react";
import { Paper, Box, TextField } from "@mui/material";
import { useUserAuth } from "../contexts/userAuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export const Profile = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useUserAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getDoc(doc(db, "users", user.uid));
        setFormData(userData.data());
        setLoading(false);
        // console.log(userData.data());
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }

    // Cleanup function
    return () => {
      // Your cleanup logic here, if needed
    };
  }, [user]);
  const boxStyle = {
    margin: "10px",
    width:"400px",
  };
  return (
    <Paper sx={{ width: "100%", maxWidth: "900px",margin:"auto" }} elevation={3}>
      <h1 style={{ textAlign: "center" }}>Profile</h1>
      <Box >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Box sx={{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"}}>
            <TextField
              label="Name"
              defaultValue={formData.companyName}
              variant="standard"
              sx={boxStyle}
              disabled
            />
            <TextField
              label="Email"
              defaultValue={formData.email}
              variant="standard"
              sx={boxStyle}
              disabled
            />
            <TextField
              label="Designation"
              defaultValue={formData.designation}
              variant="standard"
              sx={boxStyle}
              disabled
            />
            <TextField
              label="Contact Number"
              defaultValue={formData.contactNumber}
              variant="standard"
              sx={boxStyle}
              disabled
            />
            <TextField
              label="Company Name"
              defaultValue={formData.companyName}
              variant="standard"
              sx={boxStyle}
              disabled
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Profile;
