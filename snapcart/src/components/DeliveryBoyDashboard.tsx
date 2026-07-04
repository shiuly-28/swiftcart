"use client"
import { getSocket } from '@/lib/socket'
import { RootState } from '@/redux/store'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DeliveryChat from './DeliveryChat'
import dynamic from 'next/dynamic'
import {  Loader } from 'lucide-react'
import { div } from 'motion/react-client'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const LiveMap = dynamic(() => import('@/components/LiveMap'), { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
});

interface Ilocation{
  latitude:number,
  longitude:number
}

function DeliveryBoyDashboard({earning}:{earning:number}) {
  const [assignments, setAssignments] = useState<any[]>([])
  const {userData}=useSelector((state:RootState)=>state.user)
  const [activeOrder, setActiveOrder]=useState<any>(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otpError, setOtpError]=useState("")
  const [sendOtpLoading, setSendOtpLoading]=useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading]=useState(false)
  const [otp, setOtp]=useState("")
  const [userLocation, setUserLocation] = useState<Ilocation>(
      {
      latitude:0,
      longitude:0
    }
  );
  const [deliveryBoyLocation, setDeliveryBoyLocation]=useState<Ilocation>(
    {
      latitude:0,
      longitude:0
    }
  )

   const fetchAssignments=async ()=>{
     try{
      const result = await axios.get("/api/delivery/get-assignments")
        setAssignments(result.data)
    }catch(error){
      console.log(error)
    }
   }

   useEffect(()=>{
    const socket=getSocket()
     if(!userData)return
        if(!navigator.geolocation)return
        const watcher=navigator.geolocation.watchPosition((pos)=>{
            const lat=pos.coords.latitude
            const lon=pos.coords.longitude
            setDeliveryBoyLocation({
              latitude:lat,
              longitude:lon
            })
            socket.emit("updated-location",{
                userId:userData?._id,
                latitude:lat,
                longitude:lon
            })
        },(err)=>{
            console.log(err)
        },{enableHighAccuracy:true})
    return ()=>navigator.geolocation.clearWatch(watcher)
   },[userData?._id])

useEffect((): any => {
    const socket=getSocket()

    socket.on("new-assignment", (deliveryAssignment)=>{
      setAssignments((prev)=>[...prev,deliveryAssignment])
    })
    return () => socket.off("new-assignment")
  },[])

const handleAccept = async (id: string) => {
    try {
        const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
        // console.log(result.data)
        fetchCurrentOrder()  // ← accept এর পরে active order load করো
    } catch (error) {
        console.log(error)
    }
}

 const fetchCurrentOrder = async () => {
    try {
        const result = await axios.get("/api/delivery/current-order")
        if (result.data.active) {
            setActiveOrder(result.data.assignment)
            setUserLocation({
                latitude: result.data.assignment?.order?.address?.latitude ?? 0,
                longitude: result.data.assignment?.order?.address?.longitude ?? 0
            })
        }
    } catch (error) {
        console.log(error)
    }
}

  useEffect(():any=>{
    const socket=getSocket()
    socket.on("updated-deliverryBoy-location", ({userId, location})=>{
      setDeliveryBoyLocation({
        latitude:location.coordinates[1],
        longitude:location.coordinates[0]
      })
    })
    return ()=>socket.off("updated-deliverryBoy-location")
  },[])
  
    useEffect(()=>{
  fetchCurrentOrder()
   fetchAssignments()
  },[userData])

 // ১. sendOtp ফাংশন সংশোধন
const sendOtp = async () => {
    console.log("activeOrder full data:", JSON.stringify(activeOrder, null, 2))  // ← এই line যোগ করো
    
    if (!activeOrder?.order?._id) {
        console.error("No active order found to send OTP");
        return;
    }

    setSendOtpLoading(true);
    try {
        const result = await axios.post("/api/delivery/otp/send", { 
            orderId: activeOrder.order._id 
        });
        console.log(result.data);
        setShowOtpBox(true);
    } catch (error) {
        console.log(error);
    } finally {
        setSendOtpLoading(false);
    }
};

