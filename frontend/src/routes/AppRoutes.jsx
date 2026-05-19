import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react'; 
import { AuthContext } from '../context/AuthContext'; 
import ProtectedRoute from './ProtectedRoute';

// --- IMPORT LAYOUTS ---
import MainLayout from '../components/layout/MainLayout';
import PortalLayout from '../components/layout/PortalLayout'; // Import Layout gộp ở đây

// --- IMPORT PAGES ---
import Home from '../pages/Auth/Home';
import Login from '../pages/Auth/Login';
import Intro from '../pages/Auth/Intro';
import NewsList from '../pages/Auth/NewsList';
import NewsDetail from '../pages/Auth/NewsDetail';
import Profile from '../pages/Auth/Profile';
import Contact from '../pages/Auth/Contact';
import CreateUser from '../pages/Admin/CreateUser';
import NewsForm from '../pages/Admin/NewsForm';
import JobList from '../pages/Student/JobList';
import JobDetail from '../pages/Student/JobDetail';
import PostJob from '../pages/Company/PostJob';
import CompanyJobs from '../pages/Company/CompanyJobs'; 
import ApplicantList from '../pages/Company/ApplicantList';
import EditJob from '../pages/Company/EditJob';
import AdminJobs from '../pages/Admin/AdminJobs';

const Unauthorized = () => <div className="p-8 text-red-500 font-bold text-center mt-10">Bạn không có quyền truy cập trang này!</div>;

const AppRoutes = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout user={user} handleLogout={logout} />}>
        
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          {/* SỬ DỤNG PORTAL LAYOUT VÀ TRUYỀN ROLE="ADMIN" */}
          <Route path="/admin" element={<PortalLayout role="admin" />}>
            <Route index element={<CreateUser />} /> 
            <Route path="intro" element={<Intro />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="news/create" element={<NewsForm />} />
            <Route path="news/edit/:id" element={<NewsForm />} />
            <Route path="contact" element={<Contact />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="jobs/:id/edit" element={<EditJob />} />
          </Route>
        </Route>

        {/* Company Routes */}
        <Route element={<ProtectedRoute allowedRoles={['company']} />}>
          {/* SỬ DỤNG PORTAL LAYOUT VÀ TRUYỀN ROLE="COMPANY" */}
          <Route path="/company" element={<PortalLayout role="company" />}>
            <Route index element={<CompanyJobs />} />
            <Route path="intro" element={<Intro />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="post-job" element={<PostJob />} />          
            <Route path="profile" element={<Profile />} />    
            <Route path="jobs/:jobId/applicants" element={<ApplicantList />} /> 
            <Route path="jobs/:id/edit" element={<EditJob />} /> 
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          {/* SỬ DỤNG PORTAL LAYOUT VÀ TRUYỀN ROLE="STUDENT" */}
          <Route path="/student" element={<PortalLayout role="student" />}>
            <Route index element={<JobList />} />
            <Route path="intro" element={<Intro />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="jobs/:id" element={<JobDetail />} /> 
            <Route path="profile" element={<Profile />} /> 
          </Route>
        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;