import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import './styles/globals.css';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/Toast';
import ProtectedRoute from './utils/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy load pages for optimized bundle size and faster initial load
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const SimpleDashboard = lazy(() => import('./pages/SimpleDashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Students = lazy(() => import('./pages/StudentManagement'));
const Teachers = lazy(() => import('./pages/TeacherManagement'));
const Profile = lazy(() => import('./pages/Profile'));
const Messages = lazy(() => import('./pages/Messages'));
const Progress = lazy(() => import('./pages/Progress'));

// Add forms
const AddCourse = lazy(() => import('./pages/AddCourse'));
const AddSchedule = lazy(() => import('./pages/AddSchedule'));
const AddStudent = lazy(() => import('./pages/AddStudent'));
const AddTeacher = lazy(() => import('./pages/AddTeacher'));

// Edit forms
const EditCourse = lazy(() => import('./pages/EditCourse'));
const EditSchedule = lazy(() => import('./pages/EditSchedule'));
const EditStudent = lazy(() => import('./pages/EditStudent'));
const EditTeacher = lazy(() => import('./pages/EditTeacher'));

// Video Management
const VideoManagement = lazy(() => import('./pages/VideoManagement'));

/**
 * Shared Layout component for protected routes.
 * Using <Outlet /> ensures the DashboardLayout stays mounted while 
 * page content changes, preventing UI flicker and state loss.
 */
const ProtectedLayout = ({ roles }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <ProtectedRoute requiredRoles={roles}>
      <DashboardLayout onLogout={handleLogout} />
    </ProtectedRoute>
  );
};

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary text-primary">
      <h1 className="mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-secondary">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-3 bg-primary rounded-lg font-medium transition-fast shadow-sm hover:shadow-md"
        style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
      >
        Go Back
      </button>
    </div>
  );
};

/**
 * Loading fallback shown during page transitions
 */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-secondary">
    <div className="text-lg font-medium text-secondary">Loading...</div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-secondary">
        <ToastContainer />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Public access dashboard (if intended) */}
            <Route path="/simple-dashboard" element={<SimpleDashboard />} />

            {/* General Access Workspace (Admin, Teacher, Student) */}
            <Route element={<ProtectedLayout roles={['admin', 'teacher', 'student']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/progress" element={<Progress />} />
            </Route>

            {/* Content Management Workspace (Admin & Teacher Only) */}
            <Route element={<ProtectedLayout roles={['admin', 'teacher']} />}>
              <Route path="/courses/add" element={<AddCourse />} />
              <Route path="/courses/edit/:id" element={<EditCourse />} />
              <Route path="/schedule/add" element={<AddSchedule />} />
              <Route path="/schedule/edit/:id" element={<EditSchedule />} />
              <Route path="/videos" element={<VideoManagement />} />
            </Route>

            {/* Administrative Workspace (Admin Only) */}
            <Route element={<ProtectedLayout roles={['admin']} />}>
              <Route path="/students" element={<Students />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/students/edit/:id" element={<EditStudent />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/teachers/add" element={<AddTeacher />} />
              <Route path="/teachers/edit/:id" element={<EditTeacher />} />
            </Route>

            {/* Catch-all 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
