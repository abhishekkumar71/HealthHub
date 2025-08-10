import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import AuthModal from "./pages/Authenthication";
import Dashboard from "./pages/Dashboard";
import NewSession from "./pages/NewSession";
import EditSession from "./pages/EditSession";
import AllPosts from "./pages/AllPosts";
import SessionDetails from "./pages/SessionDetails";
import { SnackbarProvider } from "notistack";
import "./styles/App.css";

axios.defaults.withCredentials = true;

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.DEV
    ? ""
    : "https://healthhub-backend-sldu.onrender.com";
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/me`)
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const Protected = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <SnackbarProvider maxSnack={1}>
      <div className="layout" style={{ paddingTop: "64px" }}>
        <BrowserRouter>
          <Navbar
            setAuthOpen={setAuthOpen}
            setAuthMode={setAuthMode}
            user={user}
            setUser={setUser}
          />
          <div className="pageContent">
            <Routes>
              <Route
                path="/"
                element={
                  <LandingPage
                    user={user}
                    setAuthOpen={setAuthOpen}
                    setAuthMode={setAuthMode}
                  />
                }
              />

              <Route path="/session/:id" element={<SessionDetails />} />
              <Route path="/explore" element={<AllPosts />} />

              <Route
                path="/dashboard"
                element={
                  <Protected>
                    <Dashboard
                      setAuthOpen={setAuthOpen}
                      setAuthMode={setAuthMode}
                    />
                  </Protected>
                }
              />
              <Route
                path="/dashboard/new"
                element={
                  <Protected>
                    <NewSession />
                  </Protected>
                }
              />
              <Route
                path="/editSession/:id"
                element={
                  <Protected>
                    <EditSession />
                  </Protected>
                }
              />
            </Routes>
          </div>

          <Footer />

          {authOpen && (
            <AuthModal
              open={authOpen}
              setOpen={setAuthOpen}
              mode={authMode}
              setMode={setAuthMode}
              onClose={() => setAuthOpen(false)}
              onSuccess={(user) => {
                setUser(user);
                setAuthOpen(false);
              }}
            />
          )}
        </BrowserRouter>
      </div>
    </SnackbarProvider>
  );
}

export default App;
