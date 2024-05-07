import {
  Paper,
  TextField,
  FormControl,
  Autocomplete,
  Button,
  Modal,
  Alert,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/userAuthContext";
import {
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  DataGrid,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { get } from "firebase/database";
const JobOpening = () => {
  const [heading, setHeading] = useState("");
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobSelected, setJobSelected] = useState(null);
  const [JobOpeningList, setJobOpeningList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [jobSelectedId,setJobSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useUserAuth();
  const [dateTimeValue, setDateTimeValue] = React.useState(
    dayjs("2024-04-17T15:30")
  );
  const [updatedDateTimeValue, setUpdatedDateTimeValue] = React.useState(
    dayjs("2024-04-17T15:30")
  );
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = (data) => {
    console.log(data);
    setJobSelectedId(data);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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

  useEffect(() => {
    // console.log(user)
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapShot = await getDocs(collection(db, "proforma"));
        const data = querySnapShot.docs.map((doc) => {
          return {
            label: doc.data().jobTitle,
            id: doc.id,
            companyName: doc.data().companyName,
          };
        });
        setJobList(data);
        setLoading(false);
        console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);
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
  // console.log(dateTimeValue.$d.toLocaleString())
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(heading, jobSelected);
    setError("");
    setMessage("");
    try {
      const docRef = await addDoc(collection(db, "jobOpenings"), {
        heading: heading,
        jobTitle: jobSelected.label,
        porformaID: jobSelected.id,
        createdAt: serverTimestamp(),
        studentList: [{}],
        companyName: jobSelected.companyName,
        deadline : dateTimeValue.$d.toLocaleString(),
      });
      console.log("Document written with ID: ", docRef.id);
      setMessage("Job posted successfully");
    } catch (err) {
      console.log(err.message);
      setError("Failed to post job");
    }
    setLoading(false);
  };

  const CustomToolbar = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div>
      </div>
      <div>
        <GridToolbarQuickFilter />
      </div>
      {/* Add more custom buttons or components here */}
    </div>
  );

  function handleProformaClick(id) {
    console.log(id);
    navigate(`/admin/proforma/${id}`);
  }
  function handleApplicantsClick(id) {
    console.log(id);
    navigate(`/admin/applicants/${id}`);
  }
  const handleUpdateDeadline = async () => {
    const updateRef = doc(db,"jobOpenings",jobSelectedId);
    setLoading(true);
    try{
      await updateDoc(updateRef,{
        deadline: updatedDateTimeValue.$d.toLocaleString(),
      });
      setMessage("Deadline Updated Successfully");
      setLoading(false);
    }catch(err){
      console.log(err.message);
      setMessage("Failed to update Deadline");
      setLoading(false);
    }
    handleClose();
  }
  const columns = [
    {
      field: "heading",
      headerName: "Title",
      minWidth: 200,
      flex:2,
      renderCell: (params) => (
        <div style={{ width: "100%" }}>{params.row.heading}</div>
      ),
    },

    {
      field: "id",
      headerName: "Proforma",
      minWidth: 200,
      flex:2,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleProformaClick(params.row.porformaID)}>
            {params.row.jobTitle}
          </Button>
        </div>
      ),
    },
    {
      field: "deadline",
      headerName: "Deadline",
      minWidth: 170,
      flex:1
    },
    {
      field: "applicants",
      headerName: "Applicants",
      minWidth: 100,
      flex:1,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleApplicantsClick(params.row.jobTitle)}>
            View
          </Button>
        </div>
      ),
    },
    {
      field:"updateDeadline",
      headerName:"Update Deadline",
      minWidth:100,
      flex:1,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleOpen(params.row.id)}>
            Update
          </Button>
        </div>
      )
    }
  ];
  const getWidth = () => {
    if(window.innerWidth > 1000){
      return "80vw";
    }else{
      return "95vw";
    }
  }
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

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <strong>Set New Deadline</strong>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                renderInput = {(params) => <TextField {...params} />}
                  value={updatedDateTimeValue}
                  onChange={(newValue) => setUpdatedDateTimeValue(newValue)}
                  label="Select Deadline"
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button onClick={handleUpdateDeadline}>Submit</Button>
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
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          margin: "auto",
          width: "100",
          maxWidth: "700px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Post New Job Opening</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{ width: "100%", margin: "5px" }}
            label="Heading"
            variant="outlined"
            onChange={(e) => setHeading(e.target.value)}
            value={heading}
          />
          <FormControl sx={{ width: "100%", maxWidth: "400px", margin: "5px" }}>
            <Autocomplete
              id="combo-box-demo"
              options={jobList}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Jobs" variant="standard" />
              )}
              value={jobSelected}
              onChange={(event, newValue) => setJobSelected(newValue)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                renderInput = {(params) => <TextField {...params} />}
                  value={dateTimeValue}
                  onChange={(newValue) => setDateTimeValue(newValue)}
                  label="Select Deadline"
                />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl>
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ margin: "5px" }}
            >
              Post
            </Button>
          </div>
        </form>
      </Paper>
      <Paper
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
                maxWidth: getWidth(),
                minHeight: "300px",
              }}
            />
          </div>
        </ThemeProvider>
      </Paper>
    </>
  );
};

export default JobOpening;
