import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePassword, updatePassword } from "../redux/passwordsSlice";

export default function PasswordCard({ entry }) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    sitename: entry.sitename || "",
    url: entry.url || "",
    username: entry.username || "",
    password: entry.decryptedPassword || "",
  });

  const copy = (text) => navigator.clipboard.writeText(text);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordDisplay = () => {
    return showPassword
      ? entry.decryptedPassword
      : "•".repeat(entry.decryptedPassword.length);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      sitename: entry.sitename || "",
      url: entry.url || "",
      username: entry.username || "",
      password: entry.decryptedPassword || "",
    });
  };

  const handleSave = () => {
    if (
      !editData.sitename ||
      !editData.url ||
      !editData.username ||
      !editData.password
    ) {
      alert("All fields are required!");
      return;
    }

    dispatch(
      updatePassword({
        id: entry.id,
        ...editData,
      })
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      sitename: entry.sitename || "",
      url: entry.url || "",
      username: entry.username || "",
      password: entry.decryptedPassword || "",
    });
  };

  return (
    <div className="card">
      {isEditing ? (
        // Edit Form
        <div className="edit-form">
          <h3 className="site-name">Edit Password</h3>
          <input
            type="text"
            placeholder="Site Name"
            value={editData.sitename}
            onChange={(e) =>
              setEditData({ ...editData, sitename: e.target.value })
            }
            className="edit-input"
          />
          <input
            type="url"
            placeholder="Website URL"
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            className="edit-input"
          />
          <input
            type="text"
            placeholder="Username"
            value={editData.username}
            onChange={(e) =>
              setEditData({ ...editData, username: e.target.value })
            }
            className="edit-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={editData.password}
            onChange={(e) =>
              setEditData({ ...editData, password: e.target.value })
            }
            className="edit-input"
          />
          <div className="edit-buttons">
            <button onClick={handleSave} className="save-btn">
              💾 Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        // Display Mode
        <>
          <h3 className="site-name">{entry.sitename || "Unnamed Site"}</h3>
          <a
            href={entry.url}
            target="_blank"
            rel="noreferrer"
            className="site-url"
          >
            {entry.url}
          </a>
          <p>
            <strong>Username:</strong> <span>{entry.username}</span>{" "}
            <button onClick={() => copy(entry.username)} className="copy-btn">
              📋
            </button>
          </p>
          <p className="password-row">
            <strong>Password:</strong>
            <span className="password-text">{getPasswordDisplay()}</span>
            <button onClick={togglePasswordVisibility} className="eye-btn">
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            <button
              onClick={() => copy(entry.decryptedPassword)}
              className="copy-btn"
            >
              📋
            </button>
          </p>
          <div className="card-buttons">
            <button onClick={handleEdit} className="edit-btn">
              ✏️ Edit
            </button>
            <button
              onClick={() => dispatch(deletePassword(entry.id))}
              className="delete-btn"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
