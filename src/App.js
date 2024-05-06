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
import NoticesForRecruiter from "./components/admin/NoticesForRecruiter";
import {Resume as AdminResume} from "./components/admin/Resume";
import { StudentProfile as StudentProfileAdmin} from "./components/admin/StudentProfile";
import { Applicants as ApplicantsAdmin } from "./components/admin/Applicants";
import Proformas from "./components/recruiter/Proformas";
import {ProformaPage as ProformaPageRecruiter} from "./components/recruiter/ProformaPage";
import {Notices as NoticesRecruiter} from "./components/recruiter/Notices";
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
  function ProformaPageRecruiterWrapper(){
    const { id } = useParams();
    return <ProformaPageRecruiter id={id} />;
  }
  function ProformaPageWrapper() {
    const { id } = useParams();
    return <ProformaPage id={id} />;
  }
  function StudentProfileAdminWrapper() {
    const { id } = useParams();
    return <StudentProfileAdmin id={id} />;
  }
  function ApplicantsWrapper() {
    const { id } = useParams();
    return <ApplicantsAdmin id={id} />;
  }
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          {/* <ProtectedRoute> */}
          <Route path="/student" element={<ProtectedRouteForStudent><StudentDashboard /></ProtectedRouteForStudent> }>
            <Route index element={<StudentHome /> } />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="notice" element={<StudentNotices />} />
            <Route path="resume" element={<Resume />} />
            <Route path="contactUs" element={<ContactUs />} />
            <Route path="jobOpening" element={<StudentJobOpening />} />
            
          </Route>
          {/* </ProtectedRoute> */}
          <Route path="/recruiter" element={<ProtectedRouteForRecruiter><RecruiterDashboard /></ProtectedRouteForRecruiter>}>
            <Route path="/recruiter" element={<RecruiterHome />} />
            <Route path="/recruiter/notice" element={<NoticesRecruiter />} />
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            <Route path="/recruiter/proforma" element={<Proforma />} />
            <Route path="/recruiter/proformas" element={<Proformas />} />
            <Route path="proforma/:id" element={<ProformaPageRecruiterWrapper />} />
            <Route path="/recruiter/applicants" element={<Applicants />} />
            <Route path="contactUs" element={<ContactUs />} />

          </Route>
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<Admin />} />
            <Route path="student" element={<Student />} />
            <Route path="recruiter" element={<Recruiter />} />
            <Route path="notice" element={<Notices />} />
            <Route path="jobOpenings" element={<JobOpening />} />
            <Route path="proformas" element={<AdminProformas />} />
            <Route path="proforma/:id" element={<ProformaPageWrapper />} />
            <Route path="profile/:id" element={<StudentProfileAdminWrapper />} />
            <Route path="contactUs" element={<ContactUs />} />
            <Route path="resume" element={<AdminResume />} />
            <Route path="applicants/:id" element={<ApplicantsWrapper />} />
            <Route path="noticesRecruiter" element={<NoticesForRecruiter />} />
          </Route>
        </Routes>
      </UserAuthContextProvider>
    </>
  );
}

export default App;
