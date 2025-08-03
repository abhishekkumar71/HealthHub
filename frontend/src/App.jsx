import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbarxxx";
import Footer from "./components/Footerxxx";
import LandingPage from "./pages/landingPage";
import AuthModal from "./pages/Authenthication";
import Dashboard from "./pages/Dashboard";
import "./styles/App.css";
import NewSession from "./pages/newSession";
import EditSession from "./pages/editSession";
import AllPosts from "./pages/AllPosts";
import { SnackbarProvider } from "notistack";
import SessionDetails from "./pages/sessionDetails";
function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  return (
    <SnackbarProvider maxSnack={1}>
      <div className="layout">
        <BrowserRouter>
          <Navbar setAuthOpen={setAuthOpen} setAuthMode={setAuthMode} />
          <div className="pageContent">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sessions/:id" element={<SessionDetails />} />

              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    setAuthOpen={setAuthOpen}
                    setAuthMode={setAuthMode}
                  />
                }
              />
              <Route path="/dashboard/new" element={<NewSession />} />
              <Route path="/dashboard/edit/:id" element={<EditSession />} />
              <Route path="/explore" element={<AllPosts />} />
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
