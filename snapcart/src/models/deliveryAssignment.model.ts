import mongoose from "mongoose";

interface IDeliveryAssigment{
    _id:mongoose.Types.ObjectId
    order:mongoose.Types.ObjectId
    bordcastedTo:mongoose.Types.ObjectId[]
    assignedTo:mongoose.Types.ObjectId | null
    status:"brodcasted" | "assigned" | "completed"
    acceptedAt:Date
    createdAt?:Date
    updatedAt?:Date

}

const deliveryAssignmentSchema=new mongoose.Schema<IDeliveryAssigment>({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    bordcastedTo:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["brodcasted", "assigned", "completed"],
        default:"brodcasted"
    },
    acceptedAt:{
         type:Date
    }
},{timestamps:true})

const DeliveryAssigment=mongoose.models.DeliveryAssigment || mongoose.model("DeliveryAssigment",
    deliveryAssignmentSchema
)

export default DeliveryAssigment;