import {
    Box,
    Button,
    Modal,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import {
    DataGrid,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
    GridToolbarColumnsButton,
  } from "@mui/x-data-grid";
  import {
    doc,
    collection,
    query,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "../firebase";
  import { stateToHTML } from "draft-js-export-html";
  import ReactHtmlParser from "react-html-parser";
  import { createTheme, ThemeProvider } from "@mui/material/styles";
  import Radium, { StyleRoot } from "radium";
  
  // import {formatDate} from "../utils/formatDate";
  export const Notices = () => {
    const defaultTheme = createTheme();
    const [heading, setHeading] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [boxContent, setBoxContent] = useState("");
    const [noticeList, setNoticeList] = useState([]);
  
    Object.assign(defaultTheme, {
      overrides: {
        MUIRichTextEditor: {
          root: {
            width: "100%",
            border: "1px solid gray",
            minHeight: "200px",
            height: "100%",
            margin: "5px",
            borderRadius: "4px",
            paddingLeft: "10px",
            paddingRight: "10px",
          },
          editor: {
            //   borderBottom: "1px solid gray",
          },
        },
      },
    });
  
  
    useEffect(() => {
      const q = query(collection(db, "noticesRecruiter"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        console.log(data);
        setNoticeList(data);
      });
  
      return () => {
        // cleanup
        setContent("");
        setHeading("");
        setNoticeList([]);
        unsubscribe();
      };
    }, []);
  
  
    const getHTMLData = (value) => {
      stateToHTML(value.getCurrentContent());
      setContent(stateToHTML(value.getCurrentContent()));
    };
  
    const styleNoticeList = {
      padding: "10px",
      margin: "5px",
      width: "100%",
      // "@media (max-width: 500px)": {
      //   flexDirection: "column",
      // },
    };
  
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
      maxWidth: "90%",
      bgcolor: "background.paper",
      border: "1px solid lightgrey",
      borderRadius: "5px",
      boxShadow: 24,
      p: 4,
    };
  
    const columns = [
      {
        field: "heading",
        headerName: "Title",
        width: 800,
        renderCell: (params) => (
          <div style={{ width: "100%" }}>
            <Button
              onClick={() => {
                handleOpen();
                setBoxContent(params.row.content);
              }}
              sx={{ width: "100%", textAlign: "left" }}
            >
              {params.row.heading}
            </Button>
          </div>
        ),
      },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 200,
        renderCell: (params) => (
          <div>
            {new Date(params.row.createdAt?.seconds * 1000).toLocaleDateString()}
          </div>
        ),
      }
    ];
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
          main: "#0000",
        },
      },
    });
    return (
      <>
        <ThemeProvider theme={theme}>
          <StyleRoot>
            <div style={styleNoticeList}>
              <DataGrid
                rows={noticeList}
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
                  height :"90vh"
                }}
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>{ReactHtmlParser(boxContent)}</Box>
              </Modal>
            </div>
          </StyleRoot>
        </ThemeProvider>
      </>
    );
  };
  
  export default Notices;
  