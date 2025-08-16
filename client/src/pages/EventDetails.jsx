   import React, { useContext, useEffect, useState } from 'react'
import {createAxiosInstance} from '../services/axiosInstance'
import { AppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { IoIosStarOutline } from "react-icons/io";
import { Star } from 'lucide-react'

const EventDetails = () => {
  const {BACKEND_URL} = useContext(AppContext)
  const [eventsDetails, setEventsDetails] = useState(null)
  const {id} = useParams()
  const [rating, setRating] = useState(null)
  const axios  = createAxiosInstance(BACKEND_URL)

  const handleSingleEvents = async () => {
      try{
       const res = await axios.get(`/api/events/${id}`)
       if(res.status === 200){
        setEventsDetails(res.data.event)
        console.log(res.data.event)
       }
      }catch(error){
        toast.error(error.message)
      }
  }
  useEffect(() => {
    handleSingleEvents()
  },[id])

  const handleRating = (rating) => {
    setRating(rating);
  }
  
  return (
    <div className='my-5'>
    <div className='max-w-6xl m-auto'>
        <div className='flex  justify-between'>
         <div className="w-2/4">
          <img src={eventsDetails?.image} alt="Event" className='w-full h-[500px] object-contain rounded-lg' />
         </div>
         <div className='w-2/4'>
        <h1 className='text-3xl font-bold'>{eventsDetails?.title}</h1>
        <p className='mt-4' dangerouslySetInnerHTML={{ __html: eventsDetails?.description }}></p>
        <p className='mb-2'>{eventsDetails?.location}</p>
        <p className='mb-2'>{new Date(eventsDetails?.date).toLocaleDateString()}</p>
        <p className='mb-2'>{eventsDetails?.organizer?.name}</p>
        <div className='flex gap-5 mt-5'>
          {
            Array.from({length:5}).map((_,index) => {
              return (
                <div key={index} className={`text-2xl fill-current cursor-pointer ${rating === index + 1 ? 'text-yellow-500 ' : 'text-gray-400'}`} onClick={() => handleRating(index + 1)}>
                  <Star className='fill-current w-6 h-6'/></div>
              )
            })
          }
          
        </div>
        <div className='text-right justify-end flex-col' >
          <textarea rows={4} className='w-full border outline-none mt-5 border-gray-300 p-2 rounded-lg' placeholder='Leave a comment...'></textarea>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer'>Submit</button>
        </div>
         </div>
        </div>
    </div>
    </div>
  )
}

export default EventDetails