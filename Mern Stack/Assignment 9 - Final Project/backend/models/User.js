const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define the Schema (The Blueprint)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // This field is mandatory
    },
    email: {
        type: String,
        required: true,
        unique: true, // No two users can have the same email
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'security', 'host', 'visitor'], // Only these values are allowed
        default: 'visitor',
    },
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' times
});

// 2. Encrypt password before saving
// This function runs automatically before we save a user to the DB
userSchema.pre('save', async function (next) {
    // If the password hasn't been changed, skip this step
    if (!this.isModified('password')) {
        next();
    }
    // Generate salt (random data) and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 3. Method to compare passwords (for Login later)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;