import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, getDocs, collection, where } from "@firebase/firestore";
import { Box, Paper, Typography } from "@mui/material";
import ReactHtmlParser from "react-html-parser";

const ProformaPage = ({ id }) => {
  // console.log("new page")
  const [loading, setLoading] = useState(false);
  const [proformData, setProformaData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getDoc(doc(db, "proforma", id));
      setProformaData(res.data());
      console.log(res.data());
      setLoading(false);
    };
    fetchData();
    return () => {
      setProformaData({});
    };
  }, []);
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
          maxWidth:"900px"
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
          {proformData.jobTitle}
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
          {ReactHtmlParser(proformData.content)}
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
            {proformData.jobLocation}
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

            {proformData.stipend}
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default ProformaPage;
