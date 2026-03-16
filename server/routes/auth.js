const express = require('express');
const router = express.Router();
// Authentication is now handled directly by Supabase on the client-side.
// We don't need backend routes for login/register anymore unless we're doing SSR.
// Keeping this file empty but valid to avoid breaking imports.

router.get('/status', (req, res) => {
    res.json({ message: "Auth is handled by Supabase Client" });
});

module.exports = router;
