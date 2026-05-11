import connectDb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await connectDb()
        const {orderId, otp}=await req.json()
        if(!orderId || otp){
             return NextResponse.json(
                         {message:"Incorrect or expected Otp"},
                        {status:400}
                       )
        }

            const order=await Order.findById(orderId)
            if(!order){
            return NextResponse.json(
             {message:"order not found"},
            {status:400}
           )
    }

    order.status="delivered"
    order.deliveryOtpVerification=true
    order.deliveredAt=new Date()
    await order.save()

    await DeliveryAssignment.updateOne(
        {order:orderId},
        {$set:{assignedTo:null, status:"completed"}}
    )

     return NextResponse.json(
             {message:"Delivery succesfully completed"},
            {status:200}
        )
    }


    catch(error){
         return NextResponse.json(
             {message:`veryfy otp error ${error}`},
            {status:500}
        )
    }
}