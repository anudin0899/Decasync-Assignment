// server/routes/supplier.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const SUPPLIER = require('../Models/supplierModel');

// Get all suppliers
router.get('/get_supplier', async (req, res) => {

    try {
        const suppliers = await SUPPLIER.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




router.post('/add_supplier', async (req, res) => {
    try {
        console.log("Adding supplier:", req.body);


        const { supplierName, mobileNo, email } = req.body;
        if (!supplierName || !mobileNo || !email) {
            return res.status(400).json({ message: 'Missing required fields: name and contact' });
        }

        const supplierId = uuidv4();


        const newSupplier = new SUPPLIER({ ...req.body, supplierNo: supplierId });
        console.log(newSupplier);
        
        const savedSupplier = await newSupplier.save();

        res.status(201).json(savedSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// Get active suppliers
router.get('/get_active_supplier', async (req, res) => {
   
    try {
        const suppliers = await SUPPLIER.find({ status: 'Active' });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;