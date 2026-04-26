"use client"
import axios from 'axios'
import React, { useEffect } from 'react'

function DeliveryBoyDashboard() {
  useEffect(()=>{
   const fetchAssignment=async ()=>{
     try{
      const result = await axios.get("/api/deliveryBoy/get-assignment")
      console.log(result)
    }catch(error){

    }
   }
   fetchAssignment()
  },[])
  return (
    <div>
      
    </div>
  )
}

export default DeliveryBoyDashboard
