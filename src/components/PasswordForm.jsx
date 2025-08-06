import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPassword } from "../redux/passwordsSlice";

export default function PasswordForm({ user, onSuccess }) {
  const [siteName, setSiteName] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!siteName || !url || !username || !password) return;
    dispatch(
      addPassword({ siteName, url, username, password, user_id: user.id })
    );
    setSiteName("");
    setUrl("");
    setUsername("");
    setPassword("");
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        placeholder="Site Name (e.g., Google, Facebook)"
        value={siteName}
        onChange={(e) => setSiteName(e.target.value)}
      />
      <input
        placeholder="Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="password-input-container">
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
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
      <button type="submit">Add Password</button>
    </form>
  );
}
