"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'


function DeliveryBoyDashboard() {
  const [assignments, setAssignments] = useState<any[]>([])
  useEffect(()=>{
   const fetchAssignments=async ()=>{
     try{
      const result = await axios.get("/api/delivery/get-assignments")
        setAssignments(result.data)
    }catch(error){

    }
   }
   fetchAssignments()
  },[])
  return (
    <div className='w-full min-h-screen bg-gray-50 p-4'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mt-[100px]'>Delivery Assignment</h2>
        {
          assignments?.map(a=>(
           <div key={a._id} className='p-5 bg-white rounded-xl shadow mb-4 border'>
            <p>{a?.order?._id?.slice(-6)}</p>
           </div>
          ))
        }
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard
