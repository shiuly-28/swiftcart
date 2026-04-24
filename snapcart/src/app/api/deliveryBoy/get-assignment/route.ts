import connectDb from "@/lib/db";
import DeliveryAssigment from "@/models/deliveryAssignment.model";

export async function GET(){
    try{
        await connectDb()
        const assignments=await DeliveryAssigment.find({

        })

    }catch(error){
        
    }
}