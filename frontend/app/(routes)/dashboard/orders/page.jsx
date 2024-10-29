"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Instance from '@/Instance/axiosInstance'
import { AlertCircle, FileSpreadsheet, Printer } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Orders = () => {

    const [orderNo, setOrderNo] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const packingUnits = ['PCS', 'BOX', 'CTN', 'PKT'];

    useEffect(() => {
        fetchSuppliers();
        fetchItems();
    }, []);


    const fetchSuppliers = async () => {
        try {
            const response = await Instance.get('/get_active_supplier');
            const data = await response.data;

            setSuppliers(data);
            setError('');
        } catch (error) {
            setError('Failed to fetch suppliers');
        }
    };

    const fetchItems = async () => {
        try {
            const response = await Instance.get('/item/get_item');
            const data = await response.data;
            setItems(data);
            setError('');
        } catch (error) {
            setError('Failed to fetch items');
        }
    };

    const handleAddItem = () => {
        setSelectedItems([...selectedItems, {
            itemNo: '',
            itemName: '',
            // stockUnit: '',
            unitPrice: '',
            packingUnit: '',
            orderQty: '',
            itemAmount: '',
            discount: '',
            netAmount: ''
        }]);
    };

    const handleRemoveItem = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        if (field === 'itemNo') {
            const selectedItem = items.find(item => item.itemNo === value);
            console.log(selectedItem, value);

            if (selectedItem) {
                updatedItems[index] = {
                    ...updatedItems[index],
                    item: selectedItem._id,
                    itemName: selectedItem.itemName,
                    stockUnit: selectedItem.stockUnit,
                    unitPrice: selectedItem.unitPrice,
                    packingUnit: selectedItem.stockUnit
                };
            }
        }

        if (['orderQty', 'unitPrice', 'discount'].includes(field)) {
            const qty = parseFloat(updatedItems[index].orderQty) || 0;
            const price = parseFloat(updatedItems[index].unitPrice) || 0;
            const discount = parseFloat(updatedItems[index].discount) || 0;
            updatedItems[index].itemAmount = qty * price;
            updatedItems[index].netAmount = (qty * price) - discount;
        }

        setSelectedItems(updatedItems);
    };

    const calculateTotals = () => {
        const itemTotal = selectedItems.reduce((sum, item) => sum + (item.itemAmount || 0), 0);
        const totalDiscount = selectedItems.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0);
        const netAmount = itemTotal - totalDiscount;
        return { itemTotal, totalDiscount, netAmount };
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!selectedSupplier) {
                throw new Error('Please select a supplier');
            }

            if (selectedItems.length === 0) {
                throw new Error('Please add at least one item');
            }

            const { itemTotal, totalDiscount, netAmount } = calculateTotals();

            const orderData = {
                orderNo,
                orderDate,
                supplier: selectedSupplier,
                items: selectedItems,
                itemTotal,
                discount: totalDiscount,
                netAmount
            };

            console.log(orderData);
            
            const response = await Instance.post('/orders/add_orders', orderData);

            if (response.status === 201) {
                // throw new Error('Failed to create purchase order');
                console.log("sucess");

            }

            setSelectedItems([]);
            setSelectedSupplier('');
            // generateOrderNo();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExportToExcel = async () => {
        try {
            const response = await fetch(`/api/orders/${orderNo}/export`);
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PO-${orderNo}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            setError('Failed to export purchase order to Excel');
        }
    };

    const handlePrint = async () => {
        try {
            const response = await fetch(`/api/purchase-orders/${orderNo}/print`);
            if (!response.ok) throw new Error('Failed to generate print preview');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const printWindow = window.open(url);
            printWindow.onload = () => {
                printWindow.print();
                window.URL.revokeObjectURL(url);
            };
        } catch (error) {
            setError('Failed to print purchase order');
        }
    };

    const { itemTotal, totalDiscount, netAmount } = calculateTotals();



    return (
        <div className='p-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='font-bold text-2xl'>Orders</h2>
                </div>
            </div>
            <div>

                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 p-4 rounded-md flex items-center mt-2 gap-2 text-red-700">
                                <AlertCircle className="h-5 w-5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-5">

                            <div>
                                <label className="block text-sm font-medium mb-1">Order Date</label>
                                <Input
                                    type="date"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Supplier</label>
                                <Select
                                    value={selectedSupplier}
                                    onValueChange={setSelectedSupplier}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((supplier) => (
                                            <SelectItem key={supplier._id} value={supplier._id}>
                                                {supplier.supplierName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedItems.map((item, index) => (
                                <div key={index} className="grid grid-cols-9 gap-2 items-end">
                                    <div>
                                        <Select
                                            value={item.itemNo}
                                            onValueChange={(value) => handleItemChange(index, 'itemNo', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Item No" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {items.map((i) => (
                                                    <SelectItem key={i.itemNo} value={i.itemNo}>
                                                        {i.itemNo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            value={item.itemName}
                                            readOnly
                                            className="bg-gray-50"
                                            placeholder="Item Name"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            value={item.stockUnit}
                                            readOnly
                                            className="bg-gray-50"
                                            placeholder="Stock Unit"
                                        />
                                    </div>
                                    {/* <div>
                                        <Select
                                            value={item.packingUnit}
                                            onValueChange={(value) => handleItemChange(index, 'packingUnit', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pack Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {packingUnits.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>
                                                        {unit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div> */}
                                    <div>
                                        <Input
                                            type="number"
                                            value={item.orderQty}
                                            onChange={(e) => handleItemChange(index, 'orderQty', e.target.value)}
                                            placeholder="Qty"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            readOnly
                                            className="bg-gray-50"
                                            placeholder="Price"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="number"
                                            value={item.discount}
                                            onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                            placeholder="Discount"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="number"
                                            value={item.netAmount}
                                            readOnly
                                            className="bg-gray-50"
                                            placeholder="Net Amount"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveItem(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <Button type="button" onClick={handleAddItem}>
                            Add Item
                        </Button>

                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-4 text-right">
                                <div className="col-start-2">
                                    <div className="flex justify-between py-2">
                                        <span>Item Total:</span>
                                        <span>${itemTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span>Total Discount:</span>
                                        <span>${totalDiscount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 font-bold">
                                        <span>Net Amount:</span>
                                        <span>${netAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="submit"
                                disabled={loading || selectedItems.length === 0}
                            >
                                {loading ? 'Creating...' : 'Create Purchase Order'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleExportToExcel}
                                disabled={loading}
                            >
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                                Export to Excel
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrint}
                                disabled={loading}
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </Button>
                        </div>
                    </form>
                </div>



            </div>
        </div>
    )
}

export default Orders