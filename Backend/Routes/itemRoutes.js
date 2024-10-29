const express = require('express');
const router = express.Router();
const ITEM = require('../Models/itemModel');
const { v4: uuidv4 } = require('uuid');
const upload = require('../utils/multer');

// Get all items
router.get('/get_item', async (req, res) => {
  try {
    const items = await ITEM.find().populate('supplier');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new item
router.post('/create_item', upload.array('images'), async (req, res) => {

  try {
    const itemData = {
      itemNo: uuidv4(),
      ...req.body,
      images: req.files.map(file => file.originalname)
    };

    const item = new ITEM(itemData);
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;