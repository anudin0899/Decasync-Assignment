const mongoose = require('mongoose');
const schema = mongoose.Schema;

const supplierSchema = new schema({
    supplierNo: {
        type: String,
        unique: true,
        required: true
    },
    supplierName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    taxNo: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Blocked'],
        default: 'Active'
    }
}, { timestamps: true })

module.exports = mongoose.model('SUPPLIER', supplierSchema)