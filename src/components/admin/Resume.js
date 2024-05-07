import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Typography,TextField } from "@mui/material";
import { db } from "../firebase";
import LinearProgress from "@mui/material/LinearProgress";
import {
  collection,
  getDoc,
  setDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useUserAuth } from "../contexts/userAuthContext";

export const Resume = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { deleteUser } = useUserAuth();
  const [recruitedStatusText, setRecruitedStatusText] = useState("");

  useEffect(() => {
    const colRef = collection(db, "resumeLinks");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc,index) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      console.log(data);
      setRows(data);
    });
  }, []);

  const handleDelete = (id) => {
    console.log(id);
    try {
      const res = async () => await deleteUser(id);
      // console.log(res);
    } catch (err) {
      // console.log(err.message);
    }
  };

  const handleResumeClick = async (i, id, rollNumber) => {
    // console.log("handling resume click of " + i + " " + id);
    setLoading(true);
    try {
      const res = await getDoc(doc(db, "resumeLinks", rollNumber));
      const newData = res.data().data.map((item, index) => {
        if (index + 1 === i) {
          return { ...item, verified: true, verifiedStatus: "verified" };
        }
        return item;
      });

      await setDoc(doc(db, "resumeLinks", rollNumber), { data: newData });
    } catch (err) {
      // console.log(err.message);
    }
    setLoading(false);
  };
  const handleResumeDeleteClick = async (i, id, rollNumber) => {
    console.log("handling resume click of " + i + " " + id);
    setLoading(true);
    try {
      const res = await getDoc(doc(db, "resumeLinks", rollNumber));
      let newData = [];
      res.data().data.map((item, index) => {
        if (index + 1 != i) newData.push(item);
      });
      await setDoc(doc(db, "resumeLinks", rollNumber), { data: newData });
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  const updateRecruitementStatus = (row) => {
    return async () => {
      setLoading(true);
      try {
        
      } catch (err) {
        console.log(err.message);
      }
      setLoading(false);
    };
  }

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 100,
      flex:1,
      renderCell: (params) => <div>{params.row.data[0]?.name}</div>,
    },
    { field: "email", headerName: "Email", width: 200 ,
    renderCell: (params) => <div>{params.row.data[0]?.email}</div>,
    flex:1,
    minWidth:200
    },
    {
      field: "resume1",
      headerName: "Resume 1",
      minWidth: 360,
      flex:2,
      renderCell: (params) => (
        <div>
          {/* {console.log(params.row.data[0].link)} */}
          {params.row.data.length >= 1 ? (
            <div>
              <Button
                variant="contained"
                color="primary"
                href={params.row.data[0].link}
                target="_blank"
                sx={{ margin: "5px" }}
              >
                Resume 1
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "5px" }}
                onClick={() =>
                  handleResumeClick(1, params.row.data[0].id, params.row.data[0].rollNumber)
                }
                disabled={loading || params.row.data[0].verified}
              >
                {params.row.data[0].verified ? "Verified" : "Verify?"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "5px" }}
                onClick={() =>
                  handleResumeDeleteClick(
                    1,
                    params.row.data[0].id,
                    params.row.data[0].rollNumber
                  )
                }
                disabled={loading || params.row.data[0].verified}
              >
                {params.row.data[0].verifiedStatus === "pending"
                  ? "Delete"
                  : "Do not Click"}
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: "5px" }}
              disabled
            >
              Resume 1
            </Button>
          )}
        </div>
      ),
    },
    {
      field: "resume2",
      headerName: "Resume 2",
      minWidth: 320,
      flex:2,
      renderCell: (params) => (
        <div>
          {/* {console.log(params.row.data[0].link)} */}
          {params.row.data.length >= 2 ? (
            <div>
              <Button
                variant="contained"
                color="primary"
                href={params.row.data[1].link}
                target="_blank"
                sx={{ margin: "5px" }}
              >
                Resume 2
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "5px" }}
                onClick={() =>
                  handleResumeClick(2, params.row.data[1].id, params.row.data[1].rollNumber)
                }
                disabled={loading || params.row.data[1].verified}
              >
                {params.row.data[1].verified ? "Verified" : "Verify?"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "5px" }}
                onClick={() =>
                  handleResumeDeleteClick(
                    2,
                    params.row.data[1].id,
                    params.row.data[1].rollNumber
                  )
                }
                disabled={loading || params.row.data[1].verified}
              >
                {params.row.data[1].verifiedStatus === "pending"
                  ? "Delete"
                  : "Do not Click"}
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: "5px" }}
              disabled
            >
              Resume 2
            </Button>
          )}
        </div>
      ),
    },
    {
      field: "resume3",
      headerName: "Resume 3",
      minWidth: 340,
      flex:2,
      renderCell: (params) => (
        <div>
          {params.row.data.length >= 3 ? (
            <div>
              <Button
                variant="contained"
                color="primary"
                href={params.row.data[2].link}
                target="_blank"
                sx={{ margin: "5px" }}
              >
                Resume 3
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "5px" }}
                onClick={() =>
                  handleResumeClick(3, params.row.data[2].id, params.row.data[2].rollNumber)
                }
                disabled={loading || params.row.data[2].verified}
              >
                {params.row.data[2].verified ? "Verified" : "Verify?"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "5px" }}
                onClick={() =>
                  handleResumeDeleteClick(
                    3,
                    params.row.data[2].id,
                    params.row.data[2].rollNumber
                  )
                }
                disabled={loading || params.row.data[2].verified}
              >
                {params.row.data[2].verifiedStatus === "pending"
                  ? "Delete"
                  : "Do not Click"}
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ margin: "5px" }}
              disabled
            >
              Resume 3
            </Button>
          )}
        </div>
      ),
    },
    {
      field: "recruitedStatus",
      headerName: "Recruited",
      minWidth: 150,
      flex:1,
      render  : (params) => (
        <div>
          {params.row.recruitedStatus==="pending" ? (
            <Button variant="contained" color="success">
              params.row.recruitedStatus
            </Button>
          ) : (
            <div>
                <Typography variant="body1">Department</Typography>
              <TextField
                required
                // id="filled-required"
                defaultValue=""
                variant="filled"
                value={recruitedStatusText}
                onChange={e => setRecruitedStatusText(e.target.value)}
              ></TextField>
              <Button variant="contained" color="error" onClick={updateRecruitementStatus(params.row)}>
                Update Status
              </Button>
            </div>
          )}
        </div>
      ),
    }
  ];
  return (
    <div style={{ width:"100%"}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        slots={{ toolbar: GridToolbar, loadingOverlay: LinearProgress }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sx={{ padding: "10px", maxWidth:"90vw"}}
      />
    </div>
  );
};

export default Resume;