// ২. veryfyOtp ফাংশন সংশোধন
const veryfyOtp = async () => {
  if (!activeOrder?.order?._id || !otp) {
    setOtpError("Invalid Order or OTP");
    return;
  }

  setVerifyOtpLoading(true);
  try {
    const result = await axios.post("/api/delivery/otp/verify", { 
      orderId: activeOrder.order._id, 
      otp 
    });
    console.log(result.data);
    
    // OTP ভেরিফাই হওয়ার পর স্টেট ক্লিনআপ
    setActiveOrder(null); 
    setShowOtpBox(false);
    setOtp("");
    
    // নতুন অর্ডারের জন্য পুনরায় রিফ্রেশ
    await fetchCurrentOrder();
    await fetchAssignments();
  } catch (error) {
    setOtpError("Otp Verification Error");
  } finally {
    setVerifyOtpLoading(false);
  }
};

if(!activeOrder && assignments.length===0){
  const todaysEarning=[
    {name:"Today",
      earning,
      deliveries:earning/40
    }
  ]
  return(
    <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-white
    to-amber-50 p-6 mt-10'>
      <div className='max-w-md w-full text-center'>
        <h2 className='text-2xl font-bold text-gray-500'>No Active Deliveries🏬</h2>
        <p className='text-gray-500 mb-5'>Stay online to receive new orders</p>

        <div className='bg-white border rounded-xl shadow-xl p-6'>
          <h2 className='font-medium text-amber-700 mb-2'>Today's Performance</h2>

           <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={todaysEarning}>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip />
                        <Legend/>
                        <Bar dataKey="earning" name="Earning"/>
                        <Bar dataKey="deliveries" name="Deliveries"/>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className='mt-4 text-lg font-bold text-amber-600'>{earning || 0} Earned Today</p>
                  <button className='mt-4 w-full bg-amber-500 hover:bg-amber-700 text-white 
                  py-2 rounded-lg'>Refresh Earning</button>
        </div>
      </div>
    </div>
  )
}
  if(activeOrder && userLocation){

    return(
      <div className='p-4 pt-[120px] min-h-screen bg-gray-50 ' >
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-2xl font-bold text-amber-700 mb-2'>Active Delivery</h1>
          <p>Order# {activeOrder?.order?._id?.slice(-6)}</p>
          <div className='rounded-xl border text-gray-300 shadow-lg overflow-hidden mb-6'>
            <LiveMap userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation}/>
          </div>
          {/* <DeliveryChat orderId={activeOrder.order?._id} deliveryBoyId={userData?._id!}/> */}
          {userData?._id && (
          <DeliveryChat 
          orderId={activeOrder.order?._id} 
          deliveryBoyId={userData._id} 
        />
      )}
      <div className='mt-6 bg-white rounded-xl border shadow p-6 '>
        {!activeOrder?.order?.deliveryOtpVerification && !showOtpBox && (
          <button
          onClick={sendOtp}
         className='w-full bg-amber-600 text-white rounded-lg py-3 text-center'
         >{sendOtpLoading?<Loader size={16} className='animate-spin text-white text-center'/>:"Mark As Delivered"}</button>
        )}
        {
          showOtpBox && 
          <div className='mt-4'>
            <input type="text" className='w-full py-3 border rounded-lg text-center'
            placeholder='Enter Otp' maxLength={4} onChange={(e)=>setOtp(e.target.value)}  value={otp}/>
            <button className='w-full bg-amber-600 text-white py-3 rounded-lg mt-4'
             onClick={veryfyOtp}>{verifyOtpLoading?
              <Loader size={16} className='animate-spin text-white text-center'/>: "Verify OTP"}</button>
            {otpError && <div className='text-red-600 mt-2'>{otpError}</div>}
          </div>
        }
        {activeOrder?.order?.deliveryOtpVerification && <div className='text-amber-700 text-center font-bold'>Delivery Completed!</div>}
        
      </div>

        </div>
      </div>
    )
  }
  return (
    <div className='w-full min-h-screen bg-gray-50 p-4 '>
      <div className='max-w-3xl mx-auto '>
        <h2 className='text-2xl font-bold mt-[100px] mb-[30px]'>Delivery Assignment</h2>
        {
          assignments?.map((a,index)=>(
           <div key={index} className='p-5 bg-white rounded-xl shadow mb-4 border'>
            <p><b>Order id</b> #{a?.order?._id?.slice(-6)}</p>
            <p className='text-gray-600'>{a.order.address.fullAddress}</p>
            
            <div className='flex gap-3 mt-4'>
              <button className='flex-1 bg-amber-500 text-white py-2 rounded-lg'
              onClick={()=> handleAccept(a._id)}
              >Accept</button>
              <button className='flex-1 bg-red-500 text-white py-2 rounded-lg'>Reject</button>
            </div>
           </div>
          ))
        }
      </div>
    </div>
  )
}

export default DeliveryBoyDashboard