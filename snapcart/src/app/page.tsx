
import { auth } from '@/auth'
import EditRoleMobile from '@/components/EditRoleMobile'
import Navber from '@/components/Navber'
import connectDb from '@/lib/db'
import User from '@/models/user.models'
import { redirect } from 'next/navigation'
import AdminDashBoard from '@/components/AdminDashBoard'
import DeliveryBoy from '@/components/DeliveryBoy'


import React from 'react'
import UsersDashboard from '@/components/UsersDashboard'
import GeoUpdated from '@/components/GeoUpdated'



async function Home() {
  await connectDb()
  const session=await auth()
  const user=await User.findById(session?.user?.id)
  // console.log(user)
  if(!user){
    redirect("/login")
  }
  const inComplete=!user.mobile || !user.role || (!user.mobile && user.
    role=="user")
    if(inComplete){
      return<EditRoleMobile/>
    }
    const plainUser=JSON.parse(JSON.stringify(user))
    console.log(plainUser)
    console.log(user)
  return (
    <>
      <Navber user={plainUser}/>
      <GeoUpdated userId={plainUser._id}/>
      {user.role == "user" ?(
        <UsersDashboard/>
      ): user.role == "admin" ? (
        <AdminDashBoard/>
      ) : <DeliveryBoy/> }
    </>
  )
}

export default Home
