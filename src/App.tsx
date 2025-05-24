import  { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Specialization from './pages/Specialization';
import Resources from './pages/Resources';
import ExamStart from './pages/ExamStart';
import Exam from './pages/Exam';
import Quiz from './pages/Quiz';

// Admin pages
import AdminLayout from './pages/Admin/index';
import AdminDashboard from './pages/Admin/Dashboard';
import QuestionManager from './pages/Admin/QuestionManager'; // Corrected path
import AdminManager from './pages/Admin/AdminManager';
import AISettings from './pages/Admin/AISettings';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* مسارات المستخدم */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          
          <Route path="/specialization/:id" element={
            <PrivateRoute>
              <Specialization />
            </PrivateRoute>
          } />
          
          <Route path="/resources" element={
            <PrivateRoute>
              <Resources />
            </PrivateRoute>
          } />
          
          <Route path="/exams/start" element={
            <PrivateRoute>
              <ExamStart />
            </PrivateRoute>
          } />
          
          <Route path="/exams/:id" element={
            <PrivateRoute>
              <Exam />
            </PrivateRoute>
          } />
          
          <Route path="/quiz/:id" element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          } />
        </Route>
        
        {/* مسارات المشرف */}
        <Route path="/admin" element={
          <PrivateRoute requiredRole="admin">
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="questions" element={<QuestionManager />} />
          <Route path="users" element={<AdminManager />} />
          <Route path="ai-settings" element={<AISettings />} />
        </Route>
        
        {/* مسارات أخرى */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
 