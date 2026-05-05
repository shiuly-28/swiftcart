"use client"
import LiveMap from '@/components/LiveMap';
import { getSocket } from '@/lib/socket';
import { IUser } from '@/models/user.models';
import axios from 'axios';
import { ArrowLeftIcon } from 'lucide-react';
import mongoose from 'mongoose';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

 interface IOrder{
    _id:mongoose.Types.ObjectId
    user:mongoose.Types.ObjectId
    items:[
        {
            grocery:mongoose.Types.ObjectId,
            name:string,
            price:string,
            unit:string,
            image:string
            quantity:number
        }
    ]
    isPaid:boolean
    totalAmount:number,
    paymentMethod:"cod" | "online"
    address:{
        fullName:string,
        mobile:string,
        city:string,
        state:string,
        pincode:string,
        fullAddress:string,
        latitude:number,
        longitude:number
    }
    assignment?:mongoose.Schema.Types.ObjectId
    assignedDeliveryBoy?:IUser
    status:"pending" | "out of delivery" | "delivered",
    createdAt?:Date
    updated?:Date
}
interface Ilocation{
  latitude:number,
  longitude:number
}

function TrackerOrder({params}:{params:{orderId:string}}){

  const {orderId}=useParams()
  const router=useRouter()
  const [order, setOrder]=useState<IOrder>()
  const [userLocation, setUserLocation]=useState<Ilocation>(
    {
      latitude:0,
      longitude:0
    }
  )
   const [deliveryBoyLocation, setDeliveryBoyLocation]=useState<Ilocation>(
     {
       latitude:0,
       longitude:0
     }
   )
  useEffect(()=>{
    const getOrder=async ()=>{
      try{
        const result=await axios.get(`/api/auth/user/get-order/${orderId}`)
        console.log(result)
        setOrder(result.data)
        setUserLocation({
            latitude:result.data.address.latitude,
            longitude:result.data.address.longitude
        })
        setDeliveryBoyLocation({
          latitude:result.data.assignedDeliveryBoy.location.coordination[1],
          longitude:result.data.assignedDeliveryBoy.location.coordination[0],
        })
      }catch(error){
        console.log("I am from client")
        console.log(error)
      }
    }
    getOrder()
  }, [orderId])

  useEffect(():any=>{
    const socket=getSocket()
    socket.on("updated-deliverryBoy-location", (data)=>{
     
        setDeliveryBoyLocation({
          latitude:data.location.coordinates[1] ?? data.location.latitude,
          longitude:data.location.coordinates[0] ?? data.location.longitude
        })
      
    })
    return()=>socket.off("updated-deliverryBoy-location")
  },[order])
  return (
    <div className='w-full min-h-screen bg-linear-to-b from-amber-50 to-white mt-5'>
      <div className='max-w-2xl mx-auto pb-24'>
        <div className='sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow flex gap-3
        items-center z-999'>
          <button className='p-2 bg-amber-100 rounded-full text-amber-500' onClick={()=>router.back()}><ArrowLeftIcon/></button>
          <div>
            <h2 className='text-xl font-bold'>Track Order</h2>
            <p className='text-sm text-gray-700 font-semibold'>order# {order?._id?.toString().slice(-6)}<span>{order?.status}</span></p>
          </div>
         
        </div>
         <div className='px-4 mt-10'>
            <div className='rounded-3xl overflow-hidden border shadow'>
              <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
            </div>
          </div>
      </div>
      
    </div>
  );
};

export default TrackerOrder;

