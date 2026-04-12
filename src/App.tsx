import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import AdminLayout from "./components/layouts/AdminLayout";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/layouts/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard";
import ProfilePage from "./components/pages/ProfilePage";
import Users from "./components/pages/Users";
import Subscriptions from "./components/pages/Subscriptions";
import SubscriptionDetail from "./components/pages/SubscriptionDetail";
import UserDetail from "./components/pages/UserDetail";
import NewsFeed from "./components/pages/NewsFeed";
import NewsFeedDetail from "./components/pages/NewsFeedDetail";
import Tickets from "./components/pages/Tickets";
import TicketDetail from "./components/pages/TicketDetail";

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
          <Route path="/newsfeeds" element={<NewsFeed />} />
          <Route path="/newsfeeds/:id" element={<NewsFeedDetail />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
