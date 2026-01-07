const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    photo: {
        type: String
    },
    purpose: {
        type: String,
        required: true, // e.g., "Interview", "Meeting", "Delivery"
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links this visitor to an Employee (Host)
        required: false, // Sometimes visitors might not have a specific host
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'checked-in', 'checked-out', 'rejected'],
        default: 'pending',
    },
    entryTime: {
        type: Date,
    },
    exitTime: {
        type: Date,
    },
}, {
    timestamps: true
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;