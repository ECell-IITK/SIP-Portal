import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "@firebase/firestore";
import { Button, Paper, Typography } from "@mui/material";
import ReactHtmlParser from "react-html-parser";
import { useUserAuth } from "../contexts/userAuthContext";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

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
const branchListNames = [
  "Aerospace",
  "Biosciences and Bioengineering",
  "Civil",
  "Chemical",
  "Computer Science",
  "Electrical",
  "Materials Science and Engineering",
  "Mechanical",
  "Chemistry",
  "Economics",
  "Earth Sciences",
  "Mathematics",
  "Statistics and Data Science",
  "Physics",
  "Cognitive Science",
  "Design",
  "Industrial and Management Engineering",
  "Mathematical Sciences",
  "Nuclear Engineering and Technology",
  "Physics",
  "Statistics",
  "Humanities and Social Sciences",
  "Mathematics",
  "Sustainable Energy Engineering",
  "Smart and Sustainable Automation",
];

const requiredBranches = (validBranches) => {
  // console.log(validBranches);
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
  // const branchesInBool = Object.keys(validBranches).map((key) => validBranches.key);
  // const branchesInBool = [ "AE","BSBE","CE","CHE","CSE","EE","MSE","ME","CHM","ECO","ES","MTH","SDS","PHY","CGS","DES","IME","MSP","NET","PSE","Stats","HSS","Mathematics","SEE","SSA"]
  let branches = [];
  for (let i = 0; i < branchList.length; i++) {
    if (validBranches[branchList[i]]) {
      branches.push(branchList[i]);
    }
  }
  // console.log(branches)
  return branches;
};

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
};

export const ProformaPage = ({ id }) => {
  const [validBranches, setValidBranches] = useState(initialBranchesState);
  const handleChange = (event) => {
    setValidBranches((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.checked,
      };
    });
    console.log({
      ...validBranches,
      [event.target.name]: event.target.checked,
    });
  };
  // console.log("new page")
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [message,setMessage] = useState("");
  const [proformaData, setProformaData] = useState({});

  useEffect(() => {
    // const q = query(collection(db, "notices"));
    const unsubscribe = onSnapshot(doc(db,"proforma",id), (res) => {
      setProformaData(res.data());
      setValidBranches(res.data().validBranches);
    });

    return () => {
      // cleanup
      unsubscribe();
    };
  }, []);

  const handleUpdateofBranchEligibility = async () => {
      const updateRef = doc(db,"proforma",id);
      setLoading(true);
      try{
        await updateDoc(updateRef,{
          validBranches: validBranches,
        });
        setMessage("Branches Updated Successfully");
        setLoading(false);
      }catch(err){
        console.log(err.message);
        setMessage("Failed to update branches");
        setLoading(false);
      }
  }
  return (
    <div>
      {/* {id} */}
      <Paper
        elevation={3}
        sx={{
          // border: "1px solid grey",
          backgroundColor: "#f3f6f9",
          borderRadius: "5px",
          padding: "5px",
          margin: "auto",
          width: "100%",
          maxWidth: "900px",
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
          {proformaData.jobTitle}
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
          {ReactHtmlParser(proformaData.content)}
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
            {proformaData.jobLocation}
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
            {proformaData.stipend}
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
            {proformaData.validBranches
              ? requiredBranches(proformaData.validBranches).map(
                  (branch, index) => (
                    <div key={index} style={{}}>
                      {branch}
                    </div>
                  )
                )
              : "All Branches"}
          </div>
        </div>
      </Paper>
      <Paper elevation={3} sx={{ 
          backgroundColor: "#f3f6f9",
          borderRadius: "5px",
          padding: "5px",
          margin: "auto",
          marginTop: "10px",
          width: "100%",
          maxWidth: "900px", }}>
        <div style={{ margin: "5px" }}>
          <FormControl>
            <FormLabel component="legend">Eligible branches</FormLabel>
            <FormGroup
              sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
            >
              {branchList.map((branch, index) => (
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
            </FormGroup>
          </FormControl>
        </div>
        <Button disabled={loading} type="submit" variant="contained" sx={{ margin: "5px" }} onClick={handleUpdateofBranchEligibility}>
          Update Eligibility 
        </Button>
      </Paper>
    </div>
  );
};

export default ProformaPage;
