import React from 'react'
import AdminDashboardClient from './AdminDashboardClient'
import connectDb from '@/lib/db'
import Order from '@/models/order.model'
import User from '@/models/user.models'
import Grocery from '@/models/grocery.model'

async function AdminDashBoard() {
  await connectDb()
  const orders = await Order.find({})
  const user = await User.find({role:"user"})
  const groceries=await Grocery.find({})
  return (
   <>
   <AdminDashboardClient/>
   </>
  )
}

export default AdminDashBoard
