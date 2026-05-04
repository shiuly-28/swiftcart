"use client"
import { IUser } from '@/models/user.models';
import axios from 'axios';
import mongoose from 'mongoose';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

//  interface IOrder{
//     _id:mongoose.Types.ObjectId
//     user:mongoose.Types.ObjectId
//     items:[
//         {
//             grocery:mongoose.Types.ObjectId,
//             name:string,
//             price:string,
//             unit:string,
//             image:string
//             quantity:number
//         }
//     ]
//     isPaid:boolean
//     totalAmount:number,
//     paymentMethod:"cod" | "online"
//     address:{
//         fullName:string,
//         mobile:string,
//         city:string,
//         state:string,
//         pincode:string,
//         fullAddress:string,
//         latitude:number,
//         longitude:number
//     }
//     assignment?:mongoose.Schema.Types.ObjectId
//     assignedDeliveryBoy?:IUser
//     status:"pending" | "out of delivery" | "delivered",
//     createdAt?:Date
//     updated?:Date
// }
// interface Ilocation{
//   latitude:number,
//   longitude:number
// }

function TrackerOrder({params}:{params:{orderId:string}}){

  const {orderId}=useParams()
  // const [order, setOrder]=useState<IOrder>()
  // const [userLocation, setUserLocation]=useState<Ilocation>(
  //   {
  //     latitude:0,
  //     longitude:0
  //   }
  // )
  //  const [deliveryBoyLocation, setDeliveryBoyLocation]=useState<Ilocation>(
  //    {
  //      latitude:0,
  //      longitude:0
  //    }
  //  )
  useEffect(()=>{
    const getOrder=async ()=>{
      try{
        const result=await axios.get(`/api/user/get-order/${orderId}`)
        console.log(result)
        // setOrder(result.data)
        // setUserLocation({
        //     latitude:result.data.address.latitude,
        //     longitude:result.data.address.longitude
        // })
      }catch(error){
        console.log("I am from client")
        console.log(error)
      }
    }
    getOrder()
  }, [orderId])
  return (
    <div className=''>
      
    </div>
  );
};

export default TrackerOrder;