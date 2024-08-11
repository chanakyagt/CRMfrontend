import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Admin from './Admin';
import Store from './Store';
import Moderator from './Moderator';
import Technician from './Technician';
import OverallAnalysis from './OverallAnalysis';
import Timeline from './Timeline';
import Filters from './Filters';
import CurrentEmployees from './CurrentEmployees';
import AddEmployee from './AddEmployee';
import CurrentStores from './CurrentStores';
import AddStore from './AddStore';
import AddService from './AddService';
import ProtectedRoute from './ProtectedRoute';
import Home from './Home';
import Login from './Login';
import ContactUs from './ContactUs';

const RoleBasedRoutes = () => {
  const userType = localStorage.getItem('userType');
  console.log('RoleBasedRoutes component rendered', { userType });

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${userType?.toLowerCase()}`} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/contact-us" element={<ContactUs />} />
      
      <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
        <Route path="/admin/*" element={<Admin />}>
          <Route path="dashboard/overall-analysis" element={<OverallAnalysis />} />
          <Route path="dashboard/timeline" element={<Timeline />} />
          <Route path="dashboard/filters/status" element={<Filters type="Status" />} />
          <Route path="dashboard/filters/store" element={<Filters type="Store" />} />
          <Route path="dashboard/filters/type" element={<Filters type="Type" />} />
          <Route path="dashboard/filters/employee" element={<Filters type="Employee" />} />
          <Route path="employees/current" element={<CurrentEmployees />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="stores/current" element={<CurrentStores />} />
          <Route path="stores/add" element={<AddStore />} />
          <Route path="services/add" element={<AddService />} />
        </Route>
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['store']}/>}>
        <Route path="/store/*" element={<Store />}>
          <Route path="dashboard/timeline" element={<Timeline />} />
          <Route path="services/add" element={<AddService />} />
        </Route>
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['moderator']}/>}>
        <Route path="/moderator/*" element={<Moderator />}>
          <Route path="dashboard/timeline" element={<Timeline />} />
          <Route path="services/add" element={<AddService />} />
        </Route>
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['technician']}/>}>
        <Route path="/technician/*" element={<Technician />}>
          <Route path="dashboard/timeline" element={<Timeline />} />
          <Route path="services/add" element={<AddService />} />
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to={`/${userType?.toLowerCase()}`} />} />
    </Routes>
  );
};

export default RoleBasedRoutes;
