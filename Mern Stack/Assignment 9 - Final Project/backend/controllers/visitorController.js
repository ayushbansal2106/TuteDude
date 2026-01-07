const Visitor = require('../models/Visitor');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all visitors
const getVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find({});
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not fetch visitors' });
    }
};

// @desc    Register a new visitor
const addVisitor = async (req, res) => {
    const { name, email, phone, purpose, host, photo } = req.body;

    if (!name || !email || !phone || !purpose) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        // 1. Create Visitor
        const visitor = await Visitor.create({
            name, email, phone, purpose, host, photo
        });

        // 2. Try to Send Email (Don't crash if it fails)
        try {
            const message = `Hello ${name},\n\nYour visitor pass for ${purpose} has been generated.\n\nPlease show your QR code at the reception.`;
            await sendEmail(email, 'Your Visitor Pass Details', message);
        } catch (emailError) {
            console.error("Email failed to send:", emailError.message);
            // We do NOT return an error to the frontend, because the visitor was successfully created.
            // We just log it for the admin.
        }

        res.status(201).json(visitor);

    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: 'Server Error: Could not create visitor' });
    }
};

// @desc    Update visitor status
const updateVisitorStatus = async (req, res) => {
    const { status } = req.body;
    
    try {
        const visitor = await Visitor.findById(req.params.id);

        if (visitor) {
            visitor.status = status;
            if (status === 'checked-in') visitor.entryTime = Date.now();
            if (status === 'checked-out') visitor.exitTime = Date.now();

            const updatedVisitor = await visitor.save();
            res.json(updatedVisitor);
        } else {
            res.status(404).json({ message: 'Visitor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not update status' });
    }
};

module.exports = { getVisitors, addVisitor, updateVisitorStatus };