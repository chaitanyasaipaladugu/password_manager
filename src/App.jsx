import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PasswordForm from "./components/PasswordForm";
import PasswordCard from "./components/PasswordCard";
import { fetchPasswords } from "./redux/passwordsSlice";
import { supabase } from "./supabase/client";
import Login from "./Login";
import Signup from "./Signup";
import VerificationPage from "./VerificationPage";
import Landing from "./Landing";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("landing");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const dispatch = useDispatch();
  const passwords = useSelector((state) => state.passwords.items);
  const loading = useSelector((state) => state.passwords.loading);
  const error = useSelector((state) => state.passwords.error);

  // Filter passwords based on search term
  const filteredPasswords = passwords.filter((password) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      password.sitename?.toLowerCase().includes(searchLower) ||
      password.url?.toLowerCase().includes(searchLower) ||
      password.username?.toLowerCase().includes(searchLower)
    );
  });

  // Check if user is already logged in (session persisted)
  useEffect(() => {
    const checkUser = async () => {
      // Check for reset password URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");

      if (type === "recovery" && accessToken && refreshToken) {
        // Don't auto-login if this is a password reset
        setUser(null);
        setCurrentPage("login");
        setIsPasswordRecovery(true);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Check if email is verified
        const verified = user.email_confirmed_at !== null;
        setIsEmailVerified(verified);
        if (verified) {
          setCurrentPage("vault");
          window.history.pushState({}, "", "/vault");
        } else {
          // If user is not verified, show verification page
          setCurrentPage("verification");
          setVerificationEmail(user.email);
          window.history.pushState({}, "", "/verification");
        }
      }
    };

    checkUser();

    // Listen for auth state changes to handle password recovery and email verification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);

      if (event === "PASSWORD_RECOVERY") {
        // Force login page for password recovery
        setUser(null);
        setCurrentPage("login");
        setIsPasswordRecovery(true);
      } else if (event === "SIGNED_IN" && session?.user) {
        // Check if this is a password recovery sign-in
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");

        if (type === "recovery" || isPasswordRecovery) {
          // Don't set user for password recovery
          setUser(null);
          setCurrentPage("login");
          setIsPasswordRecovery(true);
        } else {
          setUser(session.user);
          // Check if email is verified
          const verified = session.user.email_confirmed_at !== null;
          setIsEmailVerified(verified);

          if (verified) {
            setCurrentPage("vault");
            setIsPasswordRecovery(false);
            window.history.pushState({}, "", "/vault");
          } else {
            // If user is not verified, show verification page
            setCurrentPage("verification");
            setVerificationEmail(session.user.email);
            window.history.pushState({}, "", "/verification");
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setCurrentPage("landing");
        setIsPasswordRecovery(false);
        setIsEmailVerified(false);
        setVerificationEmail("");
        window.history.pushState({}, "", "/");
      } else if (event === "USER_UPDATED" && session?.user) {
        // Handle email verification
        const verified = session.user.email_confirmed_at !== null;
        setIsEmailVerified(verified);
        if (verified && user) {
          setCurrentPage("vault");
          window.history.pushState({}, "", "/vault");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch passwords once authenticated and verified
  useEffect(() => {
    if (user && isEmailVerified) {
      dispatch(fetchPasswords(user.id));
    }
  }, [user, isEmailVerified, dispatch]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "") {
        setCurrentPage("landing");
      } else if (path === "/login") {
        setCurrentPage("login");
      } else if (path === "/signup") {
        setCurrentPage("signup");
      } else if (path === "/verification") {
        setCurrentPage("verification");
      } else if (path === "/vault") {
        setCurrentPage("vault");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage("landing");
    setIsEmailVerified(false);
    setVerificationEmail("");
    window.history.pushState({}, "", "/");
  };

  const handleShowLogin = () => {
    setCurrentPage("login");
    window.history.pushState({}, "", "/login");
  };

  const handleShowSignup = () => {
    setCurrentPage("signup");
    window.history.pushState({}, "", "/signup");
  };

  const handleShowVerification = (email) => {
    setVerificationEmail(email);
    setCurrentPage("verification");
    window.history.pushState({}, "", "/verification");
  };

  const handleVerificationComplete = (verifiedUser) => {
    setUser(verifiedUser);
    setIsEmailVerified(true);
    setCurrentPage("vault");
    window.history.pushState({}, "", "/vault");
  };

  const handleBackToSignup = () => {
    setCurrentPage("signup");
    window.history.pushState({}, "", "/signup");
  };

  // Show landing page if not logged in and on landing page
  if (!user && currentPage === "landing") {
    return (
      <Landing onShowLogin={handleShowLogin} onShowSignup={handleShowSignup} />
    );
  }

  // Show verification page
  if (currentPage === "verification") {
    return (
      <VerificationPage
        email={verificationEmail}
        onVerificationComplete={handleVerificationComplete}
        onBackToSignup={handleBackToSignup}
        onSwitchToLogin={handleShowLogin}
      />
    );
  }

  // Show login/signup forms
  if (!user || isPasswordRecovery) {
    return currentPage === "signup" ? (
      <Signup
        onSignup={setUser}
        onSwitchToLogin={handleShowLogin}
        onShowVerification={handleShowVerification}
      />
    ) : (
      <Login onLogin={setUser} onSwitchToSignup={handleShowSignup} />
    );
  }

  // Show email verification message if user is not verified (fallback)
  if (user && !isEmailVerified) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <h2>📧 Email Verification Required</h2>
          <div className="verification-content">
            <div className="verification-icon">📧</div>
            <h3>Please Verify Your Email</h3>
            <p>
              Your account at <strong>{user.email}</strong> needs to be verified
              before you can access your password vault.
            </p>
            <p>
              Please check your email and click the verification link to
              continue.
            </p>

            <div className="verification-spinner">
              <div className="spinner"></div>
              <p>Waiting for verification...</p>
              <p className="verification-note">
                We'll automatically detect when you verify your email
              </p>
            </div>

            <div className="verification-actions">
              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="vault-header">
        <h1>🔐 My Password Vault</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">Error: {error}</div>}

      {/* Search Field */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="passwords-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <div className="loading-text">Loading passwords...</div>
          </div>
        ) : filteredPasswords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h3>
              {searchTerm ? "No passwords found" : "No passwords saved yet"}
            </h3>
            <p>
              {searchTerm
                ? "Try a different search term"
                : "Click the + button to add your first password"}
            </p>
          </div>
        ) : (
          <div className="list">
            {filteredPasswords.map((p) => (
              <PasswordCard key={p.id} entry={p} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fab-container">
        <button
          className="fab-button"
          onClick={() => setShowAddForm(true)}
          title="Add Password"
        >
          <span className="fab-icon">+</span>
          <span className="fab-tooltip">Add Password</span>
        </button>
      </div>

      {/* Add Password Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Password</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <PasswordForm user={user} onSuccess={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
