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
    Typography,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { useUserAuth } from "../contexts/userAuthContext";
  import {
    DataGrid,
    GridToolbar,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
  } from "@mui/x-data-grid";
  import { createTheme, ThemeProvider } from "@mui/material/styles";

const ContactUs = () => {
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
      const columns = [
        {
          field: "name",
          headerName: "Name",
          minWidth: 100,
          flex:1
        },
        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex:1
        },
        {
            field: "phNumber",
            headerName: "Phone Number",
            minWidth: 130,
            flex:1
        }
    ]
    const rows = [
        {id: 1, name: "John Doe", email: "", phNumber: ""},
        {id: 2, name: "Jane Doe", email: "", phNumber: ""},
        {id: 3, name: "John Smith", email: "", phNumber: ""},
    ]
  return (
    <Paper
        elevation={0}
        sx={{
          margin: "auto",
          width: "100vw",
          maxWidth: "1000px",
          marginTop: "30px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Contact Us</h1>
        <ThemeProvider theme={theme}>
          <div>
            <h2 style={{textAlign:"center"}}>Heads</h2>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              slotProps={{
                
              }}
              sx={{
                padding: "10px",
                maxWidth: "1050px",
                width: "100%",
                margin: "auto",
                border:"0"
              }}
            />
            <h2 style={{textAlign:"center"}}>Senior Executives</h2>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              slotProps={{
                
              }}
              sx={{
                padding: "10px",
                maxWidth: "1050px",
                width: "100%",
                margin: "auto",
                border: "0",
              }}
            />
          </div>
        </ThemeProvider>
      </Paper>
  )
}

export default ContactUs
