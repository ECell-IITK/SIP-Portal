import { Button, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import MUIRichTextEditor from "mui-rte";
import { stateToHTML } from "draft-js-export-html";
import ReactHtmlParser from "react-html-parser";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useUserAuth } from "../contexts/userAuthContext";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FlareSharp } from "@mui/icons-material";

const branchList = ["AE","BSBE","CE","CHE","CSE","EE","MSE","ME","CHM","ECO","ES","MTH","SDS","PHY","CGS","DES","IME","MSP","NET","PSE","Stats","HSS","Mathematics","SEE","SSA"]
const branchListNames = ["Aerospace","Biosciences and Bioengineering","Civil","Chemical","Computer Science","Electrical","Materials Science and Engineering","Mechanical","Chemistry","Economics","Earth Sciences","Mathematics","Statistics and Data Science","Physics","Cognitive Science","Design","Industrial and Management Engineering","Mathematical Sciences","Nuclear Engineering and Technology","Physics","Statistics","Humanities and Social Sciences","Mathematics","Sustainable Energy Engineering","Smart and Sustainable Automation"]
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
    console.log(jobTitle, content, stipend, jobLocation,validBranches);
    console.log(user);
    try {
      if (user) {
        const userData = await getDoc(doc(db, "users", user.uid));
        console.log(userData.data());
        const proformaData = {
          jobTitle: jobTitle,
          content: content,
          stipend: stipend,
          jobLocation: jobLocation,
          companyName: userData.data().companyName,
          validBranches: validBranches,
          createdAt: serverTimestamp(),
        };
        const colRef = await addDoc(collection(db, "proforma"), proformaData);
        setLoading(false);
        setJobTitle("");
        setContent("");
        setJobLocation("");
        setStipend("");
        setValidBranches(initialBranchesState);
      } else {
        console.log("user not found");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  // "AE","BSBE","CE","CHE","CSE","EE","MSE","ME","CHM","ECO","ES","MTH","SDS","PHY","CGS","DES","IME","MSP","NET","PSE","Stats","HSS","Mathematics","SEE","SSA"
  const initialBranchesState = {
    AE: false,
    CE: false,
    CSE: false,
    BSBE: false,
    EE: false,
    MSE: false, 
    CHE: false,
    ME: false,
    MTH: false,
    PHY: false,
    CHM: false,
    ECO: false,
    ES: false,
    SDS: false,
    CGS: false,
    DES: false,
    IME: false,
    MSP: false,
    NET: false,
    PSE: false,
    Stats: false,
    HSS: false,
    Mathematics: false,
    SEE: false,
    SSA: false,
  }
  const [validBranches, setValidBranches] = useState(initialBranchesState);

  const handleChange = (event) => {
    setValidBranches({
      ...validBranches,
      [event.target.name]: event.target.checked,
    });
    
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
            <div style={{margin:"5px"}}>
              <FormControl>
                <FormLabel component="legend">Eligible branches</FormLabel>
                <FormGroup sx={{display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
                  {branchList.map((branch,index) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={validBranches[branch]}
                          onChange={handleChange}
                          name={branch}
                        />
                      }
                      label={branchListNames[index]}
                    />
                  ))}
                  {/* <FormControlLabel
                    control={
                      <Checkbox
                        checked={AE}
                        onChange={handleChange}
                        name="AE"
                      />
                    }
                    label="Aerospace"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={CE}
                        onChange={handleChange}
                        name="CE"
                      />
                    }
                    label="Civil"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={CSE}
                        onChange={handleChange}
                        name="CSE"
                      />
                    }
                    label="Computer Science"
                  /> */}
                </FormGroup>
                
              </FormControl>
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
