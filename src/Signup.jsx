import React, { useState } from "react";
import { supabase } from "./supabase/client";

export default function Signup({
  onSignup,
  onSwitchToLogin,
  onShowVerification,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password generator function
  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let generatedPassword = "";

    // Ensure at least one character from each category
    generatedPassword +=
      uppercase[Math.floor(Math.random() * uppercase.length)];
    generatedPassword +=
      lowercase[Math.floor(Math.random() * lowercase.length)];
    generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
    generatedPassword += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest with random characters
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < 16; i++) {
      generatedPassword +=
        allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    generatedPassword = generatedPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(generatedPassword);
    setConfirmPassword(generatedPassword);
  };

  // Password validation rules
  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return rules;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    // Validate password
    const passwordRules = validatePassword(password);
    const passwordErrors = [];

    if (!passwordRules.length) passwordErrors.push("At least 8 characters");
    if (!passwordRules.uppercase)
      passwordErrors.push("At least 1 uppercase letter");
    if (!passwordRules.lowercase)
      passwordErrors.push("At least 1 lowercase letter");
    if (!passwordRules.number) passwordErrors.push("At least 1 number");
    if (!passwordRules.special)
      passwordErrors.push("At least 1 special character");

    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors });
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrors({ general: error.message });
      } else {
        // Redirect to verification page
        onShowVerification(email);
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
    }

    setLoading(false);
  };

  const passwordRules = validatePassword(password);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>🔐 Create Your Vault</h2>
        <form onSubmit={handleSignup} className="form">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-input-container">
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={generatePassword}
              className="generate-password-btn"
              title="Generate Secure Password"
            >
              Generate
            </button>
          </div>

          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Password Rules Display */}
          <div className="password-rules">
            <h4>Password Requirements:</h4>
            <ul>
              <li className={passwordRules.length ? "valid" : "invalid"}>
                ✓ At least 8 characters
              </li>
              <li className={passwordRules.uppercase ? "valid" : "invalid"}>
                ✓ At least 1 uppercase letter
              </li>
              <li className={passwordRules.lowercase ? "valid" : "invalid"}>
                ✓ At least 1 lowercase letter
              </li>
              <li className={passwordRules.number ? "valid" : "invalid"}>
                ✓ At least 1 number
              </li>
              <li className={passwordRules.special ? "valid" : "invalid"}>
                ✓ At least 1 special character
              </li>
            </ul>
          </div>

          {/* Error Messages */}
          {errors.password && (
            <div className="error">
              {errors.password.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}

          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}

          {errors.general && <div className="error">{errors.general}</div>}

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="link-button"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
