import React,{useState, useEffect} from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import { db } from "../firebase";
import { collection, getDocs, query, where, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { Button } from '@mui/material';
import { useUserAuth } from '../contexts/userAuthContext';
import { useNavigate } from "react-router-dom"; 


const Student = () => {
  const [rows,setRows] = useState([]);
  const {deleteUser} = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const colRef = collection(db, "users");
    const q = query(colRef, where("userType", "==", "student"));
    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc,index) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      console.log(data);
      setRows(data);
    },[]);
    // Return a cleanup function if needed
    return () => {
      // Your cleanup logic, if any
      console.log("cleanup function");
    };
  }, []);
  
  const handleVerify = async(id) => {
    // console.log(id);
    const ref = doc(db, "users", id);
    const res = await updateDoc(ref,{verified:true});
  }
  const handleFreeze = async(id,freeze) => {
    // console.log(id);
    const ref = doc(db, "users", id);
    const res = await updateDoc(ref,{freeze:!freeze});
  }
  const columns = [
    { field: "name", headerName: "Name", flex:1,minWidth:100},
    { field: "email", headerName: "Email",flex:2,minWidth:200 },
    { field: "contactNumber", headerName: "Phone Number", flex:1, minWidth:100 },
    {
      field: 'actions',
      headerName: 'Verify',
      flex:1,
      minWidth:100,
      renderCell: (params) => (
        <div>
          <Button disabled={params.row.verified?true:false} onClick={() => handleVerify(params.row.id)}>Verify</Button>
        </div>
      ),
    },
    {
      field:'freeze',
      headerName:'Freeze',
      flex:1,
      minWidth:100,
      renderCell:(params) => (
        <div>
          <Button variant="contained" onClick={() => handleFreeze(params.row.id,params.row.freeze)}>
            {params.row.freeze?"Unfreeze":"Freeze"}
          </Button>
        </div>
      )
    },
    {
      field:'profile',
      headerName:'Profile',
      flex:1,
      minWidth:140,
      renderCell:(params) => (
        <div>
          <Button variant="contained" 
           onClick={() => navigate(`/admin/profile/${params.row.id}`)}
          >
            View Profile
          </Button>
        </div>
      )
    }
  ];
  return (
    <div style={{width:"100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        slots={{ toolbar: GridToolbar, }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sx={{padding:"10px",maxWidth:"90vw",backgroundColor:"white"}}
      />
    </div>)
}

export default Student
