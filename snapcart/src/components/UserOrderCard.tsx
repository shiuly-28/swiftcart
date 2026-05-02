"use client"
import {motion} from 'motion/react'
import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Truck, UserCheck } from 'lucide-react'
import { div } from 'motion/react-client'
import Image from 'next/image'
import { getSocket } from '@/lib/socket'
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

function UserOrderCard({order}:{order:IOrder}) {
  const [expanded, setExpended]=useState(false)
  const [status, setStatus] = useState(order.status)

  const getStatusColor=(status:string)=>{
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
        case "out of delivery":
          return "bg-blue-100 text-blue-700 border-blue-300"
        case "delivered":
          return "bg-amber-100 text-amber-700 border-amber-4300"
    
      default:
        return "bg-gray-100 text-600 border-gray-300"
    }
  }

  useEffect(():any=>{
const socket=getSocket()
socket.on("order-status-update", (data)=>{
if(data.orderId.toString()==order?._id!.toString()){
  setStatus(data.status)
}
})
  },[])
  return (
    <motion.div 
    initial={{opacity:0, y:15}}
    animate={{opacity:1, y:0}}
    transition={{duration: 0.4}}
    className='bg-white rounded-2xl border border-gray-100 shadow-md 
    hover:shadow-lg transition-all duration-300 overflow-hidden'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center
      gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-amber-50 to-white'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>Order<span className='text-amber-600 font-bold'> #{order?._id?.toString()?.slice(-6)}</span></h3>
          <p className='text-gray-600'>{new Date(order.createdAt!).toLocaleString()}</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <span 
          className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            order.isPaid
            ?"bg-amber-100 text-amber-600 border-amber-500"
            :"bg-red-100 text-red-700 border-amber-300"
          }`}
          >
            {order.isPaid?"Paid":"unpaid"}
          </span>
          <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(
            status
          )}`}>
            {status}
          </span>
        </div>

      </div>

       

      <div className='p-5 space-y-4'>
        {order.paymentMethod=="cod"?<div className='flex items-center gap-2 text-amber-500 text-sm '>
          <Truck size={16} className='text-amber-500'/>
          Cash On Delivery
      </div>:<div className='flex items-center gap-2 text-amber-500 text-sm '>
        <CreditCard size={16} className='text-amber-500'/>
        Online Payment
         </div> }

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
                  </div>}

                  <button className='w-full flex items-center justify-center gap-2 bg-amber-600 text-white
                  font-semibold px-4 py-2 rounded-xl shadow hover:bg-amber-700 transition'><Truck size={18}/>Track Your Order</button>

         <div className='flex items-center gap-2 text-gray-700 text-sm'>
          <MapPin size={16} className='text-amber-500'/>
         
          <span className='truncate'>{order.address.fullAddress}</span>
         </div>

         <div className='border-t text-gray-300 pt-3'>
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

         <div className='border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-300'>
          <div className="flex gap-3">
            <Truck className='text-amber-500 mt-1' size={16}/>
              <span className='text-gray-500'> Delivery: <span className='text-amber-500'>{status}</span></span>
          </div>
          <div className="text-gray-700">
            Total: <span className='text-amber-500'>{order.totalAmount}</span>
          </div>
         </div>
        </div>

        
    </motion.div>
  )
}

export default UserOrderCard
