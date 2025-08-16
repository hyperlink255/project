import React, { useContext } from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Checkout from './pages/Checkout';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from 'react-hot-toast';

// Dashboard Pages
import UserDashboard from './pages/dashboard/user/UserDashboard';
import MyBookings from './pages/dashboard/user/MyBookings';
import MyReviews from './pages/dashboard/user/MyReviews';

import OrganizerDashboard from './pages/dashboard/organizer/OrganizerDashboard';
import MyEvents from './pages/dashboard/organizer/MyEvents';
import CreateEvent from './pages/dashboard/organizer/CreateEvents';
import EditEvent from './pages/dashboard/organizer/EditEvents';
import EventBookings from './pages/dashboard/organizer/EventBookings';

import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import AllEvents from './pages/dashboard/admin/AllEvents';
import AllBookings from './pages/dashboard/admin/AllBookings';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import { AppContext } from './context/AppContext';
import "quill/dist/quill.snow.css"


const App = () => {
  const { user } = useContext(AppContext);
  const match = useMatch("/dashboard/organizer/*")

  return (
    <>
      {!match && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/booking/:eventId" element={<Booking />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        {
          user &&
          <>
        <Route path="/dashboard/user" element={
          <ProtectedRoute user={user.role} allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } >
        <Route path="bookings" element={<MyBookings />} />
        <Route path="reviews" element={<MyReviews />} />
        </Route>

        <Route
          path="/dashboard/organizer"
          element={
            <ProtectedRoute user={user.role} allowedRoles={['organizer']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="my-events" element={<MyEvents />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="event-bookings/:id" element={<EventBookings />} />
        </Route>

        <Route path="/dashboard/admin" element={
          <ProtectedRoute user={user.role} allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } >
        <Route path="all-events" element={<AllEvents />} />
        <Route path="all-bookings" element={<AllBookings />} />
        <Route path="manage-users" element={<ManageUsers />} />
        </Route>
        </>
        }
      </Routes>
      <Toaster />
      {!match && <Footer />}
    </>
  );
};

export default App;

