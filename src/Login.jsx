import React, { useState } from "react";
import { supabase } from "./supabase/client";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Login failed: " + error.message);
    } else {
      window.history.pushState({}, "", "/vault");
      onLogin(data.user);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setResetMessage("Error: " + error.message);
    } else {
      setResetMessage("Password reset link sent to your email!");
      setResetEmail("");
      setShowResetModal(false);
    }
    setResetLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetMessage("Passwords don't match!");
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setResetMessage("Error: " + error.message);
    } else {
      setResetMessage("Password updated successfully! You can now login.");
      setNewPassword("");
      setConfirmPassword("");

      // Sign out the user after password update
      await supabase.auth.signOut();

      // Close the reset form after a short delay
      setTimeout(() => {
        setShowResetForm(false);
        setResetMessage("");
        // Force page reload to clear any cached auth state
        window.location.reload();
      }, 2000);
    }
    setResetLoading(false);
  };

  // Check if we're on the reset password page
  React.useEffect(() => {
    const handleResetPassword = async () => {
      // Check for reset password URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");
      const type = urlParams.get("type");

      if (type === "recovery" && accessToken && refreshToken) {
        try {
          // Set the session from the URL parameters
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            // Show the reset password form
            setShowResetForm(true);
            // Clear the URL parameters
            window.history.replaceState({}, "", "/login");
          } else {
            console.error("Error setting session:", error);
          }
        } catch (error) {
          console.error("Error handling reset password:", error);
        }
      }
    };

    handleResetPassword();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        // Show reset password form when password recovery is detected
        setShowResetForm(true);
        // Clear URL parameters
        window.history.replaceState({}, "", "/login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check for reset password URL parameters on every render
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (type === "recovery" && accessToken && refreshToken && !showResetForm) {
      // Force show reset form if we detect recovery parameters
      setShowResetForm(true);
      // Clear URL parameters immediately
      window.history.replaceState({}, "", "/login");
    }
  }, [showResetForm]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>🔐 Login to Your Vault</h2>
        <form onSubmit={handleLogin} className="form">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-input-container">
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="forgot-password-btn"
            >
              Forgot password?
            </button>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="auth-switch">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="link-button"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button
                className="modal-close"
                onClick={() => setShowResetModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="form">
              <p className="reset-instructions">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <input
                placeholder="Enter your email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              {resetMessage && (
                <div
                  className={`reset-message ${
                    resetMessage.includes("Error") ? "error" : "success"
                  }`}
                >
                  {resetMessage}
                </div>
              )}
              <button type="submit" disabled={resetLoading}>
                {resetLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Form */}
      {showResetForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Set New Password</h2>
              <button
                className="modal-close"
                onClick={() => setShowResetForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePasswordUpdate} className="form">
              <p className="reset-instructions">
                Enter your new password below.
              </p>
              <input
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="8"
              />
              <input
                placeholder="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="8"
              />
              {resetMessage && (
                <div
                  className={`reset-message ${
                    resetMessage.includes("Error") ? "error" : "success"
                  }`}
                >
                  {resetMessage}
                </div>
              )}
              <button type="submit" disabled={resetLoading}>
                {resetLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
