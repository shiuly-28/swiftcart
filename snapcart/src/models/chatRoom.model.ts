import mongoose from "mongoose";

interface IChatRoom{
    // _id:?mongoose.Types.ObjectId,
    userId:mongoose.Types.ObjectId,
    deliveryBoyId:mongoose.Types.ObjectId
}