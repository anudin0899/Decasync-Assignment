const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../Models/purchaseOrderModel');
const excel = require('exceljs');

// Get all purchase orders
router.get('/get_orders', async (req, res) => {
    try {
        const orders = await PurchaseOrder.find()
            .populate('supplier')
            .populate('items.item');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new purchase order
router.post('/add_orders', async (req, res) => {
    const order = new PurchaseOrder(req.body);
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Export to Excel
router.get('/:id/export', async (req, res) => {
    try {
        const order = await PurchaseOrder.findById(req.params.id)
            .populate('supplier')
            .populate('items.item');

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Purchase Order');

        // Add headers
        worksheet.addRow(['Purchase Order Details']);
        worksheet.addRow(['Order No:', order.orderNo]);
        worksheet.addRow(['Order Date:', order.orderDate]);
        worksheet.addRow(['Supplier:', order.supplier.supplierName]);
        worksheet.addRow([]);
        worksheet.addRow(['Item No', 'Item Name', 'Unit', 'Qty', 'Price', 'Amount', 'Discount', 'Net Amount']);

        // Add items
        order.items.forEach(item => {
            worksheet.addRow([
                item.item.itemNo,
                item.item.itemName,
                item.packingUnit,
                item.orderQty,
                item.unitPrice,
                item.itemAmount,
                item.discount,
                item.netAmount
            ]);
        });

        // Add totals
        worksheet.addRow([]);
        worksheet.addRow(['', '', '', '', 'Total:', order.itemTotal]);
        worksheet.addRow(['', '', '', '', 'Discount:', order.discount]);
        worksheet.addRow(['', '', '', '', 'Net Amount:', order.netAmount]);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=PO-${order.orderNo}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;