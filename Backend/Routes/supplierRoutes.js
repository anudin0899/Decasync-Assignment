// server/routes/supplier.js
const express = require('express');
const router = express.Router();
const Supplier = require('../Models/supplierModel');

// Get all suppliers
router.get('/get_supplier', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new supplier
router.post('/add_supplier', async (req, res) => {
    const supplier = new Supplier(req.body);
    try {
        const newSupplier = await supplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get active suppliers
router.get('/get_active_supplier', async (req, res) => {
    try {
        const suppliers = await Supplier.find({ status: 'Active' });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;