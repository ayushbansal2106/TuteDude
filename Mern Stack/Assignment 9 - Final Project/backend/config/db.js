const mongoose = require('mongoose');

// This function connects to the database
const connectDB = async () => {
    try {
        // We try to connect using the address in our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If something goes wrong (like DB is off), print error and stop server
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;