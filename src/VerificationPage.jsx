import React, { useState, useEffect } from "react";
import { supabase } from "./supabase/client";

export default function VerificationPage({
  email,
  onVerificationComplete,
  onBackToSignup,
  onSwitchToLogin,
}) {
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationChecked, setVerificationChecked] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Check for email verification periodically
  useEffect(() => {
    if (!verificationChecked) {
      const checkVerification = async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user && user.email_confirmed_at) {
            // Email is verified, show success and proceed to vault
            setVerificationChecked(true);
            setVerificationSuccess(true);
            // Wait 2 seconds to show success message, then proceed
            setTimeout(() => {
              onVerificationComplete(user);
            }, 2000);
          }
        } catch (error) {
          console.log("Verification check error:", error);
        }
      };

      // Check immediately
      checkVerification();

      // Check every 2 seconds (more frequent for better UX)
      const interval = setInterval(checkVerification, 2000);

      return () => clearInterval(interval);
    }
  }, [verificationChecked, onVerificationComplete]);

  // Also listen for auth state changes to detect verification immediately
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("VerificationPage - Auth state change:", event, session);

      if (
        (event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED") &&
        session?.user
      ) {
        if (session.user.email_confirmed_at && !verificationChecked) {
          // Email is verified, show success and proceed to vault
          setVerificationChecked(true);
          setVerificationSuccess(true);
          // Wait 2 seconds to show success message, then proceed
          setTimeout(() => {
            onVerificationComplete(session.user);
          }, 2000);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [verificationChecked, onVerificationComplete]);

  const handleResendVerification = async () => {
    setVerificationLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Verification email sent again!" });
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setErrors({});
        }, 3000);
      }
    } catch (error) {
      setErrors({ general: "Failed to resend verification email" });
    }
    setVerificationLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>📧 Verify Your Email</h2>
        <div className="verification-content">
          {verificationSuccess ? (
            <>
              <div className="verification-icon success">✅</div>
              <h3>Email Verified!</h3>
              <p>
                Your email has been successfully verified. Redirecting to your
                password vault...
              </p>
              <div className="verification-spinner">
                <div className="spinner"></div>
                <p>Setting up your vault...</p>
              </div>
            </>
          ) : (
            <>
              <div className="verification-icon">📧</div>
              <h3>Check Your Email</h3>
              <p>
                We've sent a verification link to <strong>{email}</strong>
              </p>
              <p>
                Please click the link in your email to verify your account and
                continue to your password vault.
              </p>

              <div className="verification-spinner">
                <div className="spinner"></div>
                <p>Waiting for verification...</p>
                <p className="verification-note">
                  We'll automatically detect when you verify your email
                </p>
              </div>

              {errors.general && <div className="error">{errors.general}</div>}

              <div className="verification-actions">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={verificationLoading}
                  className="resend-btn"
                >
                  {verificationLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </button>

                <button
                  type="button"
                  onClick={onBackToSignup}
                  className="back-btn"
                >
                  Back to Signup
                </button>
              </div>

              <div className="auth-switch">
                <p>
                  Already verified?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="link-button"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
