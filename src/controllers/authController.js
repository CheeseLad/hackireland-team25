// src/controllers/authController.js
import { oauth2Client, getAuthUrl } from "../api/auth.js";
import { firestore } from "../config/firebase.js";
import { google } from "googleapis";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions




export const googleAuth = (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Structure user data
    const userData = {
      uid: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expiry_date,
    };

    // Store user data in Firestore
    const userRef = doc(firestore, "users", userInfo.id);
    await setDoc(userRef, userData, { merge: true });

    res.json({
      success: true,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expiry_date,
    });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};
