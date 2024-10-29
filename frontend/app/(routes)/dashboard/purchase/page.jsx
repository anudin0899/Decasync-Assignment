"use client"
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import AddItem from './_components/AddItem';
import Instance from '@/Instance/axiosInstance';

const Purchase = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

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

  return (
    <div className='p-10'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='font-bold text-2xl'>Purchase</h2>
        </div>
        <div>
          <Button onClick={() => setOpenDialog(true)}>+ Add Purchase</Button>
        </div>
      </div>
      <div>
        <AddItem
          refreshData={() => fetchItems()}
          openDialog={openDialog}
          setOpenDialog={() => setOpenDialog(false)}
        />

        {/* display table */}

        <div className="bg-white rounded-lg mt-10 shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Item No</th>
                  <th className="p-4 font-medium text-gray-600">Name</th>
                  <th className="p-4 font-medium text-gray-600">Brand</th>
                  <th className="p-4 font-medium text-gray-600">Category</th>
                  <th className="p-4 font-medium text-gray-600">Unit Price</th>
                  <th className="p-4 font-medium text-gray-600">Status</th>
               
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-4">{item.itemNo}</td>
                    <td className="p-4">{item.itemName}</td>
                    <td className="p-4">{item.brand}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">${parseFloat(item.unitPrice).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Enabled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {item.status}
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

export default Purchase