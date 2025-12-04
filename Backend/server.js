const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Load credentials
const CRED_PATH = path.join(__dirname, 'credentials.json');
if (!fs.existsSync(CRED_PATH)) {
    console.error('Missing credentials.json in backend folder.');
    process.exit(1);
}
const creds = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8')).web;

// Session configuration
app.use(session({
    secret: 'kafka-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: creds.client_id,
    clientSecret: creds.client_secret,
    callbackURL: creds.redirect_uris[0]
}, (accessToken, refreshToken, profile, cb) => {
    // Store profile in session
    return cb(null, profile);
}));

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../Frontend")));

// Show Welcome Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// Show Login Page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/login.html"));
});

// Start OAuth flow
app.get('/auth/google', (req, res, next) => {
    // Capture role from query parameter (student/professional/hr)
    const role = req.query.role || 'student';
    req.session.userRole = role;
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// OAuth2 callback
app.get('/oauth2callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // User is authenticated, store role in session
    req.session.userRole = req.session.userRole || 'student';
    req.session.user = req.user;
    res.redirect('/dashboard');
});

// Role-based dashboard routes
app.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const role = req.session.userRole || 'student';
    const dashboardFile = `${role}-dashboard.html`;
    const filePath = path.join(__dirname, "../Frontend", dashboardFile);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.send(`<h1>Welcome ${role}!</h1><p>User: ${req.user.displayName}</p><a href="/logout">Logout</a>`);
    }
});

// Student-specific route
app.get("/student", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, "../Frontend/student-login.html"));
});

// Professional-specific route
app.get("/professional", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, "../Frontend/professional-login.html"));
});

// HR-specific route
app.get("/hr", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, "../Frontend/hr-login.html"));
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send('Logout failed');
        req.session.destroy();
        res.redirect('/login');
    });
});

// Show Next Page (backward compatibility)
app.get("/next", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, "../Frontend/nextpage.html"));
});

// API endpoint to get current user info
app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({ authenticated: false });
    }
    res.json({
        authenticated: true,
        user: req.user,
        role: req.session.userRole
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
    console.log("Routes available:");
    console.log("  / - Welcome page");
    console.log("  /login - Login page");
    console.log("  /auth/google?role=student - OAuth flow for student");
    console.log("  /auth/google?role=professional - OAuth flow for professional");
    console.log("  /auth/google?role=hr - OAuth flow for HR");
    console.log("  /dashboard - Role-based dashboard");
    console.log("  /api/user - Get current user info");
    console.log("  /logout - Logout");
});
