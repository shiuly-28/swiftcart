"use client"
import React from 'react';
import {motion} from "motion/react"
import Link from 'next/link';
import { Github, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <motion.div
    initial={{opacity:0, y:40}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true, amount: 0.3}}
    className='bg-linear-to-r from-amber-500 to-amber-600 text-white mt-20'
    >
      <div className='w-[90%] md:w-[80%] mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10
      border-b border-amber-500/40'>
        <div>
          <h2 className='text-2xl font-bold mb-3'>SwiftCart</h2>
        <p className='text-sm text-amber-100 leading-relaxed'>Your one-stop online grocery store delivering fresness to your doorstop.
          Shop smart, eat fresh, and save more  every day!
        </p>
        </div>
        <div>
        <h2 className='text-xl font-semibold mb-3'>Quick Links</h2>
        <ul className='space-y-2 font-semibold mb-3'>
          <li><Link href={"/"} className='hover:text-white transition'/>Home</li>
          <li><link href={"/cart"} className='hover:text-white transition'/>Cart</li>
          <li><link href={"/my-orders"} className='hover:text-white transition'/>My Orders</li>
        </ul>
      </div>

      <div>
        <h3 className='text-xl font-semibold mb-3'>Contact Us</h3>
        <ul className='space-y-2 text-amber-100 text-sm'>
          <li className='flex items-center gap-2'>
            <MapPin size={16} /> Dhaka, Bangladesh
          </li>
          <li className='flex items-center gap-2'>
            <Phone size={16}/> 01757321528
          </li>
          <li className='flex items-center gap-2'>
            <Mail size={16} />support@switcart.com
          </li>
        </ul>
        <div className='flex gap-4 mt-4'>
          <Link href="https://www.linkedin.com/in/halima-akhter-shiuly/" target='_blank'>
          <Linkedin className='w-5 h-5 hover:text-white transition '/></Link>
          <Link href="https://github.com/shiuly-28" target='_blank'>
          <Github className='w-5 h-5 hover:text-white transition ' /></Link>
          <Link href="" target='_blank'>
          <Instagram className='w-5 h-5 hover:text-white transition '/></Link>
         
        </div>
      </div>
      </div>

      <div></div>
      
    </motion.div>
  );
};

export default Footer;