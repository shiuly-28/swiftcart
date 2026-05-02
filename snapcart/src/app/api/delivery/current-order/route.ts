import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Order from "@/models/order.model";

export async function GET(){
    try{
        await connectDb()
        const session=await auth()
        const deliveryBoyId=session?.user?.id
        const order=await Order.findById({assignedDeliveryBoy:deliveryBoyId})
    }catch (error){

    }
}