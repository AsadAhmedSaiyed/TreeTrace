import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Map from "./Map.jsx";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import ReportPage from "./pages/ReportPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import RoleSelectionPage from "./pages/RoleSelectionPage.jsx";
import NGODashboard from "./pages/NGODashboard.jsx";
import CheckUserRole from "./components/CheckUserRole.jsx";
import RequireRole from "./components/RequireRole.jsx";

function App() {
  return (
    <BrowserRouter>
      <header>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <>
              <SignedOut>
                <SignInPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/" replace />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/sign-up"
          element={
            <>
              <SignedOut>
                <SignUpPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/select-role" replace />
              </SignedIn>
            </>
          }
        />

        {/* Role Selection */}
        <Route
          path="/select-role"
          element={
            <SignedIn>
              <RoleSelectionPage />
            </SignedIn>
          }
        />

        {/* User Routes */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <CheckUserRole>
                  <Map />
                </CheckUserRole>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/report/:id"
          element={
            <>
              <SignedIn>
                <CheckUserRole>
                  <ReportPage />
                </CheckUserRole>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />

        {/* NGO Routes */}
        <Route
          path="/ngo/dashboard"
          element={
            <>
              <SignedIn>
                <CheckUserRole>
                  <RequireRole allowedRoles={['NGO_MANAGER']}>
                    <NGODashboard />
                  </RequireRole>
                </CheckUserRole>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-600">You don't have permission to view this page</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;