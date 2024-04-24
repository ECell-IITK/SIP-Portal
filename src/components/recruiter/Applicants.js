import {
  Box,
  Button,
  List,
  TextField,
  ListItemText,
  ListItem,
  ListItemButton,
  Modal,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridSortApi,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  onSnapshot,
  deleteDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from "react-html-parser";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../firebase";
import { useUserAuth } from "../contexts/userAuthContext";
import { array } from "prop-types";
const defaultTheme = createTheme();

const CustomToolbar = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <div>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
        <GridToolbarExport />
    </div>
    <div>
      <GridToolbarQuickFilter />
    </div>
    {/* Add more custom buttons or components here */}
  </div>
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#808080",
    },
    secondary: {
      main: "#0000",
    },
  },
});

const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
    { field: "jobOpening", headerName: "Applied for", width: 200 },
  {
    field: "resumeLink",
    headerName: "Resume Link",
    width: 200,
    renderCell: (params) => (
      <div>
        <Button
          variant="contained"
          color="primary"
          href={params.row.resumeLink}
          target="_blank"
        >
          View Resume
        </Button>
      </div>
    ),
  },
];

const Applicants = () => {
  const [rows, setRows] = useState([]);
  const { user } = useUserAuth();
  useEffect(() => {
    if (!user) return;
    let index = 0;
    const fetchData = async () => {
      const userData = await getDoc(doc(db, "users", user.uid));
      const companyName = userData.data().companyName;
      const q = query(
        collection(db, "appliedJobList"),
        where("companyNames", "array-contains", companyName)
      );
      const querySnapshot = await getDocs(q);
      setRows(
        function () {

            let data = []
            let newTransformedData = []
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                let jobOpening = doc.id
                let temp = doc.data().data
                data.push(temp)
                temp.forEach((e) => {
                    let temp = {
                        id: index,
                        name: e.name,
                        email: e.email,
                        resumeLink: e.resumeLink,
                        jobOpening: jobOpening
                    }
                    index += 1
                    newTransformedData.push(temp)
                })
            })
            return newTransformedData
        }
      );
    };
    fetchData();
    console.log(rows);
    return () => {};
  }, [user]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{ width: "100vw", height: "100vh", maxWidth: "900px",minHeight:"fit-content",margin:"auto" }}
      >
        <h1 style={{textAlign:"center"}}>Applicants</h1>
        <ThemeProvider theme={theme}>
          <div style={{ padding: "10px", margin: "5px", width: "100%" }}>
            <DataGrid
            checkboxSelection
              rows={rows}
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
                height: "90vh",
              }}
            />
          </div>
        </ThemeProvider>
      </Paper>
    </>
  );
};

export default Applicants;
