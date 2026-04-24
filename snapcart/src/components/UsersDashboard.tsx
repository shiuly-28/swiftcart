import React from 'react';
import HeroSection from './HeroSection';
import CategorySlider from './CategorySlider';
import connectDb from '@/lib/db';
import Grocery from '@/models/grocery.model';
import GroceryItemCard from './GroceryItemCard';
import { FolderOpen } from 'lucide-react';

async function UsersDashboard () {
    await connectDb()
    const groceries=await Grocery.find({})
    const plainGrocery = JSON.parse(JSON.stringify(groceries))
    return (
        <>
            <HeroSection/>
            <CategorySlider/>
           <div className='w-[80%] md:w-[80%] mx-auto mt-10'>
            <h2 className='text-center font-bold text-2xl mb-5 text-amber-500'> Fresh Food Items</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                 {plainGrocery.map((item:any, index:number)=>(
            <GroceryItemCard key={index } item={item}/>
            ))}
            </div>
           </div>
        </>
    );
};

export default UsersDashboard;