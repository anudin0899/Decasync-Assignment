const express = require('express');
const router = express.Router();
const Item = require('../Models/itemModel');
const multer = require('multer');
const upload = require('../utils/multer');

// Get all items
router.get('/get_item', async (req, res) => {
  try {
    const items = await Item.find().populate('supplier');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new item
router.post('/create_item', upload.array('images'), async (req, res) => {
  const itemData = {
    ...req.body,
    images: req.files.map(file => file.path)
  };
  
  const item = new Item(itemData);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;