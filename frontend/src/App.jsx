import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import { api } from "./api";


function App() {
  // We keep user state at the top level so all pages can access it
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/auth/me")
      .then(({ data }) => { if (active) setUser(data); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setCheckingSession(false); });
    return () => { active = false; };
  }, []);

  const logout = async () => {
    setLogoutError("");
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch {
      setLogoutError("Could not log out. Check your connection and try again.");
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {checkingSession ? <p className="p-8 text-center text-gray-600">Checking your session…</p> : <Routes>
          {/* If not logged in, show Login. If logged in, redirect to dashboard */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
          />
          
          {/* Protect these routes: if no user, redirect back to login */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} onLogout={logout} logoutError={logoutError} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/chat" 
            element={user ? <Chat onLogout={logout} logoutError={logoutError} /> : <Navigate to="/" />} 
          />
        </Routes>}
      </div>
    </BrowserRouter>
  );
}

export default App;
