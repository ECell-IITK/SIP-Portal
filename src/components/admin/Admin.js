import React, { useEffect, useState } from "react";
// import { useDemoData } from "@mui/x-data-grid-generator";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ClassNames } from "@emotion/react";

const Admin = () => {
  //   const demoData = useDemoData({
  //     dataSet: "Commodity",
  //     rowLength: 10,
  //     maxColumns: 10,
  //   });
  //   const { data, loading } = demoData;
  //   console.log(demoData,data,loading)
  const [rows,setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "users");
      const q = query(colRef, where("userType", "==", "admin"));

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

  const columns = [
    { field: "name", headerName: "Name", minWidth: 150,flex:1 },
    { field: "email", headerName: "Email", minWidth: 200,flex:1 },
  ];

//   const rows = [
//     { id: 1, name: "John Doe", age: 25, email: "john@example.com" },
//     { id: 2, name: "Jane Doe", age: 30, email: "jane@example.com" },
//     // Add more rows as needed
//   ];

  const getWidth = () => {
    if(window.innerWidth < 1000){
      return "90vw"
    }else{
      return "80vw"
    }
  }

  return (
    <div style={{ height: "100%", width: "100%", maxHeight:"85vh",margin:"auto" }}>
      {/* <DataGrid {...data}  slots={{ toolbar: GridToolbar }} /> */}
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
        sx={{padding:"10px",maxWidth:getWidth(),margin:"auto"}}
      />
    </div>
  );
};

export default Admin;
