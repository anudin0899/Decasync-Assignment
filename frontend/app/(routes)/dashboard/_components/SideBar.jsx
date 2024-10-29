"use client"
import React from 'react'
import Image from 'next/image'
import { Car, LayoutGrid, ListOrdered, ShieldCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {

    const menuList = [
        { id: 1, name: 'Dashboard', icon: <LayoutGrid />, path: '/' },
        { id: 2, name: 'Supplier', icon: <Car />, path: '/dashboard/supplier' },
        { id: 3, name: 'Purchase', icon: <ShieldCheck />, path: '/dashboard/purchase' },
        { id: 4, name: 'Order', icon: <ListOrdered />, path: '/dashboard/orders' },
    ];

    const path = useParams();

    return (
        <div className='h-screen p-5 border shadow-sm'>
            <Image src={'/logo.svg'} alt='logo' width={160} height={100} />
            <div className='mt-5'>
                {menuList.map((menu, index) => (
                    <Link href={menu.path} key={index}>
                        <h2 className={`flex gap-2 items-center text-gray-500 
                        font-medium p-5 mb-2 cursor-pointer rounded-md
                        hover:text-primary hover:bg-gray-200
                        ${path == menu.path && 'text-primary bg-gray-200'}`}>
                            {menu.icon}
                            {menu.name}
                        </h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Sidebar