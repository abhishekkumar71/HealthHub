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

  useEffect(() => {
    axios
      .get("/api/me")
      .then((res) => setUser(res.data))
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
      <div className="layout">
        <BrowserRouter>
          <Navbar setAuthOpen={setAuthOpen} setAuthMode={setAuthMode} />
          <div className="pageContent">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sessions/:id" element={<SessionDetails />} />
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
                path="/dashboard/edit/:id"
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
              onSuccess={() => {
                setAuthOpen(false);
                window.location.reload();
              }}
            />
          )}
        </BrowserRouter>
      </div>
    </SnackbarProvider>
  );
}

export default App;
