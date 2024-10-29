"use client"
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Instance from '@/Instance/axiosInstance'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const AddItem = ({ refreshData, openDialog, setOpenDialog }) => {



    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        itemName: '',
        inventoryLocation: '',
        brand: '',
        category: '',
        supplier: '',
        stockUnit: '',
        unitPrice: '',
        images: [],
        status: 'Enabled'
    });

    const [error, setError] = useState('');
    const [previewUrls, setPreviewUrls] = useState([]);

    const stockUnits = ['PCS', 'KG', 'LTR', 'BOX', 'MTR'];
    const categories = ['Electronics', 'Furniture', 'Stationery', 'Raw Materials', 'Tools'];

    useEffect(() => {
        fetchSuppliers();
    }, []);



    const fetchSuppliers = async () => {
        try {
            const response = await Instance.get('/get_active_supplier');
            setSuppliers(response.data);
        } catch (error) {
            setError('Failed to fetch suppliers');
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     // console.log(formData);

    //     try {
    //         const formData = new FormData();
    //         Object.keys(formData).forEach(key => {
    //             if (key === 'images') {
    //                 formData.images.forEach(image => {
    //                     formData.append('images', image);
    //                 });
    //             } else {
    //                 formData.append(key, formData[key]);
    //             }
    //         });

    //         console.log(formData);

    //         const response = await Instance.post('/item/create_item', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         if (response.status === 201) {
    //             setFormData({
    //                 itemName: '',
    //                 inventoryLocation: '',
    //                 brand: '',
    //                 category: '',
    //                 supplier: '',
    //                 stockUnit: '',
    //                 unitPrice: '',
    //                 images: [],
    //                 status: 'Enabled'
    //             });
    //             setPreviewUrls([]);
    //             refreshData();
    //             setError('');
    //         }
    //     } catch (error) {
    //         setError('Failed to save item');
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newFormData = new FormData();

            // Append all fields except images
            Object.keys(formData).forEach(key => {
                if (key !== 'images') {
                    newFormData.append(key, formData[key]);
                }
            });

            // Append the images
            formData.images.forEach(image => {
                newFormData.append('images', image);
            });

           

            const response = await Instance.post('/item/create_item', newFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                setFormData({
                    itemName: '',
                    inventoryLocation: '',
                    brand: '',
                    category: '',
                    supplier: '',
                    stockUnit: '',
                    unitPrice: '',
                    images: [],
                    status: 'Enabled'
                });
                setPreviewUrls([]);
                refreshData();
                setOpenDialog();
                setError('');
            }

        } catch (error) {
            setError('Failed to save item');
        }
    };




    return (
        <div>
            <Dialog open={openDialog} >
                <DialogContent className='bg-white flex flex-col items-center'>
                    <DialogHeader className='w-full px-5'>
                        <DialogTitle className='text-3xl font-bold my-5'>Add Suppliers</DialogTitle>
                        <DialogDescription >
                            <div>
                                <form onSubmit={handleSubmit} >
                                    <div className='mt-1 flex flex-col gap-2 '>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <Input
                                                placeholder="Item Name"
                                                value={formData.itemName}
                                                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                                required
                                            />

                                            <Input
                                                placeholder="Inventory Location"
                                                value={formData.inventoryLocation}
                                                onChange={(e) => setFormData({ ...formData, inventoryLocation: e.target.value })}
                                                required
                                            />


                                        </div>

                                        <div className='grid grid-cols-2 gap-2'>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={formData.supplier}
                                                onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Supplier" />
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


                                        <div className='grid grid-cols-2 gap-2'>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Unit Price"
                                                value={formData.unitPrice}
                                                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                                                required
                                            />
                                            <Input
                                                placeholder="Brand"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className='grid grid-cols-2 gap-2'>
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Enabled">Enabled</SelectItem>
                                                    <SelectItem value="Disabled">Disabled</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={formData.stockUnit}
                                                onValueChange={(value) => setFormData({ ...formData, stockUnit: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Stock Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {stockUnits.map((unit) => (
                                                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>

                                    <div className="mt-2">
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="border p-2"
                                        />

                                        {previewUrls.length > 0 && (
                                            <div className="grid grid-cols-4 gap-4 mt-2">
                                                {previewUrls.map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex gap-2 mt-10 items-center justify-center'>
                                        <Button variant='ghost'
                                            onClick={() => {
                                                setFormData({
                                                    itemName: '',
                                                    inventoryLocation: '',
                                                    brand: '',
                                                    category: '',
                                                    supplier: '',
                                                    stockUnit: '',
                                                    unitPrice: '',
                                                    images: [],
                                                    status: 'Enabled'
                                                });
                                                setPreviewUrls([]);
                                                setOpenDialog()
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">Submit</Button>
                                    </div>
                                </form>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div >

    )
}

export default AddItem