import { Button } from '@/components/ui/button'
import React from 'react'

const Purchase = () => {
  return (
    <div className='p-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='font-bold text-2xl'>Purchase</h2>
                </div>
                <div>
                    <Button>+ Add Purchase</Button>
                </div>
            </div>
            <div>

            <Input
                    type='text'
                    value={amount}
                    placeholder='e.g. $1000'
                    onChange={(e) => { setAmount(e.target.value) }}
                />

            </div>
        </div>
  )
}

export default Purchase