const mongoose = require('mongoose');
const schema = mongoose.Schema;

const itemSchema = new schema({
    itemNo: {
        type: String,
        unique: true,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    inventoryLocation: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    stockUnit: {
        type: String,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
}, { timestamps: true })

module.exports = mongoose.model('ITEM', itemSchema)