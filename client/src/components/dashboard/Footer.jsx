import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center
     justify-between text-left w-full px-8 border-t'>
      <div className='flex items-center gap-4'>
      <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
      <p className='py-4 text-center text-xs md:text-sm text-gray-500'>
        Copyright {new Date().getFullYear()} .All Right Reserved.
      </p>
      </div>
      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href='#' className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'>
          <FaFacebookSquare />
        </a>
        <a href='#' className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'>
          <FaTwitter />
        </a>
        <a href='#' className='w-[40px]  h-[40px]  border-2 border-gray-400 inline-flex items-center transition-all duration-500 hover:bg-[#6AC045] cursor-pointer justify-center text-[20px] rounded-full'>
          <FaInstagram />
        </a>
 
      </div>
    </footer>
  )
}

export default Footer