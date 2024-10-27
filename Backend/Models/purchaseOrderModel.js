const mongoose = require('mongoose');
const schema = mongoose.Schema;

const purchaseOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ITEM',
        required: true
    },
    packingUnit: {
        type: String,
        required: true
    },
    orderQty: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    itemAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    netAmount: {
        type: Number,
        required: true
    }
});

const purchaseOrderSchema = new schema({
    orderNo: {
        type: String,
        unique: true,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SUPPLIER',
        required: true
    },
    items: [purchaseOrderItemSchema],
    itemTotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    netAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('PURCHASEORDER', purchaseOrderSchema)