import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, getDocs, collection, where } from "@firebase/firestore";
import { 
    Button,
    Paper, } from "@mui/material";
import {
    DataGrid,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
  } from "@mui/x-data-grid";
  import { createTheme, ThemeProvider } from "@mui/material/styles";
  const columns = [
    {field:"name",headerName:"Name",minWidth:150,flex:1},
    {field:"email",headerName:"Email",minWidth:150,flex:2},
    {field:"resumeLink",headerName:"Resume Link",minWidth:200,flex:1,renderCell: (params) => (<a href={params.row.resumeLink}>{params.row.resumeLink}</a>)},
    {field:"ResumeLink",headerName:"Resume",minWidth:100,flex:1,
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
]

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

export const Applicants = ({id}) => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [applicants, setApplicants] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          const res = await getDoc(doc(db, "appliedJobList", id));
        //   setRows((prev) => [...prev, {...res.data().data,id:res.id}]);
        const data = res.exists() ? res.data().data : [];
        setRows(data);
          console.log(res.data());
          setLoading(false);
        };
        fetchData();
        return () => {
          setApplicants({});
          setRows([]);
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
    
  return (
    <>
        <Paper
        elevation={0}
        sx={{ width: "100vw", height: "100vh", maxWidth: "900px",minHeight:"fit-content",margin:"auto" }}
      >
        <h1 style={{textAlign:"center"}}>Applicants for {id}</h1>
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
  )
}

export default Applicants
