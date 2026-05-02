"use client"

import React, { useEffect, useState } from 'react'
import {motion} from 'motion/react'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, User, UserCheck } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import mongoose from 'mongoose'
import { IUser } from '@/models/user.models'

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

function AdminOrderCard({order}:{order:IOrder}) {
  console.log("Delivery Boy in UI:", order.assignedDeliveryBoy);
    const [expanded, setExpended] = useState(false)
    const [status, setStatus]=useState<string>("pending")
    const statusOption=["pending", "out of delivery"]

    const updateStatus=async(orderId:string,status:string)=>{
      try{
          const result=await axios.post(`/api/admin/update-order-status/${orderId}`,{status})
          console.log(result.data)
          setStatus(status)
      }catch(error){
        console.log(error)
      }
    }

    useEffect(()=>{
      setStatus(order.status)
    }, [order])


  return (
    <motion.div 
    key={order._id.toString()}
    initial={{opacity:0, y:20}}
    animate={{opacity:1, y:0}}
    transition={{duration: 0.4}}
    className='bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all mt-20'
    >
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div  className='space-x-1'>
            <p className='text-lg font-bold flex items-center gap-2 text-amber-600'>
                <Package size={20}/>
                Order #{order._id?.toString().slice(-6)}
            </p>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${
                order.isPaid
                ?"bg-amber-100 text-amber-600 border-amber-500"
                :"bg-red-600 bg-red-100 border-red-300"
            }`}>
                {order.isPaid?"Paid":"unpaid"}
            </span>
            <p className='text-sm text-gray-500'>
                {new Date(order.createdAt!).toLocaleDateString()}
            </p>
            <div className='mt-3 space-y-1 text-gray-700 text-sm font-semibold'>
                <p className='flex gap-3 mt-3 items-center text-sm'>
                    <User size={16} className='text-amber-500'/>
                    <span>{order?.address.fullName}</span>
                </p>
                <p className='flex gap-3 mt-3 items-center text-sm'>
                    <Phone size={16} className='text-amber-500'/>
                    <span>{order?.address.mobile}</span>
                </p>
                <p className='flex gap-3 mt-3 items-center text-sm'>
                    <MapPin size={16} className='text-amber-500'/>
                    <span>{order?.address.fullAddress}</span>
                </p>
                
            </div>
            <p className='flex gap-3 mt-3 items-center text-sm text-gray-600'>
                    <CreditCard size={16} className='text-amber-500'/>
                    <span>{order.paymentMethod === "cod" ? "Cash On Delivery" : "Online Payment"}</span>
                </p>

                {
                  order.assignedDeliveryBoy && <div className='mt-4 bg-amber-50 border
                   border-amber-200 rounded-xl p-5 flex items-center justify-between'>
                    <div className='flex items-center gap-3 text-sm text-gray-700'>
                      <UserCheck className='text-amber-600' size={18}/>
                      <div className='font-semibold text-gray-800'>
                        <p>Assigned to : <span>{order.assignedDeliveryBoy.name}</span></p>
                        <p>📞 +088 {order.assignedDeliveryBoy.mobile}</p>
                      </div>
                    </div>
                    <a href={`tel:${order.assignedDeliveryBoy.mobile}`}
                    className='bg-amber-600 text-white text-xs px-3 py-1.5 hover:bg-amber-700 transition rounded-lg'
                    >Call</a>
                  </div>
                }
        </div>
        <div className='flex flex-col items-start md:items-end gap-2'>
            <span className={`textt-xs font-semibold px-3 py-1 rounded-full capitalize ${
                status === "delivered"
                ? "bg-amber-100 text-amber-600"
                :status === "pending"
                ?"bg-yellow-100 text-yellow-600"
                :"bg-blue-100 text-amber-500"
                }`}>
                {status}
            </span>
            <select className='border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-amber-400 focus:ring-2
            focus:ring-amber-400 outline-none'
            value={status}
            onChange={(e)=>updateStatus(order._id?.toString(),e.target.value)}
            >
                {
                    statusOption.map(st=>(
                        <option key={st} value={st}>{st.toUpperCase()}</option>
                    ))
                }
            </select>
        </div>
      </div>
        <div className='border-t text-gray-300 mt-3 pt-3'>
          <button 
          onClick={()=>setExpended(prev=>!prev)}
          className='w-full flex justify-between items-center text-sm font-medium hover:text-amber-500 transition'
          >
            <span className='flex items-center gap-2'>
              <Package size={16} className='text-amber-500'/>
              {expanded?"Hide Order Items":`Veiw ${order.items.length} Items`}
            </span>
            {expanded?<ChevronUp className='text-amber-500' size={16}/>:<ChevronDown/>}
          </button>
          <motion.div 
          initial={{height: 0, opacity: 0}}
          animate={{
            height:expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{duration: 0.3}}
          className='overflow-hidden'
          >
            <div className='mt-3 space-y-3'>
              {order.items.map((item,index)=>(
                <div
                key={index}
                className='flex justify-between items-center bg-gray-50 rounded-xl
                px-3 py-2 hover:bg-gray-100 transition'>
                  <div className='flex items-center gap-3'>
                    <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg
                    objacet-cover border border-gray-200"/>
                    <div>
                      <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                      <p className='text-gray-600 '>{item.quantity} x {item.unit}</p>
                    </div>
                  </div>

                   <p className='text-sm font-semibold text-gray-800'>{Number(item.price)*item.quantity}</p>

                </div>
              ))}
            </div>
          </motion.div>
         </div>
          <div className='border-t pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-300'>
          <div className="flex gap-3">
            <Truck className='text-amber-500 mt-1' size={16}/>
              <span className='text-gray-500'> Delivery: <span className='text-amber-500'>{status}</span></span>
          </div>
          <div className="text-gray-700">
            Total: <span className='text-amber-500'>{order.totalAmount}</span>
          </div>
         </div>
    </motion.div>
  )
}

export default AdminOrderCard
