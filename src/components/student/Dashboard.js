import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate, Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserAuth } from "../contexts/userAuthContext";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";

const drawerWidth = 240;
const screenBreakPoint = 1200;

const screenWidth = window.screen.width;
console.log(screenWidth);

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
     ...( screenWidth > screenBreakPoint && {marginLeft: `-${drawerWidth}px`}), 
    ...(open && screenWidth > screenBreakPoint  && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const Dashboard = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [styleAdminButton, setStyleAdminButton] = React.useState({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"});
  const [styleStudentButton, setStyleStudentButton] = React.useState({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"});  
  const [styleRecruiterButton, setStyleRecruiterButton] = React.useState({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"});  
  const [styleNoticeButton, setStyleNoticeButton] = React.useState({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"});  
  const navigate = useNavigate();
  const {logOut, user} = useUserAuth();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const setDefaultColorsToButtons = () => { 
    setStyleAdminButton({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"}); 
    setStyleStudentButton({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"}); 
    setStyleRecruiterButton({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"}); 
    setStyleNoticeButton({backgroundColor:"transparent",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"});  
  }

  // const handleAdminClick = () => {
  //   navigate("/admin");
  // };
  const handleStudentClick = () => {
    navigate("/admin/student");
  };
  const handleRecruiterClick = () => {
    navigate("/admin/recruiter");
  };

  const handleNoticeClick = () => {
    navigate("/student/notice");
  }

  const handleProfileClick = () => {
    navigate("/student/profile");
  }

  const handleResumeClick = () => {
    navigate("/student/resume");
  }

  const handleJobOpeningClick = () => {
    navigate("/student/jobOpening");
  }

  const handleContactUsClick = () => {
    navigate("/student/contactUs");
  }

  const handleLogOutClick = () => {
    logOut();
    // navigate("/");
  }

  const location = useLocation();
  console.log(location.pathname);


  React.useEffect(() => {
    if(location.pathname === "/admin"){
      setDefaultColorsToButtons();
      setStyleAdminButton({backgroundColor:"#f0efef",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"});
    }else if(location.pathname === "/admin/student"){
      setDefaultColorsToButtons();
      setStyleStudentButton({backgroundColor:"#f0efef",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"});   
    }else if(location.pathname === "/admin/recruiter"){
      setDefaultColorsToButtons();
      setStyleRecruiterButton({backgroundColor:"#f0efef",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"}); 
    }else if(location.pathname === "/admin/notice"){
      setDefaultColorsToButtons();
      setStyleNoticeButton({backgroundColor:"#f0efef",borderRadius:"10px",border:"1px solid grey",margin:"5px",width:"220px"}); 
    }
  if(screenWidth <= screenBreakPoint){setOpen(false);}
    
  },[location.pathname])
  return (
    <Box sx={{ display: "flex",backgroundColor:"#f3f6f9" }}>
      <CssBaseline />
      <AppBar  open={open} elevation={0} sx={{backgroundColor:"transparent"}}>
        <Toolbar>
          <IconButton
            color="turquoise"
            aria-label="open drawer" 
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography> */}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
          ...(screenWidth <= screenBreakPoint ? {position:"fixed"} : {position:"relative"}),
          zIndex:3,
          top:"0px",
          left:"0px",
          paddingRight:"10px",
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key="Profile" disablePadding onClick={handleProfileClick} sx={styleAdminButton}>
            <ListItemButton>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem key="Resume" disablePadding onClick={handleResumeClick} sx={styleStudentButton}>
            <ListItemButton>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Resume" />
            </ListItemButton>
          </ListItem>
          <ListItem
            key="JobOpening"
            disablePadding
            onClick={handleJobOpeningClick}
            sx={styleRecruiterButton}
          >
            <ListItemButton>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Job Openings" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
        <ListItem
            key="Notices"
            disablePadding
            onClick={handleNoticeClick}
            sx={styleNoticeButton}
          >
            <ListItemButton>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Notices" />
            </ListItemButton>
          </ListItem>
        <ListItem
            key="Contact Us"
            disablePadding
            onClick={handleContactUsClick}
            sx={styleNoticeButton}
          >
            <ListItemButton>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Contact Us" />
            </ListItemButton>
          </ListItem>
          <ListItem
            key="LogOut"
            disablePadding
            onClick={handleLogOutClick}
            sx={{...styleNoticeButton}}
          >
            <ListItemButton>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open} sx={{backgroundColor:"#f3f6f9",overflowX:"hidden"}}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
};

export default Dashboard;
