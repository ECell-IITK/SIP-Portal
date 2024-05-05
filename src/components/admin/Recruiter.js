import React,{useState, useEffect} from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { db } from "../firebase";
import { collection, getDocs, query, where, updateDoc, doc, onSnapshot } from "firebase/firestore";
// import { Button } from '@mui/material';
import {Button} from '@mui/material';
import { useUserAuth } from '../contexts/userAuthContext';

const Recruiter = () => {
  const [rows,setRows] = useState([]);
  const {deleteUser} = useUserAuth();

  useEffect(() => {
    // const fetchData = async () => {
    //   const colRef = collection(db, "users");
    //   const q = query(colRef, where("userType", "==", "recruiter"));

    //   try {
    //     const querySnapshot = await getDocs(q);
    //     // console.log(querySnapshot);
    //     const data = querySnapshot.docs.map((doc) => {
    //       console.log(doc.id);
    //       return {...doc.data(),id:doc.id}
    //     });
    //     console.log(data);
    //     setRows(data)
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // fetchData();
    const colRef = collection(db, "users");
    const q = query(colRef, where("userType", "==", "recruiter"));
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
      console.log("cleanup function");
    };
  }, []);

  const handleDelete = async(id) => {  
    console.log(id);
    
      const res = await deleteUser(id);
      console.log(res);
    
  }
  
  const handleVerify = async(id) => {
    console.log(id);
    const ref = doc(db, "users", id);
    const res = await updateDoc(ref,{verified:true});
  }
  const handleFreeze = async(id,freeze) => {
    console.log(id);
    const ref = doc(db, "users", id);
    const res = await updateDoc(ref,{freeze:!freeze});
  }

  const columns = [
    { field: "companyName", headerName: "Company", minWidth: 100,flex:1 },
    { field: "name", headerName: "Name", minWidth: 100,flex:1 },
    { field: "email", headerName: "Email", minWidth: 150,flex:1 },
    { field: "designation", headerName: "Designation", minWidth: 100,flex:1 },
    { field: "contactNumber", headerName: "Phone Number", minWidth: 130,flex:1 },
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
  ];
  return (
    <div style={{width:"100%"}}>
      {/* <DataGrid {...data}  slots={{ toolbar: GridToolbar }} /> */}
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

export default Recruiter
