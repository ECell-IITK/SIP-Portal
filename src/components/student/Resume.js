import React, { useState, useEffect } from "react";
import { MuiFileInput } from "mui-file-input";
import {
  Box,
  Button,
  List,
  TextField,
  ListItemText,
  ListItem,
  ListItemButton,
  Modal,
  Alert,
} from "@mui/material";
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
import { useUserAuth } from "../contexts/userAuthContext";
import { storage, db } from "../firebase";
import { getDoc, doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import {
  uploadBytes,
  ref as sRef,
  listAll,
  getDownloadURL,
} from "firebase/storage";

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
const Resume = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeLinkList, setResumeLinkList] = useState([]); //[{}]
  const [requiredName, setRequiredName] = useState(""); //[{}]
  const [fileNameList, setFileNameList] = useState([]); //[{}
  const [rollNumber, setRollNumber] = useState(""); //[{}] // rollNumber
  const { user } = useUserAuth();
  const columns = [
    {
      field: "fileName",
      headerName: "Title",
      width: 600,
    },
    {
      field: "link",
      headerName: "Resume",
      width: 200,
      renderCell: (params) => (
        <div>
          <a
            href={params.row.link}
            style={{ textDecoration: "none", color: "grey" }}
            target="_blank"
          >
            Link
          </a>
        </div>
      ),
    },
    {
      field: "verified",
      headerName: "Verified",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.row.verified ? (
            <Button variant="error">Verified</Button>
          ) : (
            <Button variant="success">Not Verified</Button>
          )}
        </div>
      ),
    },
  ];
  const [rows, setRows] = useState([]);
  const handleChange = (newValue, info) => {
    setFile(newValue);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const userData = await getDoc(doc(db, "users", user.uid));
  //       // console.log(formData);
  //       setRollNumber(userData.data().rollNumber);
  //     } catch (error) {
  //       console.error("Error fetching data:", error.message);
  //     }
  //   };
  //   if (user) {
  //     fetchData();
  //   }

  //   return () => {
  //   };
  // }, [user]);
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (userData) => {
      const name = userData.data().name;
      let resumeNames = [];
      const rollNumber = userData.data().rollNumber;
      for (let i = 1; i <= 3; i++) {
        resumeNames.push(
          name.toLowerCase().replace(/ /g, "_") +
            "_" +
            rollNumber +
            "_" +
            i +
            ".pdf"
        );
      }
      console.log(resumeNames);
      setRequiredName(resumeNames[0]);
      const unsubscribeLinks = onSnapshot(
        doc(db, "resumeLinks", rollNumber),
        (resumeLinks) => {
          if (!resumeLinks.exists()) return;
          setResumeLinkList(resumeLinks.data().data);
          setRows(
            resumeLinks.data().data.map((item, index) => ({
              id: index + 1,
              fileName: item.fileName,
              link: item.link,
              verified: item.verified,
              verifiedStatus: item.verifiedStatus,
            }))
          );
          resumeLinks.data().data.map((item, index) => {
            resumeNames = resumeNames.filter((name) => name !== item.fileName);
          });
          setRequiredName(resumeNames[0]);
          console.log(resumeNames);
        }
      );
      return () => {
        unsubscribeLinks();
      };
    });
    return () => {
      unsubscribe();
    };
  }, [user]);
  const handleUploadFile = async () => {
    setError("");
    setMessage("");
    if (file === null) return;
    if (!user) {
      console.log("no user");
      return;
    }
    setLoading(true);
    const userData = await getDoc(doc(db, "users", user.uid));
    const name = userData.data().name;
    const rollNumber = userData.data().rollNumber;
    const email = userData.data().email;
    const tempNum = rows.length + 1;
    // console.log(file.size)
    if (tempNum === 4) {
      setError("You can upload only 3 files");
      return;
    } else if (file.size > 300 * 1024) {
      setError("File Size is greater than 300KB");
      return;
    }
    // const requiredName = resumeNames[0];
    if (file.name !== requiredName) {
      setError("File name should be in the format: " + requiredName);
      setLoading(false);
      return;
    }
    console.log("uploading file");
    const storageRef = sRef(storage, `${rollNumber}/${file.name}`);
    await uploadBytes(storageRef, file).then(() => {
      // console.log("uploaded image")
      setMessage("File uploaded successfully");
      setLoading(false);
    });
    const resumeLinksRef = await getDoc(doc(db, "resumeLinks", rollNumber));

    if (resumeLinksRef.exists()) {
      const temp = resumeLinksRef.data().data;
      const url = await getDownloadURL(storageRef);
      console.log(url);
      temp.push({
        id: tempNum,
        name: name,
        email: email,
        rollNumber: rollNumber,
        fileName: file.name,
        link: url,
        verified: false,
        verifiedStatus: "pending",
      });
      setResumeLinkList(temp);
      console.log(temp);
      console.log(resumeLinkList);
      console.log("updating");
      await setDoc(doc(db, "resumeLinks", rollNumber), { data: temp, recruitedStatus: "pending"});
      // const newData = { ...userData.data(), data: temp };
      // await updateDoc(doc(db, "users", user.uid), newData);
    } else {
      const url = await getDownloadURL(storageRef);
      console.log(url);
      setResumeLinkList([
        {
          id: tempNum,
          name: name,
          email: email,
          rollNumber: rollNumber,
          fileName: file.name,
          link: url,
          verified: false,
          verifiedStatus: "pending",
        },
      ]);
      console.log("setting");
      await setDoc(doc(db, "resumeLinks", rollNumber), {
        data: [
          {
            id: tempNum,
            name: name,
            email: email,
            rollNumber: rollNumber,
            fileName: file.name,
            link: url,
            verified: false,
            verifiedStatus: "pending",
          },
        ],
        recruitedStatus: "pending",
      });
      // const newData = {
      //   ...userData.data(),
      //   data: [{ fileName: file.name, link: url, verified: false, verifiedStatus: "pending"}],
      // };
      // await updateDoc(doc(db, "users", user.uid), newData);
    }
  };
  return (
    <>
      <ThemeProvider theme={theme}>
        <div style={{ height: "100vh" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "1050px",
              margin: "auto",
              marginBottom: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
          </div>
          <div
            style={{
              width: "100%",
              maxWidth: "1050px",
              margin: "auto",
              marginBottom: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <MuiFileInput
              placeholder="Insert a file"
              value={file}
              onChange={handleChange}
            />
            <Button
              onClick={handleUploadFile}
              variant="contained"
              disabled={loading}
            >
              Upload File
            </Button>
          </div>
          <DataGrid
            rows={rows}
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
              height: "50vh",
            }}
          />
        </div>
      </ThemeProvider>
    </>
  );
};

export default Resume;
