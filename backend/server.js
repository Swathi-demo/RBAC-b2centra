require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const session = require('express-session'); // To manage sessions
const protectedRoutes = require("./routes/protectedRoutes");
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true })); // Set up session management
app.use(passport.initialize());
app.use(passport.session()); // Allow persistent login sessions
app.use("/api/protected", protectedRoutes);
//Define the /api/user route
app.get('/api/user', (req, res) => {
    res.json({
        displayName: "John Doe",
        email: "john.doe@example.com",
    });
});
const shipments = [
    {
      id: '1',
      origin: 'New York',
      destination: 'Los Angeles',
      currentLocation: { lat: 34.0522, lng: -118.2437 },
      status: 'In Transit',
    },
    {
      id: '2',
      origin: 'London',
      destination: 'Paris',
      currentLocation: { lat: 48.8566, lng: 2.3522 },
      status: 'Delivered',
    },
    {
      id: '3',
      origin: 'Tokyo',
      destination: 'Osaka',
      currentLocation: { lat: 35.6895, lng: 139.6917 },
      status: 'Delayed',
    },
  ];
  
  app.get('/api/shipments', (req, res) => {
    res.json(shipments);
  });
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((error) => console.error("Could not connect to MongoDB:", error));

// SAML Configuration for Passport
passport.use(new SamlStrategy(
    {
        entryPoint: process.env.SAML_ENTRY_POINT, // Set in .env, e.g., Azure AD Login URL
        issuer: process.env.SAML_ISSUER,          // Entity ID, set in .env
        callbackUrl: process.env.SAML_CALLBACK_URL, // URL where Azure AD sends SAML responses
        cert: process.env.SAML_CERT               // Certificate content, set in .env
        
    },
    (profile, done) => {
        // Handle user profile after authentication
        done(null, profile);
    }
));

// Serialize and deserialize user (to handle sessions)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Define SAML routes
app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

app.post('/auth/callback',
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    (req, res) => res.redirect('/') // Redirect after successful login
);

// Example of a protected route
app.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send("You are authenticated");
    } else {
        res.redirect('/login');
    }
});

// API Routes
const itemRoutes = require('./api/items');
app.use('/api/items', itemRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
