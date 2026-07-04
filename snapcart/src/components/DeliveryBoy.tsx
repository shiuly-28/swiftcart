import React from 'react'
import DeliveryBoyDashboard from './DeliveryBoyDashboard'
import { auth } from '@/auth'

async function DeliveryBoy() {
  const session=await auth()
  return (
    <>
     <DeliveryBoyDashboard/>
    </>
  )
}

export default DeliveryBoy
