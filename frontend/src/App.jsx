import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Map from "./Map.jsx";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import ReportPage from "./pages/ReportPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

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
                <Navigate to="/" replace />
              </SignedIn>
            </>
          }
        />

        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Map />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        ></Route>
        <Route
          path="/report/:id"
          element={
            <>
              <SignedIn>
                <ReportPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
