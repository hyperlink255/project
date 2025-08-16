import React from 'react'
import { Star } from 'lucide-react';
import Slider from 'react-slick'
import { FaQuoteRight } from "react-icons/fa";
import { Quote } from 'lucide-react';
const Transforming = () => {
  const settings1 = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    gap:5,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]

  };

  return (
    <div className='bg-[#F5F7F9] px-0 md:px-8 mt-10 py-10'>
      <div className="max-w-6xl m-auto">
        <h1 className='text-3xl font-semibold'>Transforming Thousands of Event Hosts Just Like You</h1>
        <div className="  border-b-2 border-gray-200 ">
          <div className='w-3/4'>
            <p className="text-[16px] my-8 text-gray-500 leading-8 ">
              Be part of a winning team. We are continuously thriving to bring the best to our customers. Be that a new product feature, help in setting up your events or even supporting your customers so that they can easily buy tickets and participate your in events. Here is what some of the clients have to say,
            </p>
          </div>
        </div>
        <div className="mt-5">
          {<Slider {...settings1}  >
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg text-gray-500 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci commodi ullam corrupti. Est id natus, similique dicta blanditiis consequuntur! lorem10
              </p>
              <div className="flex justify-between mt-5 items-center ">
                <div>
                  <h4 className="text-lg font-semibold">John Doe</h4>
                  <span className='text-gray-400 block mt-3'>Event Manger</span>
                  <ul className="flex items-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <li className="text-yellow-500 text-[20px]" key={i}>
                        <Star className="fill-current text-yellow-500 w-4 h-4" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='self-end-safe '>
                  <FaQuoteRight className='text-gray-300 text-5xl ' />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md ">
              <p className="text-lg text-gray-500 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci commodi ullam corrupti. Est id natus, similique dicta blanditiis consequuntur! lorem10
              </p>
              <div className="flex justify-between mt-5 items-center ">
                <div>
                  <h4 className="text-lg font-semibold">John Doe</h4>
                  <span className='text-gray-400 block mt-3'>Event Manger</span>
                  <ul className="flex items-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <li className="text-yellow-500 text-[20px]" key={i}>
                        <Star className="fill-current text-yellow-500 w-4 h-4" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='self-end-safe '>
                  <FaQuoteRight className='text-gray-300 text-5xl ' />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md ">
              <p className="text-lg text-gray-500 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo adipisci commodi ullam corrupti. Est id natus, similique dicta blanditiis consequuntur! lorem10
              </p>
              <div className="flex justify-between mt-5 items-center ">
                <div>
                  <h4 className="text-lg font-semibold">John Doe</h4>
                  <span className='text-gray-400 block mt-3'>Event Manger</span>
                  <ul className="flex items-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <li className="text-yellow-500 text-[20px]" key={i}>
                        <Star className="fill-current text-yellow-500 w-4 h-4" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='self-end-safe '>
                  <FaQuoteRight className='text-gray-300 text-5xl ' />
                </div>
              </div>
            </div>
          </Slider>}
        </div>
      </div>
    </div>
  )
}

export default Transforming