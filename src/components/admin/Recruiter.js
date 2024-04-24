import React,{useState, useEffect} from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUserAuth } from '../contexts/userAuthContext';

const Recruiter = () => {
  const [rows,setRows] = useState([]);
  const {deleteUser} = useUserAuth();

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "users");
      const q = query(colRef, where("userType", "==", "recruiter"));

      try {
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot);
        const data = querySnapshot.docs.map((doc) => {
          console.log(doc.id);
          return {...doc.data(),id:doc.id}
        });
        console.log(data);
        setRows(data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Return a cleanup function if needed
    return () => {
      // Your cleanup logic, if any
      //   fetchData();
      console.log("cleanup function");
    };
  }, []);

  const handleDelete = async(id) => {  
    console.log(id);
    
      const res = await deleteUser(id);
      console.log(res);
    
  }
  

  const columns = [
    { field: "companyName", headerName: "Company", minWidth: 100,flex:1 },
    { field: "name", headerName: "Name", minWidth: 100,flex:1 },
    { field: "email", headerName: "Email", minWidth: 150,flex:1 },
    { field: "designation", headerName: "Designation", minWidth: 100,flex:1 },
    { field: "contactNumber", headerName: "Phone Number", minWidth: 130,flex:1 },
  ];
  return (
    <div style={{ height:"100%",width:"100%",maxHeight:"85vh"}}>
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
        sx={{padding:"10px",maxWidth:"90vw"}}
      />
    </div>)
}

export default Recruiter
