"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import AddSuppliers from './_components/AddSuppliers'
import Instance from '@/app/Instance/axiosInstance'

const Supplier = () => {

    const [openDialog, setOpenDialog] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await Instance.get('/get_supplier');
            const data = await response.data;
            setSuppliers(data);
            setError('');
        } catch (error) {
            setError('Failed to fetch suppliers');
        }
    };

    return (
        <div className='p-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='font-bold text-2xl'>Suppliers</h2>
                </div>
                <div>
                    <Button onClick={() => setOpenDialog(true)}>+ Add Suppliers</Button>
                </div>
            </div>
            <div>
                <AddSuppliers openDialog={openDialog} setOpenDialog={() => setOpenDialog(false)} />

                {/* display table */}

                <div className="bg-white rounded-lg mt-10 shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="p-4 font-medium text-gray-600">Supplier No</th>
                                    <th className="p-4 font-medium text-gray-600">Name</th>
                                    <th className="p-4 font-medium text-gray-600">Email</th>
                                    <th className="p-4 font-medium text-gray-600">Country</th>
                                    <th className="p-4 font-medium text-gray-600">Status</th>
                                    <th className="p-4 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {suppliers.map((supplier) => (
                                    <tr key={supplier._id} className="hover:bg-gray-50">
                                        <td className="p-4">{supplier.supplierNo}</td>
                                        <td className="p-4">{supplier.supplierName}</td>
                                        <td className="p-4">{supplier.email}</td>
                                        <td className="p-4">{supplier.country}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    supplier.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {supplier.status}
                                            </span>
                                        </td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Supplier