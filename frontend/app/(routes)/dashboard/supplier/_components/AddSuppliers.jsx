"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Instance from '@/Instance/axiosInstance'



const AddSuppliers = ({ refreshData, openDialog, setOpenDialog }) => {


    const [formData, setFormData] = useState({
        supplierName: '',
        address: '',
        taxNo: '',
        country: '',
        mobileNo: '',
        email: '',
        status: 'Active'
    });

    const [error, setError] = useState('');

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
        'Japan', 'Australia', 'India', 'China', 'Brazil'
    ];



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const response = await Instance.post('/add_supplier', formData);

            if (response.status === 201) { // Assuming 201 Created status code
                setFormData({
                    supplierName: '',
                    address: '',
                    taxNo: '',
                    country: '',
                    mobileNo: '',
                    email: '',
                    status: 'Active'
                });

                refreshData();
                setError('');
            }
        } catch (error) {
            setError('Failed to save supplier');
        }
    };




    return (
        <div>
            <Dialog open={openDialog} >
                <DialogContent className='bg-white flex flex-col items-center'>
                    <DialogHeader className='w-full px-10'>
                        <DialogTitle className='text-3xl font-bold my-5'>Add Suppliers</DialogTitle>
                        <DialogDescription >
                            <form onSubmit={handleSubmit} >
                                <div className='mt-5 flex flex-col gap-2 '>

                                    <Input
                                        placeholder="Supplier Name"
                                        value={formData.supplierName}
                                        onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                                        required
                                    />

                                    <Input
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />

                                    <Input
                                        placeholder="TAX No"
                                        value={formData.taxNo}
                                        onChange={(e) => setFormData({ ...formData, taxNo: e.target.value })}
                                        required
                                    />

                                    <Select
                                        value={formData.country}
                                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country} value={country}>
                                                    {country}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="number"
                                        placeholder="Mobile No"
                                        value={formData.mobileNo}
                                        onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                                        required
                                    />

                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />

                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Blocked">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>


                                </div>

                                <div className='flex gap-2 mt-10 items-center justify-center'>
                                    <Button variant='ghost'
                                        onClick={() => {
                                            setFormData({
                                                supplierName: '',
                                                address: '',
                                                taxNo: '',
                                                country: '',
                                                mobileNo: '',
                                                email: '',
                                                status: 'Active'
                                            });
                                            setOpenDialog()
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Submit</Button>
                                </div>
                            </form>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div >

    )
}

export default AddSuppliers