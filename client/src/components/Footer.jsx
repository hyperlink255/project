import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className='bg-[#1C2131]'>
      <div className="max-w-6xl m-auto  text-white">
         <div className='grid md:grid-cols-4 grid-cols-2 py-10'>
           <ul className="flex flex-col gap-2">
            <li><h4 className='text-lg'>Comapany</h4></li>
            <li className="text-sm font-semibold">About Us</li>
            <li className="text-sm font-semibold">Help Center</li>
            <li className="text-sm font-semibold">Faq</li>
            <li className="text-sm font-semibold">Contact Us</li>
           </ul>
            <ul className="flex flex-col gap-2">
             <li><h4 className='text-lg'>UsefulLinks</h4></li>
            <li className="text-sm font-semibold">Create Event</li>
            <li className="text-sm font-semibold">Sell Tickets Online</li>
            <li className="text-sm font-semibold">Privacy Policy</li>
            <li className="text-sm font-semibold">Terms & Condition</li>
           </ul>
           <ul className="flex flex-col gap-2">
            <li><h4 className='text-lg'>Resourses</h4></li>
            <li className="text-sm font-semibold">Pricing</li>
            <li className="text-sm font-semibold">Blog</li>
            <li className="text-sm font-semibold">Refer a Freind</li>
           </ul>
            <ul className="flex flex-col gap-2">
            <li><h4 className='text-lg'>Fllow Us</h4></li>
            <li className="text-sm font-semibold flex gap-2">
              <span className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'><FaFacebookSquare/></span>
              <span className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'><FaInstagram/></span>
              <span className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'><FaTwitter/></span>
              <span className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'><FaLinkedinIn/></span>
              <span className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'><FaYoutube/></span>
            </li>
           </ul>
         </div>
      </div>
      <div className='border-t py-8 border-gray-200/10 w-full text-center text-white'>
      <p>© {new Date().getFullYear()} All rights reserved. Powered by Gambolthemes</p>
      </div>
    </footer>
  )
}

export default Footer