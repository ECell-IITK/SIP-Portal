import {
  Box,
  Button,
  TextField,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import MUIRichTextEditor from "mui-rte";
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from "react-html-parser";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StyleRoot } from "radium";

// import {formatDate} from "../utils/formatDate";
const Notices = () => {
  const windowWidth = window.innerWidth;
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

  const handleNoticePost = async (e) => {
    e.preventDefault();
    console.log(heading, content);
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "notices"), {
        heading: heading,
        content: content,
        createdAt: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
      setLoading(false);
      //   setContent("");
      //   setHeading("");
    } catch (e) {
      console.log(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "notices"));
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "notices", id));
      console.log("Document successfully deleted!");
    } catch (e) {
      console.error("Error deleting document:", e.message);
    }
  };

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

  const getWidth = () => {
    if(window.innerWidth < 1000) return "95vw"
    else return "75vw"
  }

  const columns = [
    {
      field: "heading",
      headerName: "Title",
      minWidth: 200,
      flex:1,
      renderCell: (params) => (
        <div style={{ width: "100%",cursor:"pointer"}}>
          <div
            onClick={() => {
              handleOpen();
              setBoxContent(params.row.content);
            }}
            sx={{ width: "100%", textAlign: "left",}}
          >
            {params.row.heading}
          </div>
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
      field: "id",
      headerName: "Actions",
      minWidth: 100,
      flex:1,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleDelete(params.row.id)}>Delete </Button>
        </div>
      ),
    },
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
        {/* <GridToolbarColumnsButton />
        <GridToolbarFilterButton /> */}
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
  return (
    <>
      <Box>
        <form sx={{ height: "100%" }} onSubmit={handleNoticePost}>
          <TextField
            sx={{ width: "100%", margin: "5px" }}
            label="Title"
            variant="outlined"
            onChange={(e) => setHeading(e.target.value)}
            value={heading}
          />
          <ThemeProvider theme={defaultTheme}>
            <MUIRichTextEditor
              label="Write Content Here..."
              inlineToolbar={true}
              onChange={(value) => getHTMLData(value)}
              controls={[
                "title",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "highlight",
                "undo",
                "redo",
                "link",
                "media",
                "numberList",
                "bulletList",
                "quote",
                "code",
                "clear",
              ]}
            />
          </ThemeProvider>

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            <Button
              disabled={loading}
              variant="contained"
              sx={{ margin: "5px" }}
              type="submit"
            >
              Post
            </Button>
          </div>
        </form>
      </Box>
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
                margin: "auto",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                maxWidth: getWidth(),
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
