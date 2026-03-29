import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminPage from "./pages/admin_page";
import UserPage from "./pages/user_page";
import SignConfir from "./pages/sign_confir";
import UploadDocument from "./pages/upload_doc";
import ViewFile from "./pages/view_file";
import UploadConfir from "./pages/upload_confir";
import ViewCollection from "./pages/view_col";
import LabSelection from "./pages/LabSelection";
import FilesInLab from "./pages/FilesInLab";
import ViewFileHistory from "./pages/view_file_history";
import UpdateDocument from "./pages/update_upload";
import UpdateConfir from "./pages/update_confir";
import RollBack from "./pages/roll_back";
import RollConfir from "./pages/roll_confir";
const App = () => {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/signup_confirmation" element={<SignConfir/>} />
          <Route path="/upload_doc" element={<UploadDocument/>}/> 
          <Route path="/view_col" element={<ViewFile/>}/> 
          <Route path ="/upload_confirmation" element={<UploadConfir/>}/>
          <Route path="/view_meta" element={<ViewCollection/>}/>
          <Route path="/labs" element={<LabSelection />} />
          <Route path="/files/:labName" element={<FilesInLab />} />
          <Route path="/view_file_history" element={<ViewFileHistory />} />
          <Route path="/update-file" element={<UpdateDocument/>}/>
          <Route path="/update_confirmation" element={<UpdateConfir/>}/>
          <Route path="/version-management" element={<RollBack />} />
          <Route path="/roll_confirmation" element={<RollConfir />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

