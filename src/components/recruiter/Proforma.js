import { Button, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import MUIRichTextEditor from "mui-rte";
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from "react-html-parser";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserAuth } from "../contexts/userAuthContext";
import { db } from "../firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export const Proforma = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [content, setContent] = useState("");
  const [stipend, setStipend] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUserAuth();
  // const defaultTheme = createTheme();
  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: "#808080",
      },
      secondary: {
        main: "#808080",
      },
    },
  });
  Object.assign(defaultTheme, {
    overrides: {
      MUIRichTextEditor: {
        root: {
          width: "100%",
          border: "1px solid gray",
          minHeight: "200px",
          height: "40vh",
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

  const getHTMLData = (value) => {
    stateToHTML(value.getCurrentContent());
    setContent(stateToHTML(value.getCurrentContent()));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobTitle, content, stipend, jobLocation);
    console.log(user);
    try{
      if(user){
        const userData = await getDoc(doc(db, "users", user.uid));
        console.log(userData.data());
        const proformaData = {
          jobTitle: jobTitle,
          content: content,
          stipend: stipend,
          jobLocation: jobLocation,
          companyName: userData.data().companyName,
          createdAt: serverTimestamp(),
        };
        const colRef = await addDoc(collection(db, "proforma"), proformaData);
        setLoading(false);
        setJobTitle("");
        setContent("");
        setJobLocation("");
        setStipend("");
      }else{
        console.log("user not found")
      }
    }catch(err){
      console.log(err.message);
    }
  };
  return (
    <>
      <Paper
        sx={{ width: "100%", maxWidth: "900px", margin: "auto" }}
        elevation={3}
      >
        <h1 style={{ textAlign: "center" }}>Proforma Form</h1>
        <form style={{ padding: "10px" }} onSubmit={handleSubmit}>
          <ThemeProvider theme={defaultTheme}>
            <TextField
              sx={{ width: "100%", margin: "5px" }}
              label="Job Title - Company Name"
              variant="outlined"
              onChange={(e) => setJobTitle(e.target.value)}
              value={jobTitle}
            />
            <MUIRichTextEditor
              label="Write Complete Job Description Here..."
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
            <div style={{ display: "flex", flexDirection: "row" }}>
              <TextField
                sx={{ flex: "1", margin: "5px" }}
                label="Stipend Description"
                variant="outlined"
                onChange={(e) => setStipend(e.target.value)}
                value={stipend}
              />
              <TextField
                sx={{ flex: "1", margin: "5px" }}
                label="Job Location"
                variant="outlined"
                onChange={(e) => setJobLocation(e.target.value)}
                value={jobLocation}
              />
            </div>
          </ThemeProvider>
          <Button
            type="submit"
            variant="contained"
            sx={{
              margin: "5px",
              backgroundColor: "green",
              "&:hover": { backgroundColor: "green" },
            }}
          >
            {" "}
            Submit New Proforma
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default Proforma;
