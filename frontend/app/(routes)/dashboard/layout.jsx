"use client"
import React, { useEffect } from 'react'

import Navbar from './_components/Navbar'
import Sidebar from './_components/SideBar'


const DashboardLayout = ({ children }) => {

    

    return (
        <div>
            <div className='fixed md:w-64 hidden md:block '>
                <Sidebar />
            </div>
            <div className='md:ml-64 '>
                <Navbar />
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout