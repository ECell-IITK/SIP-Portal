import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, getDocs, collection, where } from "@firebase/firestore";
import { Box, Paper, Typography } from "@mui/material";
import ReactHtmlParser from "react-html-parser";
import { useUserAuth } from "./contexts/userAuthContext";

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

const ProformaPage = ({ id }) => {
  // console.log("new page")
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [proformaData, setProformaData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getDoc(doc(db, "proforma", id));
      setProformaData(res.data());
      // console.log(res.data());
      setLoading(false);
    };
    fetchData();
    return () => {
      // setProformaData({});
    };
  }, [user]);

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
    </div>
  );
};

export default ProformaPage;
