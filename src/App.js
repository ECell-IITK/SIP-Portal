import { Route, Routes } from "react-router-dom";
import { UserAuthContextProvider } from "./components/contexts/userAuthContext";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/admin/Dashboard";
import { Dashboard as StudentDashboard } from "./components/student/Dashboard";
import { Home as StudentHome } from "./components/student/Home";
import { Profile as StudentProfile } from "./components/student/Profile";
import { Notices as StudentNotices } from "./components/student/Notices";
import { JobOpening as StudentJobOpening } from "./components/student/jobOpening";
import { Dashboard as RecruiterDashboard } from "./components/recruiter/Dashboard";
import { Home as RecruiterHome } from "./components/recruiter/Home";
import { Profile as RecruiterProfile } from "./components/recruiter/Profile";
import Proforma from "./components/recruiter/Proforma";
import Admin from "./components/admin/Admin";
import Student from "./components/admin/Student";
import Recruiter from "./components/admin/Recruiter";
import Notices from "./components/admin/Notices";
import {Resume as AdminResume} from "./components/admin/Resume";
import { StudentProfile as StudentProfileAdmin} from "./components/admin/StudentProfile";
import Proformas from "./components/recruiter/Proformas";
import JobOpening from "./components/admin/JobOpening";
import ProformaPage from "./components/ProformaPage"; 
import { Proformas as AdminProformas } from "./components/admin/Proformas";
import { useParams } from "react-router-dom";
import Resume from "./components/student/Resume";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedRouteForStudent from "./components/ProtectedRouteForStudent";
import ProtectedRouteForRecruiter from "./components/ProtectedRouteForRecruiter";
import Applicants from "./components/recruiter/Applicants";
import ContactUs from "./components/ContactUs";
function App() {
  return (
    <UserAuthContextProvider>
      <SignUp />
    </UserAuthContextProvider>
  );
}

export default App;
