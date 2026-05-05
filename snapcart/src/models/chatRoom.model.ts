import mongoose from "mongoose";

interface IChatRoom{
    userId:mongoose.Types.ObjectId,
    deliveryBoyId:mongoose.Types.ObjectId,
    orderId:mongoose.Types.ObjectId,
}
const chatRoomSchema=new mongoose.Schema<IChatRoom>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    deliveryBoyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

}, {timestamps:true})

const ChatRoom=mongoose.models.ChatRoom || mongoose.model("ChatRoom",
    chatRoomSchema)

export default ChatRoom