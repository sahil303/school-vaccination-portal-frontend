import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Drives from './pages/Drives';
import StudentsManagement from './pages/Students';
import Reports from './pages/Reports';
import EditStudentDetails from './pages/EditStudentDetails';

const isAuthenticated = () => sessionStorage.getItem('isLoggedIn');

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />   
        </Route>
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <StudentsManagement/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/students" />} />
          <Route path="students" element={<StudentsManagement />} />
        </Route>
      
              <Route
          path="/EditStudentDetails"
          element={
            <ProtectedRoute>
              <EditStudentDetails/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/EditStudentDetails" />} />
          <Route path="EditStudentDetails" element={<EditStudentDetails />} />
        </Route>

        <Route
          path="/drives"
          element={
            <ProtectedRoute>
              <Drives/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/drives" />} />
          <Route path="drives" element={<Drives />} />
        </Route>

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/reports" />} />
          <Route path="reports" element={<Reports />} />
        </Route>  
        <Route path="*" element={<center><h1>404 Not Found</h1></center>} />
      </Routes>
    </Router>
  );
}

export default App;