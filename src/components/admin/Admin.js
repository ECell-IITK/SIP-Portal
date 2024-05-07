import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Admin = () => {
  const [rows,setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "users");
      const q = query(colRef, where("userType", "==", "admin"));

      try {
        const querySnapshot = await getDocs(q);
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
    return () => {
      console.log("cleanup function");
    };
  }, []);

  const columns = [
    { field: "name", headerName: "Name", minWidth: 150,flex:1 },
    { field: "email", headerName: "Email", minWidth: 200,flex:1 },
  ];

  const getWidth = () => {
    if(window.innerWidth < 1000){
      return "90vw"
    }else{
      return "80vw"
    }
  }

  return (
    <div style={{ width: "100%", margin:"auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sx={{padding:"10px",maxWidth:getWidth(),margin:"auto",backgroundColor:"white"}}
      />
    </div>
  );
};

export default Admin;
