import { Button } from '@/components/ui/button'
import React from 'react'

const Orders = () => {
  return (
    <div className='p-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='font-bold text-2xl'>Orders</h2>
                </div>
                <div>
                    <Button>+ Add Orders</Button>
                </div>
            </div>
            <div>

            </div>
        </div>
  )
}

export default Orders