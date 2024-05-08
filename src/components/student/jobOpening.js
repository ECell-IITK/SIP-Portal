import {
  Paper,
  TextField,
  FormControl,
  Select,
  formData,
  MenuItem,
  Autocomplete,
  Button,
  Alert,
  InputLabel,
  Modal,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/userAuthContext";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  addDoc,
  query,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  DataGrid,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export const JobOpening = () => {
  const [userName, setUserName] = useState("");
  const [heading, setHeading] = useState("");
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobSelected, setJobSelected] = useState({});
  const [JobOpeningList, setJobOpeningList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [resumeSelected, setResumeSelected] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resumeList, setResumeList] = useState([]);
  const [appliedJobList, setAppliedJobList] = useState([]);
  const [recruitedStatus, setRecruitedStatus] = useState("pending");
  const [department, setDepartment] = useState("");
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  let givenTime =null,currentTime = new Date();
  const handleOpen = (data) => {
    console.log(data);
    setJobSelected(data);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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
  //   const [userData, setUserData] = useState({});
  useEffect(() => {
    // console.log(user)
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapShot = await getDocs(collection(db, "proforma"));
        const data = querySnapShot.docs.map((doc) => {
          return { label: doc.data().jobTitle, id: doc.id };
        });
        setJobList(data);
        const userData = await getDoc(doc(db, "users", user.uid));
        setRecruitedStatus(userData.data().recruitedStatus);
        const resumeLinks = await getDoc(doc(db, "resumeLinks", userData.data().rollNumber));
        console.log(resumeLinks.data().data || [])
        setResumeList(resumeLinks.data().data.filter((item) => item.verified) || [] );
        setAppliedJobList(userData.data().appliedJobList || []);
        setDepartment(userData.data().department || "");
        setUserName(userData.data().name);
        setLoading(false);
        // console.log(data);
      } catch (err) {     
        // console.log(err.message);
      }
    };
    // console.log(user);
    fetchData();
  }, [user]);
  useEffect(() => {
    const q = query(collection(db, "jobOpenings"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      console.log(data);
      setJobOpeningList(data);
    });
    return () => {
      setJobOpeningList([]);
      unsubscribe();
    };
  }, []);

  const CustomToolbar = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div>
        <GridToolbarQuickFilter />
      </div>
      {/* Add more custom buttons or components here */}
    </div>
  );

  function handleProformaClick(id) {
    console.log(id);
    navigate(`/student/proforma/${id}`);
  }

  const handleResumeChange = async (item) => {
    // console.log(e.target.value);
    setResumeSelected(item);
    // setResumeSelected(e.target.value);
    console.log(resumeSelected);
  };

  const appliedOrTimeGone = (applied,timeNotGone) => {
    if(applied) return "Applied";
    if(timeNotGone) return "Timed Out"
    return "Apply"
  }
  
  const columns = [
    {
      field: "heading",
      headerName: "Title",
      minWidth: 100,
      flex:3,
      renderCell: (params) => (
        <div style={{ width: "100%" }}>{params.row.heading}</div>
      ),
    },

    {
      field: "id",
      headerName: "Proforma Link",
      minWidth: 100,
      flex:1,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleProformaClick(params.row.porformaID)}>
            {params.row.jobTitle}
          </Button>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      minWidth: 100,
      flex:1,
      renderCell: (params) => (
        <div>
          {new Date(params.row.createdAt?.seconds * 1000).toLocaleDateString()}
        </div>
      ),
    },
    {
      field: "apply",
      headerName: "Apply",
      minWidth: 100,
      flex:1,
      renderCell: (params) => {
        givenTime = new Date(params.row.deadline)
        return (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen(params.row)}
            disabled={appliedJobList.includes(params.row.jobTitle) || (givenTime<=currentTime)}
          >
           {appliedOrTimeGone(appliedJobList.includes(params.row.jobTitle),(givenTime<=currentTime))}
          </Button>
        </div>
      )},
    },
  ];

  const handleJobApplySubmit = async () => {
    try {
      const jobTitle = jobSelected.jobTitle;
      const companyName = jobSelected.companyName;
      const dataNeeded = await getDoc(doc(db,"proforma",jobSelected.porformaID));
      const getJob = await getDoc(doc(db, "appliedJobList", jobTitle));
      const validBranches = dataNeeded.data().validBranches;
      const numberPart = resumeSelected.match(/(\d+)\.pdf$/);
      const numericValue = parseInt(numberPart[1], 10) - 1;
      const resumeData = resumeList[numericValue];

      if (resumeData && resumeData.verified === false) {
        setError("Resume not verified");
        return;
      }
      if(!validBranches[department]){
        setError("You are not eligible for this job - branch mismatch");
        return;
      }
      const appliedList = [...appliedJobList, jobTitle];
      setAppliedJobList(appliedList)
      if (getJob.exists()) {
        const data = getJob.data();
        const newCompanyNames = [...data.companyNames, companyName];
        const newData = [
          ...data.data,
          {
            email: user.email,
            name: userName,
            companyName : companyName,
            resumeLink: resumeData.link,
          },
        ];
        await updateDoc(doc(db, "appliedJobList", jobTitle), { data: newData, companyNames: newCompanyNames });
        // it should be technically companyName instead of companyNames but fine for now
        await updateDoc(doc(db, "users", user.uid), {
          appliedJobList: appliedList,
        });
        setMessage("Applied Successfully");
        handleClose();
      } else {
        await setDoc(doc(db, "appliedJobList", jobTitle), {
          data: [
            {
              email: user.email,
              name: userName,
              companyName : companyName,
              resumeLink: resumeData.link,
            },
          ],
          companyNames: [companyName],
        });
        await updateDoc(doc(db, "users", user.uid), {
          appliedJobList: appliedList,
        });
        setMessage("Applied Successfully");
        handleClose();
      }
    } catch (error) {
      // console.error("Error updating appliedJobList:", error.message);
      setError("Error applying for the job");
    }
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          Applying for {jobSelected.jobTitle}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select Resume</InputLabel>
            <Select
              sx={{ width: "200px" }}
              label="Select Resume"
              value={resumeSelected}
              onChange={(e) => setResumeSelected(e.target.value)}
            >
              <MenuItem value="">Select</MenuItem>
              {resumeList.map((item, index) => (
                <MenuItem key={index} value={item.fileName}>
                  {item.fileName}
                </MenuItem>
              ))}
            </Select>
            <Button onClick={handleJobApplySubmit}>Submit</Button>
          </FormControl>
        </Box>
      </Modal>
      <Alert
        severity="error"
        sx={{
          display: error ? "block" : "none",
          width: "100%",
          maxWidth: "300px",
          margin: "auto",
        }}
      >
        {error}
      </Alert>
      <Alert
        severity="success"
        sx={{
          display: message ? "block" : "none",
          width: "100%",
          maxWidth: "300px",
          margin: "auto",
        }}
      >
        {message}
      </Alert>
      {recruitedStatus!="pending" && (<Paper
        elevation={0}
        sx={{
          margin: "auto",
          width: "100%",
          maxWidth: "1000px",
          marginTop: "30px",
        }}
      >
        <h2 style={{textAlign:"center"}}>Congratulations!!!</h2>
        <h3 style={{textAlign:"center"}}>You have been recruited</h3>
        <p style={{textAlign:"center"}}>recruitedStatus</p>
      </Paper>)}
      {recruitedStatus === "pending" && (<Paper
        elevation={0}
        sx={{
          margin: "auto",
          width: "100%",
          maxWidth: "1000px",
          marginTop: "30px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Job Openings</h1>
        <ThemeProvider theme={theme}>
          <div>
            <DataGrid
              rows={JobOpeningList}
              columns={columns}
              pageSize={5}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              sx={{
                padding: "10px",
                maxWidth: "1050px",
                width: "100%",
                margin: "auto",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            />
          </div>
        </ThemeProvider>
      </Paper>)}
    </>
  );
};

export default JobOpening;
