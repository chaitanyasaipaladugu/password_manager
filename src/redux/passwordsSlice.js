import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabase/client";
import CryptoJS from "crypto-js";

const masterKey = "my-secret-key"; // You can prompt user for this

export const fetchPasswords = createAsyncThunk(
  "passwords/fetch",
  async (user_id) => {
    try {
      console.log("Fetching passwords for user:", user_id);
      const { data, error } = await supabase
        .from("passwords")
        .select("*")
        .eq("user_id", user_id);

      if (error) {
        console.error("Supabase error fetching passwords:", error);
        throw error;
      }

      console.log("Fetched passwords:", data);
      return (data || []).map((item) => ({
        ...item,
        decryptedPassword: CryptoJS.AES.decrypt(
          item.password,
          masterKey
        ).toString(CryptoJS.enc.Utf8),
      }));
    } catch (error) {
      console.error("Error fetching passwords:", error);
      throw error;
    }
  }
);

export const addPassword = createAsyncThunk("passwords/add", async (entry) => {
  try {
    console.log("Adding password:", { ...entry, password: "[HIDDEN]" });

    const encrypted = CryptoJS.AES.encrypt(
      entry.password,
      masterKey
    ).toString();
    const { data, error } = await supabase
      .from("passwords")
      .insert([
        {
          sitename: entry.siteName, // Changed from siteName to sitename
          url: entry.url,
          username: entry.username,
          password: encrypted,
          user_id: entry.user_id,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Password added successfully:", data[0]);
    return {
      ...data[0],
      decryptedPassword: entry.password,
    };
  } catch (error) {
    console.error("Error adding password:", error);
    throw error;
  }
});

export const deletePassword = createAsyncThunk(
  "passwords/delete",
  async (id) => {
    await supabase.from("passwords").delete().eq("id", id);
    return id;
  }
);

export const updatePassword = createAsyncThunk(
  "passwords/update",
  async (entry) => {
    try {
      console.log("Updating password:", { ...entry, password: "[HIDDEN]" });

      const encrypted = CryptoJS.AES.encrypt(
        entry.password,
        masterKey
      ).toString();

      const { data, error } = await supabase
        .from("passwords")
        .update({
          sitename: entry.sitename,
          url: entry.url,
          username: entry.username,
          password: encrypted,
        })
        .eq("id", entry.id)
        .select();

      if (error) {
        console.error("Supabase error updating password:", error);
        throw error;
      }

      console.log("Password updated successfully:", data[0]);
      return {
        ...data[0],
        decryptedPassword: entry.password,
      };
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
);

const passwordsSlice = createSlice({
  name: "passwords",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPasswords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPasswords.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log("Redux state updated with passwords:", action.payload);
      })
      .addCase(fetchPasswords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Redux fetch error:", action.error);
      })
      .addCase(addPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        console.log("Password added to Redux state:", action.payload);
      })
      .addCase(addPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Redux add error:", action.error);
      })
      .addCase(deletePassword.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter((p) => p.id !== deletedId);
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPassword = action.payload;
        const index = state.items.findIndex((p) => p.id === updatedPassword.id);
        if (index !== -1) {
          state.items[index] = updatedPassword;
        }
        console.log("Password updated in Redux state:", updatedPassword);
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Redux update error:", action.error);
      });
  },
});

export default passwordsSlice.reducer;
