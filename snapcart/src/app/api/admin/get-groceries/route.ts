import Grocery from "@/models/grocery.model";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const groceries=await Grocery.find({})
        return NextResponse.json(groceries,{status:20})
    }catch(error){
        return NextResponse.json({message:`get groceris error ${error}`}, {status:200})
    }
}