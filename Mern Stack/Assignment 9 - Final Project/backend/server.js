// 1. Import the Express library
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

// 2. Load environment variables (we will set this up next)
dotenv.config();
connectDB();

// 3. Create the generic application
const app = express();

// 4. Middlewares (Helpers)
// Allows our server to accept JSON data (like data from a form)
app.use(express.json());
// Allows our frontend (React) to talk to this backend
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/visitors', visitorRoutes);

// 5. Create a basic "Route"
// When someone visits the home page ('/'), say hello.
app.get('/', (req, res) => {
    res.send('API is running... Welcome to Visitor Management System!');
});

// 6. Define the PORT
const PORT = process.env.PORT || 5000;

// 7. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});