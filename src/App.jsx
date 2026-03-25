import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import Clients from "./pages/Clients";
import CreateClient from "./pages/CreateClient";
import Products from "./pages/Products";
import PaymentsList from "./pages/Payments";
import Reports from "./pages/Reports";
import ChangePassword from "./pages/ChangePassword";
import { SnackbarProvider } from "notistack";

// ✅ ADD THESE IMPORTS
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import GithubCallback from "./pages/GithubCallback"; // add this page
import InvoicePreview from "./pages/InvoicePreview";
import Profile from "./pages/Profile";
import InvoicePublicView from "./pages/InvoicePublicView";
import AdaptiveSnowfall from "./components/AdaptiveSnowfall";
import FirstTimeChangePassword from "./pages/FirstTimeChangePassword";

// ✅ MICROSOFT CONFIG
const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173", // Must match Entra ID Portal exactly
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false, // Prevents MSAL from trying to handle the redirect automatically
  },
  cache: {
    cacheLocation: "localStorage", // Helps maintain session across refreshes
    storeAuthStateInCookie: false,
  },
});

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <MsalProvider instance={msalInstance}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <AuthProvider>
            <BrowserRouter>
              <AdaptiveSnowfall themeMode="light" />
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/chng-pwd" element={<ChangePassword />} />

                {/* ✅ ADD GITHUB CALLBACK */}
                <Route path="/github/callback" element={<GithubCallback />} />

                {/* PROTECTED ROUTES */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/invoices"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Invoices />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/create-invoice"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <CreateInvoice />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/clients"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Clients />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/firstTimePwd"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <FirstTimeChangePassword />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/add-customer"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <CreateClient />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Products />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <PaymentsList />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Reports />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoices-preview"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <InvoicePreview />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Profile />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoice/view/:id"
                  element={<InvoicePublicView />}
                />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </SnackbarProvider>
      </MsalProvider>
    </GoogleOAuthProvider>
  );
}
