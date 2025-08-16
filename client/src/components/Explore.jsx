import React, { useContext, useMemo, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { FaEye } from 'react-icons/fa';


const Explore = () => {
  const [update, setUpdate] = useState('All')
  const { events, category, setCategory,navigate } = useContext(AppContext);

  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      if (category && item.category !== category) return false;
      return true;
    });
  }, [events, category]);

  return (
    <div className='bg-[#F5F7F9] md:px-0 px-8'>
      <div className='py-10'>
        <div className='max-w-6xl m-auto'>
          <h1 className='text-3xl font-semibold'>Explore Events</h1>
          <div className='mt-5'>
            {/* Date Filters */}
            <ul className="flex flex-wrap justify-center gap-2">
              {["All", "Today", "Tomorrow", "This Week", "This Weekend", "Next Week",
                "Next Weekend", "This Month", "Next Month", "This Year", "Next Year"].map((item, i) => (
                  <li
                    key={i}
                    onClick={() => setUpdate(item)}
                    className={`border border-gray-300 px-4 text-[14px] cursor-pointer ${item === update ? "bg-[#EFEFEF]" : "bg-white"} py-1 rounded-4xl`}
                  >
                    {item}
                  </li>
                ))
              }
            </ul>

            <div className="mt-5">
              <ul className="flex flex-wrap justify-center gap-2">
                {["All", "Music", "Sports", "Workshop", "Conference"].map((item, i) => (
                  <li
                    key={i}
                    onClick={() => setCategory(item === "All" ? "" : item)}
                    className={`text-sm bg-white cursor-pointer px-5 py-1 ${item === category || (item === "All" && category === "") ? 'border-b-2 border-green-400' : 'border-transparent'}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='mt-5'>
              {filteredEvents.length === 0 ? (
                <p className="text-center text-red-500 font-semibold">DATA NOT MATCH</p>
              ) : (
                <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                  {filteredEvents.map((item, i) => (
                    <div key={i} className='bg-white md:h-[350px] h-auto shadow relative'>

                      <img
                        className='w-full object-center h-[200px] align-middle'
                        src={item.image}
                        alt=""
                      />
                      <div className='px-5 py-5'>
                        <h4 className='font-semibold'>{item.title}</h4>
                        <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                        <button className='bg-blue-500 text-white cursor-pointer mt-5 px-4 py-2 rounded' onClick={() => navigate(`/booking/${item._id}`)}>Book Now</button>
                      </div>
                      <div onClick={() => navigate(`/events/${item._id}`)} className='absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center bg-[#7AD254] text-white cursor-pointer'>
                        <FaEye/>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore
