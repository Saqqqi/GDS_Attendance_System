import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Login, Logout } from './Pages';
import EmployeeRegistration from './Pages/EmployeeRegistration';
import Layout from './Components/Layout';
import AllEmployees from './Pages/AllEmployees';
import EmployeeDetail from './Pages/EmployeeDetail';
import UpdateEmployee from './Pages/UpdateEmployee';
import Break from './Pages/Break';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Check if the user is logged in and get their role from localStorage
    const employeeId = localStorage.getItem('employeeId');
    const roleFromStorage = localStorage.getItem('Role');

    if (employeeId && roleFromStorage) {
      setIsLoggedIn(true);
      setRole(roleFromStorage);
    }
  }, []);

  // Route protection logic
  const ProtectedRoute = ({ element, ...props }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    return element;
  };

  const AdminRoute = ({ element, ...props }) => {
    if (role !== 'Admin') {
      return <Navigate to="/dashboard" />;
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route exact path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route exact path="/logout" element={<Logout />} />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="/dashboard"
                  element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route path="/all-employees" element={<AllEmployees />} />
                
                {/* Admin only routes */}
                <Route
                  path="/employee-registration"
                  element={<AdminRoute element={<EmployeeRegistration />} />}
                />
                <Route
                  path="/update-employee/:id"
                  element={<AdminRoute element={<UpdateEmployee />} />}
                />
                <Route
                  path="/employee-detail/:id"
                  element={<AdminRoute element={<EmployeeDetail />} />}
                />

                {/* Break Route */}
                <Route path="/break" element={isLoggedIn ? <Break /> : <Navigate to="/login" />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
