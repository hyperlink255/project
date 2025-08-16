import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { AppContext } from '../../../context/AppContext'
import { createAxiosInstance } from '../../../services/axiosInstance'

const CreateEvents = () => {
  const location = useLocation()
  const {eventId} = location.state || {};
  const { BACKEND_URL} = useContext(AppContext)
  const axios = createAxiosInstance(BACKEND_URL)
  const quillRef = useRef(null)
  const [image, setImage] = useState(null)
  const editorRef = useRef(null)
  const [events, setEvents] = useState({
    title: "",
    category: "",
    date: "",
    location: "",
    price: "",
    totalTickets: "",
    availableTickets: "",
  })
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow"
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvents({ ...events, [name]: value })
  }

  const handleEmpty = () => {
    setEvents({
      title: "",
      category: "",
      date: "",
      location: "",
      price: "",
      totalTickets: "",
      availableTickets: "",
    })
    setImage(null)
    if (quillRef.current) {
      quillRef.current.setContents([])
    }
  }

  const createEvents = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (image) {
      formData.append("image", image)
    }
    formData.append("title", events.title)
    formData.append("description", quillRef.current.root.innerHTML)
    formData.append("category", events.category)
    formData.append("date", events.date)
    formData.append("price", events.price)
    formData.append("location", events.location)
    formData.append("totalTickets", events.totalTickets)
    formData.append("availableTickets", events.availableTickets)
    try {
      const res = await axios.post('/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }

      })
      if (res.status === 201) {
        toast.success(res.data.message)
        handleEmpty()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleUpdate  = async (e) => {
    try{
        const res = await axios.put(`/api/events/${eventId}`, {
          ...events,
          description: quillRef.current.root.innerHTML,
          image:image ? image : undefined
        }, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if(res.status === 200){
          toast.success(res.data.message)
        }else{
          toast.error(res.data.message)
        }
    }catch(error){
      toast.error(error.message)
    }
  }

  const handleSubmit = () => {
        if(eventId){
          handleUpdate()
          return
        }
        createEvents()
  }

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start 
        justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        <div className="flex flex-col gap-1">
          <p >Title</p>
          <input onChange={handleChange} name="title" value={events.title} type="text" className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-300' required placeholder='Type here' />
        </div>
        <div className="flex flex-col gap-1">
          <p className="">Description</p>
          <div ref={editorRef}></div>
        </div>
        <div className="flex items-center gap-2 justify-between mt-2 flex-wrap md:flex-nowrap">
          <div className='w-2/4'>
            <div className="flex flex-col gap-1">
              <p>Price</p>
              <input onChange={handleChange} name="price" value={events.price} type="number" className='outline-none md:py-2.5 w-full  py-2 px-3 rounded border border-gray-500' required placeholder='0' />
            </div>
          </div>
          <div className='w-2/4'>
            <div className="flex  flex-col ">
              <p>Thumbnail</p>
              <label htmlFor='thumbnailImage' className='flex items-center  gap-3'>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} className='outline-none md:py-2.5 w-full  py-2 px-3 rounded border border-gray-500'
                  id='thumbnailImage' accept='image/*' />
              </label>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div className="w-2/4">
            <div className="flex flex-col gap-1 mt-2">
              <p>Date</p>
              <input type="date"
                value={events.date} name="date" onChange={handleChange} className='outline-none md:py-2.5 w-full py-2 px-3 rounded border border-gray-500' />
            </div>
          </div>
          <div className="w-2/4">
            <div className="flex flex-col gap-1 mt-2">
              <p>Location</p>
              <input type="text"
                name="location" value={events.location}
                onChange={handleChange}
                className='outline-none md:py-2.5 w-full py-2 px-3 rounded border border-gray-500' />
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className="w-2/4">
            <div className="flex flex-col gap-1 mt-2">
              <p>TotalTickets</p>
              <input type="number"
                name="totalTickets"
                value={events.totalTickets}
                onChange={handleChange}
                className='outline-none md:py-2.5 w-full py-2 px-3 rounded border border-gray-500' />
            </div>
          </div>
          <div className="w-2/4">
            <div className="flex flex-col gap-1 mt-2">
              <p>AvailableTickets</p>
              <input type="number"
                value={events.availableTickets}
                name="availableTickets"
                onChange={handleChange}
                className='outline-none md:py-2.5 w-full py-2 px-3 rounded border border-gray-500' />
            </div></div>
        </div>
        <div className='flex gap-2 flex-col '>
          <p>Category</p>
          <select
            name="category"
            onChange={handleChange}
            value={events.category}
            className='outline-none md:py-2.5 w-full py-2 px-3 rounded border border-gray-500' >
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
            <option value="Conference">Conference</option>

          </select>
        </div>
        <button type='submit' className='bg-black text-white w-max py-2.5 cursor-pointer px-8 rounded my-4'>
                          {eventId ? "UPDATE EVENTS" : "CREATE EVENTS" }
        </button>
      </form>
    </div>
  )
}

export default CreateEvents