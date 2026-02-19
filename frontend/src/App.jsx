import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminExams from './pages/admin/Exams';
import AdminUsers from './pages/admin/Users';
import AdminResults from './pages/admin/Results';
import StudentHome from './pages/student/Home';
import StudentHistory from './pages/student/History';
import ExamPage from './pages/ExamPage';

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/" />;
  if (role && userRole !== role) return <Navigate to={userRole === 'admin' ? '/admin' : '/student'} />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/exams" element={<PrivateRoute role="admin"><AdminExams /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/results" element={<PrivateRoute role="admin"><AdminResults /></PrivateRoute>} />
        <Route path="/student" element={<PrivateRoute role="student"><StudentHome /></PrivateRoute>} />
        <Route path="/student/history" element={<PrivateRoute role="student"><StudentHistory /></PrivateRoute>} />
        <Route path="/exam/:examId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
