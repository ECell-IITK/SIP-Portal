import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Paper, Button } from "@mui/material";
import { collection, onSnapshot, query } from "firebase/firestore";

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
      main: "#3d52a0",
    },
    secondary: {
      main: "#3d52a0",
    },
  },
});

export const Proformas = () => {
    const [proformaList,setProformaList] = useState([]);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const colRef = collection(db,"proforma");
            const q = query(colRef);
            const unsub = onSnapshot(q,(snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    return {...doc.data(),id:doc.id}
                })
                setProformaList(data);
                setLoading(false);
            })
        }
        fetchData();
        return () => {
            setProformaList([]);
            // unsub();
        }
    },[])
    const columns = [
        { field: "jobTitle", headerName: "Job Title", minWidth: 100,flex:1 },
        { field: "companyName",headerName:"Company Name",minWidth:100,flex:1},
        { field: "createdAt", headerName: "Created At", minWidth: 100,flex:1,
        renderCell: (params) => (
            <div>
                {new Date(params.row.createdAt?.seconds * 1000).toLocaleDateString()}
            </div>
        )
        },
        {
          field: "actions",
          headerName: "Actions",
          minWidth: 100,
          flex:1,
          renderCell: (params) => (
            <div>
              <Button
                onClick={() => navigate(`/admin/proforma/${params.row.id}`)}
              >
                View
              </Button>
            </div>
          ),
        },
      ];
  return (
    <>
    <Paper elevation={0} sx={{backgroundColor:"#f3f6f9",width:"100%" }}>
        <h1 style={{textAlign:"center"}}>Proformas</h1>
        <ThemeProvider theme={theme}>
        <div>
          <DataGrid
            rows={proformaList}
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
              maxWidth:"90vw",
              minHeight: "300px",
            }}
          />
        </div>
      </ThemeProvider>
      </Paper> 

    </>
  );
};

export default Proformas;
