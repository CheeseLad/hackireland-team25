const express = require('express');
const { getCalendarEvents } = require('../api/calendar');

const router = express.Router();

router.get('/calendar/events', async (req, res) => {
    const authToken = req.cookies.googleAuthToken;

    if (!authToken) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const events = await getCalendarEvents(authToken);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

module.exports = router;