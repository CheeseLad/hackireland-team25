require('dotenv').config();
const { google } = require('googleapis');
const express = require('express');
const cookieParser = require('cookie-parser');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

router.get('/auth/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.redirect(authUrl);
});

router.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    
    res.cookie('googleAuthToken', tokens.access_token, { httpOnly: true });

    res.send('Authentication successful! You can now use the Calendar API.');
});

module.exports = router;