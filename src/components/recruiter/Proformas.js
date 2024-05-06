import React, { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/userAuthContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  onSnapshot,
  query,
} from "@firebase/firestore";
import { Paper, Box, Typography, Container, Button } from "@mui/material";
import ReactHtmlParser from "react-html-parser";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
      main: "#808080",
    },
    secondary: {
      main: "#808080",
    },
  },
});

export const Proformas = () => {
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [proformaList, setProformaList] = useState([]);
  const navigate = useNavigate();

  const requiredBranches = (validBranches) => {
    // const { AE, CE, CSE, BSBE, EE, MSE, CHE, ME, MTH, PHY, CHM, ECO, ES, SDS,CGS,DES,IME,MSP,NET,PSE,Stats,HSS,Mathematics,SEE,SSA } = validBranches;
    const branchList = [
      "AE",
      "BSBE",
      "CE",
      "CHE",
      "CSE",
      "EE",
      "MSE",
      "ME",
      "CHM",
      "ECO",
      "ES",
      "MTH",
      "SDS",
      "PHY",
      "CGS",
      "DES",
      "IME",
      "MSP",
      "NET",
      "PSE",
      "Stats",
      "HSS",
      "Mathematics",
      "SEE",
      "SSA",
    ];
    // const branchesInBool = [ AE,CE,CSE,BSBE,EE,MSE, CHE,ME,MTH,PHY,CHM,ECO,ES,SDS,CGS,DES,IME,MSP,NET,PSE,Stats,HSS,Mathematics,SEE,SSA]
    let branches = [];
    for (let i = 0; i < branchList.length; i++) {
      if (validBranches[branchList[i]]) {
        branches.push(branchList[i]);
      }
    }
    return branches;
  };

  useEffect(() => {
    console.log(user);
    setLoading(true);

    const fetchData = async () => {
      if (user) {
        const userData = await getDoc(doc(db, "users", user.uid));
        console.log(userData.data());
        const companyName = userData.data().companyName;
        const querySnapshot = await getDocs(
          collection(db, "proforma"),
          where("companyName", "==", companyName)
        );
        const proformasData = querySnapshot.docs.map((doc) => {
          return {...doc.data(),id:doc.id}
      });
        console.log(proformasData);
        setProformaList(proformasData);
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      console.log("starting fetching data of company's proformas");
    };
  }, [user]);
  const columns = [
    { field: "jobTitle", headerName: "Job Title", minWidth: 100,flex:2 },
        // { field: "companyName",headerName:"Company Name",minWidth:100,flex:2},
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
                onClick={() => navigate(`/recruiter/proforma/${params.row.id}`)}
              >
                View
              </Button>
            </div>
          ),
        }
  ];
  const rows = [];
  return (
    <>
      <Paper
        elevation={0}
        style={{
          padding: "10px",
          margin: "auto",
          width: "100%",
          maxWidth: "900px",
          
        }}
      >
        <h1 style={{ textAlign: "center" }}>Proformas</h1>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            {/* <div>
              {proformaList.length === 0 ? (
                <h1>No proformas yet</h1>
              ) : (
                proformaList.map((data, index) => (
                  <Container
                    key={index}
                    sx={{
                      // border: "1px solid grey",
                      backgroundColor: "#f3f6f9",
                      borderRadius: "5px",
                      padding: "5px",
                      margin: "5px",
                    }}
                  >
                    <h2
                      style={{
                        textAlign: "center",
                        margin: "5px",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      {data.jobTitle}
                    </h2>

                    <Typography
                      sx={{
                        //   border: "0.5px solid grey",
                        margin: "5px",
                        padding: "5px",
                        borderRadius: "5px",
                        backgroundColor: "white",
                      }}
                    >
                      <h6>Job Description</h6>
                      {ReactHtmlParser(data.content)}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                      }}
                    >
                      <div
                        style={{
                          flex: "1",
                          // border: "0.5px solid grey",
                          margin: "5px",
                          padding: "5px",
                          borderRadius: "5px",
                          backgroundColor: "white",
                        }}
                      >
                        <h6>Job Location</h6>
                        {data.jobLocation}
                      </div>
                      <div
                        style={{
                          flex: "1",
                          // border: "0.5px solid grey",
                          margin: "5px",
                          padding: "5px",
                          borderRadius: "5px",
                          backgroundColor: "white",
                        }}
                      >
                        <h6>Stipend</h6>
                        {data.stipend}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        flexWrap: "wrap",
                        backgroundColor: "white",
                        margin: "5px",
                        padding: "5px",
                      }}
                    >
                      <h6>Eligible Branches</h6>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: "5px",
                        }}
                      >
                        {console.log(requiredBranches(data.validBranches))}
                        {requiredBranches(data.validBranches).map((branch) => (
                          <div style={{}}>{branch}</div>
                        ))}
                      </div>
                    </div>
                  </Container>
                ))
              )}
            </div> */}
            <div>
              
                {/* <h1 style={{ textAlign: "center" }}>Proformas</h1> */}
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
                        maxWidth: "90vw",
                        minHeight: "300px",
                      }}
                    />
                  </div>
                </ThemeProvider>
            </div>
          </>
        )}
      </Paper>
    </>
  );
};

export default Proformas;
