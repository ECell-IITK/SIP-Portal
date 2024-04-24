import React, { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/userAuthContext";
import { db } from "../firebase";
import { doc, getDoc, getDocs, collection, where } from "@firebase/firestore";
import { Paper, Box, Typography, Container } from "@mui/material";
import ReactHtmlParser from "react-html-parser";

export const Proformas = () => {
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [proformaList, setProformaList] = useState([]);
  useEffect(() => {
    console.log(user);
    setLoading(true);
    
    const fetchData = async () => {
            if(user){
            const userData = await getDoc(doc(db, "users", user.uid));
            console.log(userData.data());
            const companyName = userData.data().companyName;
            const querySnapshot = await getDocs(
                collection(db, "proforma"),
                where("companyName", "==", companyName)
                );
                const proformasData = querySnapshot.docs.map((doc) => doc.data());
                console.log(proformasData);
                setProformaList(proformasData);
                setLoading(false);
            };
        }
    fetchData();
    return () => {
      console.log("starting fetching data of company's proformas");
    };
  }, [user]);
  return (
    <>
      <Paper
        elevation={3}
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
          <div>
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
                </Container>
              ))
            )}
          </div>
        )}
      </Paper>
    </>
  );
};

export default Proformas;